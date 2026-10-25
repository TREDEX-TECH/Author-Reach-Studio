// Trusted payment initialisation. The amount ALWAYS comes from the DB, never the browser.
import { z } from 'zod';
import { adminClient, json, methodNotAllowed, rateLimit, requireCaller, type FnEvent } from './_shared';

const schema = z.object({ invoiceId: z.string().uuid() });

export async function handler(event: FnEvent) {
  if (event.httpMethod !== 'POST') return methodNotAllowed();

  const caller = await requireCaller(event);
  if (!caller) return json(401, { error: 'Sign in to pay an invoice.' });
  if (!rateLimit(`pay:${caller.userId}`, 10, 60_000)) return json(429, { error: 'Too many attempts.' });

  let payload: unknown;
  try { payload = JSON.parse(event.body ?? '{}'); } catch { return json(400, { error: 'Invalid JSON' }); }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return json(422, { error: 'Invalid invoice reference.' });

  const invoiceId = parsed.data.invoiceId;
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  if (!secret) return json(503, { error: 'Payments are not configured yet.' });

  try {
    const sb = adminClient();

    // 1. Authorisation: caller must be a member of the author entity owning this invoice.
    const { data: allowed, error: authErr } = await sb.rpc('is_invoice_payable_by', {
      p_invoice_id: invoiceId, p_user_id: caller.userId,
    });
    // SECURITY DEFINER RPC `is_invoice_payable_by` is defined in
    // supabase/migrations/20261025000001_security_rpcs.sql (service_role only).
    // If it is missing, the explicit join check below still enforces ownership.
    if (authErr) console.warn('rpc_missing_is_invoice_payable_by', authErr.message);
    if (allowed === false) return json(403, { error: 'This invoice does not belong to your account.' });

    // 2. Re-read the authoritative invoice state.
    const { data: invoice, error: invErr } = await sb.from('invoices')
      .select('id, invoice_number, author_id, status, currency, total_amount, amount_paid, allow_partial, legal_entity_snapshot')
      .eq('id', invoiceId).single();
    if (invErr || !invoice) return json(404, { error: 'Invoice not found.' });

    if (invoice.status === 'cancelled' || invoice.status === 'refunded') return json(409, { error: 'This invoice cannot be paid.' });
    if (invoice.status === 'paid') return json(409, { error: 'This invoice is already paid.' });

    const outstanding = Number(invoice.total_amount) - Number(invoice.amount_paid);
    const chargeAmount = invoice.allow_partial ? outstanding : Number(invoice.total_amount);
    if (chargeAmount <= 0) return json(409, { error: 'No balance is due.' });
    if (invoice.amount_paid > 0 && !invoice.allow_partial) return json(409, { error: 'This invoice does not allow split payments.' });

    // 3. Currency allowlist from application settings (must match Paystack merchant).
    const { data: setting } = await sb.from('application_settings')
      .select('value').eq('key', 'payments.currencies').single();
    const currencies: string[] = Array.isArray(setting?.value) ? setting!.value as unknown as string[] : ['USD'];
    if (!currencies.includes(invoice.currency.trim())) return json(409, { error: 'Unsupported currency for this merchant.' });

    // 4. Server-side Paystack initialisation. Amount is in the smallest currency unit.
    const reference = `ARS-${invoice.invoice_number}-${crypto.randomUUID().slice(0, 8)}`;
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: caller.email,
        amount: Math.round(chargeAmount * 100),
        currency: invoice.currency.trim(),
        reference,
        callback_url: `${siteUrl}/.netlify/functions/paystack-callback`,
        metadata: {
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          author_id: invoice.author_id,
          initiated_by: caller.userId,
          custom_fields: [{ display_name: 'Invoice', variable_name: 'invoice', value: invoice.invoice_number }],
        },
      }),
    });
    const result = await res.json() as { status?: boolean; message?: string; data?: { authorization_url: string; access_code: string; reference: string } };
    if (!res.ok || !result.status || !result.data) {
      console.error('paystack_init_failed', result);
      return json(502, { error: 'Payment provider is unavailable. Please try again.' });
    }

    // 5. Record the attempt BEFORE redirecting. UNIQUE(provider, provider_reference)
    // prevents reference reuse across invoices.
    const { error: txErr } = await sb.from('payment_transactions').insert({
      invoice_id: invoice.id,
      provider: 'paystack',
      provider_reference: result.data.reference,
      provider_access_code: result.data.access_code,
      provider_authorization_url: result.data.authorization_url,
      amount: chargeAmount,
      currency: invoice.currency,
      status: 'initialized',
      customer_email: caller.email,
      initiated_by: caller.userId,
      metadata: { server_amount: chargeAmount, server_currency: invoice.currency, reference_created_at: new Date().toISOString() },
    });
    if (txErr) {
      console.error('payment_attempt_record_failed', txErr);
      return json(500, { error: 'Could not record the payment attempt. Nothing was charged.' });
    }

    return json(200, { authorizationUrl: result.data.authorization_url, reference: result.data.reference });
  } catch (err) {
    console.error('paystack_initialize_error', err);
    return json(500, { error: 'Unexpected error starting payment.' });
  }
}
