// Public inquiry intake. Anonymous by design, but validated + rate-limited.
// The browser NEVER writes to `inquiries` directly — that table has no anon INSERT policy.
import { z } from 'zod';
import { adminClient, json, methodNotAllowed, rateLimit, type FnEvent } from './_shared';

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  authorName: z.string().trim().max(160).optional().or(z.literal('')),
  bookTitle: z.string().trim().max(200).optional().or(z.literal('')),
  serviceInterest: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(4000),
  source: z.string().trim().max(80).default('website'),
  sourceUrl: z.string().trim().max(500).optional().or(z.literal('')),
  consent: z.literal(true),
  website: z.string().max(0).optional(), // honeypot — must be empty
});

export async function handler(event: FnEvent) {
  if (event.httpMethod !== 'POST') return methodNotAllowed();

  const ip = event.headers['x-nf-client-connection-ip'] ?? event.headers['x-forwarded-for'] ?? 'unknown';
  if (!rateLimit(`inquiry:${ip}`, 5, 60_000)) {
    return json(429, { error: 'Too many requests. Please try again shortly.' });
  }

  let payload: unknown;
  try { payload = JSON.parse(event.body ?? '{}'); } catch { return json(400, { error: 'Invalid JSON' }); }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) return json(422, { error: 'Please check the form', issues: parsed.error.flatten().fieldErrors });

  const d = parsed.data;
  // Basic spam heuristics; a real scoring provider can be added later.
  const spamScore = /https?:\/\//i.test(d.message) ? 35 : 0;

  try {
    const sb = adminClient();
    const { data, error } = await sb.from('inquiries').insert({
      full_name: d.fullName,
      email: d.email,
      phone: d.phone || null,
      author_name: d.authorName || null,
      book_title: d.bookTitle || null,
      service_interest: d.serviceInterest || null,
      message: d.message,
      source: d.source,
      source_url: d.sourceUrl || null,
      consent_given: d.consent,
      spam_score: spamScore,
      status: spamScore > 80 ? 'spam' : 'new',
    }).select('reference').single();

    if (error) throw error;

    // TODO Phase 7: enqueue an in-app notification to the CRM owner and an
    // acknowledgement email. Deduplicate on event_key = `inquiry:${reference}:new`.
    return json(201, {
      ok: true,
      reference: data.reference,
      message: 'Thank you. Our team will respond within two business days.',
    });
  } catch (err) {
    console.error('inquiry_insert_failed', err);
    return json(500, { error: 'We could not save your message. Please email us directly.' });
  }
}
