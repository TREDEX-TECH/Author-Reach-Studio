// Public site configuration. Contact details come from environment variables so
// they can be changed per environment without a code change. No invented data.
const env = (key: string, fallback = '') => (process.env[key] || fallback).trim();

export const SITE = {
  name: 'Author Reach Studio',
  parent: 'Tredex',
  relationship: 'Author Reach Studio is a specialist brand of Tredex.',
  email: env('NEXT_PUBLIC_CONTACT_EMAIL', 'hello@authorreachstudio.com'),
  phone: env('NEXT_PUBLIC_CONTACT_PHONE'),
  address: env('NEXT_PUBLIC_CONTACT_ADDRESS'),
  url: env('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
  env: env('NEXT_PUBLIC_APP_ENV', 'production'),
};

// Backwards-compatible alias used by invoices/footer/legal pages.
export const BRAND = SITE;

/** Server-side switch. Set REQUIRE_AUTH=true in production once user accounts exist. */
export const requireAuth = () => process.env.REQUIRE_AUTH === 'true';

export const hasSupabase = () => {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const k = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return !!u && !!k && !k.includes('YOUR_') && !u.includes('YOUR-');
};
