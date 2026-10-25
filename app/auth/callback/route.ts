import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/portal';
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/portal';
  if (code) {
    try {
      const sb = await createClient();
      await sb.auth.exchangeCodeForSession(code);
    } catch { /* fall through to sign-in with an error hint */ }
  }
  return NextResponse.redirect(new URL(code ? safeNext : '/sign-in', url.origin));
}
