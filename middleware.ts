// Route protection + session refresh.
//
// DORMANT BY DEFAULT: while NEXT_PUBLIC_DEMO_MODE is true (or Supabase env vars
// are missing) this middleware does nothing, so the design preview keeps working.
// Phase 2 flips demo mode off and this becomes the auth boundary for all three
// private interfaces. Server-side authorization still runs on every page and
// function — this middleware is only the first line of defence.
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PRIVATE_PREFIXES = ['/portal', '/workspace', '/admin'];
const AUTH_ROUTES = ['/sign-in', '/auth/callback', '/auth/reset'];

export async function middleware(request: NextRequest) {
  const demo = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (demo || !url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options as never));
      },
    },
  });

  // Refreshes the session cookie and populates supabase.auth.getUser() downstream.
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isPrivate = PRIVATE_PREFIXES.some(p => path === p || path.startsWith(p + '/'));
  const isAuthRoute = AUTH_ROUTES.some(p => path === p || path.startsWith(p + '/'));

  if (isPrivate && !user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/sign-in';
    redirect.searchParams.set('next', path);
    return NextResponse.redirect(redirect);
  }
  if (isAuthRoute && user && path === '/sign-in') {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/portal';
    redirect.search = '';
    return NextResponse.redirect(redirect);
  }
  return response;
}

export const config = {
  // Skip static assets and the Netlify Functions / API paths.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)'],
};
