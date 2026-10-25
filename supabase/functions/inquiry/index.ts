// Public inquiry intake — trusted server function. No external imports (plain
// fetch to PostgREST), so the edge runtime boots reliably. The browser never
// writes to `inquiries` directly: there is no anon INSERT policy. Service-role
// credentials are injected by Supabase at runtime and never shipped to clients.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
};

const hits = new Map();
function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const r = hits.get(key);
  if (!r || r.reset < now) { hits.set(key, { n: 1, reset: now + windowMs }); return true; }
  r.n += 1;
  return r.n <= max;
}
const str = (v, max) => typeof v === 'string' ? v.trim().slice(0, max) : '';
const reply = (status, data) => new Response(JSON.stringify(data), { status, headers: CORS });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return reply(405, { error: 'Method not allowed' });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (!rateLimit('inquiry:' + ip, 5, 60000)) return reply(429, { error: 'Too many requests. Please try again shortly.' });

  let body;
  try { body = await req.json(); } catch { return reply(400, { error: 'Invalid JSON' }); }

  // Honeypot — real users never fill the hidden field.
  if (str(body.website, 200)) return reply(200, { ok: true, reference: 'SPAM-FILTERED' });

  const fullName = str(body.fullName, 120);
  const email = str(body.email, 254);
  const message = str(body.message, 4000);
  if (fullName.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 10 || body.consent !== true) {
    return reply(422, { error: 'Please check the form. Name, a valid email, a message of at least 10 characters and consent are required.' });
  }

  const spamScore = /https?:\/\//i.test(message) ? 35 : 0;
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return reply(503, { error: 'Service not configured.' });

  const payload = {
    full_name: fullName,
    email: email,
    phone: str(body.phone, 40) || null,
    author_name: str(body.authorName, 160) || null,
    book_title: str(body.bookTitle, 200) || null,
    service_interest: str(body.serviceInterest, 120) || null,
    message: message,
    source: str(body.source, 80) || 'website',
    source_url: str(body.sourceUrl, 500) || null,
    consent_given: true,
    spam_score: spamScore,
    status: spamScore > 80 ? 'spam' : 'new',
  };

  const res = await fetch(url + '/rest/v1/inquiries?select=reference', {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error('inquiry_insert_failed', res.status, await res.text());
    return reply(500, { error: 'We could not save your message. Please email us directly.' });
  }
  const rows = await res.json();
  return reply(201, {
    ok: true,
    reference: rows[0]?.reference,
    message: 'Thank you. Our team will respond within two business days.',
  });
});
