// THE ONLY place a payment becomes "success". Idempotent + signature-verified.
// A browser redirect to a success page NEVER changes financial state.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { adminClient, json, methodNotAllowed, type FnEvent } from './_shared';

function validSignature(rawBody: string, signature: string | undefined, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac('sha512', secret).update(rawBody).digest('hex');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(signature, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function handler(event: FnEvent) {
  if (event.httpMethod !== 'POST') return methodNotAllowed();
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return json(503, { error: 'Payments not configured.' });

  const raw = event.body ?? '';
  // Netlify gives us the raw body; NEVER re-stringify a parsed object before hashing.
  if (!validSignature(raw, event.headers['x-paystack-signature'], secret)) {
    console.warn('invalid_paystack_signature');
    return json(401, { error: 'Invalid signature' });
  }

  let evt: { event?: string; data?: Record<string, unknown> };
  try { evt = JSON.parse(raw); } catch { return json(400, { error: 'Invalid payload' }); }

  const sb = adminClient();
  const providerEventId = (evt.data?.id ?? evt.data?.reference ?? crypto.randomUUID()) as string;

  // Idempotency: if this exact event was already processed successfully, stop here.
  const { data: existing } = await sb.from('payment_events')
    .select('id, processing_result').eq('provider_event_id', String(providerEventId)).maybeSingle();
  if (existing?.processing_result === 'verified') {
    return json(200, { received: true, duplicate: true });
  }

  const { error: logErr } = await sb.from('payment_events').insert({
    provider_event_id: String(providerEventId),
    event_type: evt.event ?? 'unknown',
    payload: evt as unknown as Record<string, unknown>,
    signature_valid: true,
    processing_result: 'received',
  });
  if (logErr && logErr.code === '23505') return json(200, { received: true, duplicate: true });
  if (logErr) { console.error('event_log_failed', logErr); return json(500, { error: 'Event log failed' }); }

  if (evt.event !== 'charge.success') {
    return json(200, { received: true, ignored: evt.event });
  }

  const reference = evt.data?.reference as string | undefined;
  if (!reference) return json(400, { error: 'Missing reference' });

  try {
    // 1. Re-verify with Paystack. Never trust webhook body alone.
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const verified = await res.json() as {
      status?: boolean;
      data?: { status?: string; reference?: string; amount?: number; currency?: string; id?: string;
               metadata?: { invoice_id?: string; author_id?: string } };
    };
    if (!res.ok || !verified.status || verified.data?.status !== 'success') {
      return json(200, { received: true, ignored: 'not_verified' });
    }

    const v = verified.data;
    // 2. Find our own attempt and its invoice — never invent one from webhook data.
    const { data: tx, error: txErr } = await sb.from('payment_transactions')
      .select('id, invoice_id, amount, currency, status, verified_at')
      .eq('provider', 'paystack').eq('provider_reference', reference).single();
    if (txErr || !tx) {
      console.error('unknown_reference', reference);
      return json(200, { received: true, ignored: 'unknown_reference' });
    }
    if (tx.status === 'success' && tx.verified_at) {
      return json(200, { received: true, duplicate: true });
    }

    // 3. Cross-check amount, currency and invoice association.
    const expectedKobo = Math.round(Number(tx.amount) * 100);
    if (Number(v.amount) !== expectedKobo || String(v.currency).trim() !== tx.currency.trim()) {
      console.error('amount_currency_mismatch', { expectedKobo, got: v.amount });
      return json(200, { received: true, ignored: 'mismatch' });
    }
    const { data: invoice } = await sb.from('invoices')
      .select('id, total_amount, amount_paid, status, allow_partial')
      .eq('id', tx.invoice_id).single();
    if (!invoice) return json(200, { received: true, ignored: 'invoice_missing' });
    if (invoice.status === 'cancelled' || invoice.status === 'refunded') {
      return json(200, { received: true, ignored: 'invoice_not_payable' });
    }
    const outstanding = Number(invoice.total_amount) - Number(invoice.amount_paid);
    if (Number(tx.amount) > outstanding + 0.01) {
      return json(200, { received: true, ignored: 'overpayment' });
    }

    // 4. Mark the transaction verified exactly once, then derive invoice status.
    const { error: updErr } = await sb.from('payment_transactions')
      .update({ status: 'success', verified_at: new Date().toISOString(), verification_payload: verified })
      .eq('id', tx.id).eq('status', 'initialized');
    if (updErr) { console.error('tx_update_failed', updErr); return json(500, { error: 'Update failed' }); }

    const { error: recalcErr } = await sb.rpc('recalculate_invoice_status', { p_invoice_id: tx.invoice_id });
    if (recalcErr) { console.error('recalc_failed', recalcErr); return json(500, { error: 'Reconciliation failed' }); }

    // 5. Append-only event result + audit. Deduped notification via event_key.
    await sb.from('audit_events').insert({
      action: 'payment_verification', entity_type: 'payment_transactions', entity_id: tx.id,
      metadata: { reference, amount: tx.amount, currency: tx.currency, provider_event_id: String(providerEventId) },
    });

    return json(200, { received: true, verified: true });
  } catch (err) {
    console.error('webhook_processing_error', err);
    // Return 500 so Paystack retries; idempotency keeps that safe.
    return json(500, { error: 'Processing failed' });
  }
}
