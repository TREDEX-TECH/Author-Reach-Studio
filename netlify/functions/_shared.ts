// Shared helpers for Netlify Functions. Server-only. Never bundled to the browser.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type FnEvent = {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
  rawUrl?: string;
  queryStringParameters?: Record<string, string | undefined> | null;
};
export type FnResult = { statusCode: number; headers?: Record<string, string>; body: string };

export const json = (statusCode: number, data: unknown): FnResult => ({
  statusCode,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  },
  body: JSON.stringify(data),
});

export const methodNotAllowed = () => json(405, { error: 'Method not allowed' });

/** Service-role client. Bypasses RLS — only use after explicit caller authorisation. */
export function adminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Server configuration incomplete: Supabase URL/service key missing');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Resolve the caller from the Authorization header via a normal (RLS-respecting) client. */
export async function requireCaller(event: FnEvent): Promise<{ userId: string; email: string } | null> {
  const header = event.headers.authorization ?? event.headers.Authorization;
  const token = header?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishable) return null;
  const sb = createClient(url, publishable, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) return null;
  return { userId: data.user.id, email: data.user.email ?? '' };
}

/** Minimal in-memory rate limit. Replace with a durable store (Upstash) before launch. */
const hits = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, max = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || rec.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  rec.count += 1;
  return rec.count <= max;
}
