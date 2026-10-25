// Same-origin proxy to the trusted Supabase Edge Function.
// Keeps the browser away from direct table writes and avoids CORS.
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || key.includes('YOUR_') || url.includes('YOUR-')) {
    return NextResponse.json(
      { error: 'The enquiry service is not configured yet. Please email us directly.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${url}/functions/v1/inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        'x-forwarded-for': request.headers.get('x-forwarded-for') ?? '',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: 'We could not reach the enquiry service. Please try again or email us directly.' },
      { status: 502 },
    );
  }
}
