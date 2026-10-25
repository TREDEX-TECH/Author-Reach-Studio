// Session refresh for every request. Private dashboards are publicly viewable
// in read-only form (RLS returns no private rows to anonymous visitors).
// Set REQUIRE_AUTH=true in production once user accounts exist to add a hard
// sign-in wall. There is no preview-data switch.
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PRIVATE = ['/portal','/workspace','/admin'];
const AUTH_ROUTES = ['/sign-in','/auth/callback','/auth/reset'];

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || key.includes('YOUR_') || url.includes('YOUR-')) return NextResponse.next({ request });

  const gated = process.env.REQUIRE_AUTH === 'true';
  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet: { name:string; value:string; options?:Record<string,unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options as never));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isPrivate = PRIVATE.some(p => path === p || path.startsWith(p + '/'));
  const isAuthRoute = AUTH_ROUTES.some(p => path === p || path.startsWith(p + '/'));

  if (gated && isPrivate && !user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/sign-in';
    redirect.searchParams.set('next', path);
    return NextResponse.redirect(redirect);
  }
  if (isAuthRoute && user && path === '/sign-in') {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/portal'; redirect.search = '';
    return NextResponse.redirect(redirect);
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)'],
};
