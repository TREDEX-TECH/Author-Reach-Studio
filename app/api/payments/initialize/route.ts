// Same-origin proxy to the trusted Netlify payment function. The Supabase
// session token is forwarded; the server function re-checks identity and the
// invoice amount. Never accepts an amount from the browser.
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Online payments are not enabled yet. Please contact us to arrange payment.' },
      { status: 503 },
    );
  }
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error:'Invalid request.' }, { status:400 }); }
  const auth = request.headers.get('authorization') ?? '';
  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const target = new URL('/.netlify/functions/paystack-initialize', origin);
    const res = await fetch(target, {
      method:'POST', headers:{ 'Content-Type':'application/json', Authorization:auth },
      body: JSON.stringify(body), cache:'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error:'Payment service unavailable. No charge was made.' }, { status:502 });
  }
}
