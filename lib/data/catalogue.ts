// Live service catalogue. Server-side only — never bundled with a service-role key.
// Uses the PUBLISHABLE key and RLS: anon may read only `visibility = 'published'`.
// Falls back to the design-prototype data when Supabase is not configured.
import type { Service } from '@/lib/types';
import { services as demoServices } from '@/lib/demo-data';

type DbService = {
  slug: string; name: string; category: string | null;
  short_promise: string | null; description: string | null;
  scope_of_work: string | null; deliverables: string[] | null;
  eligibility: string | null; estimated_duration_days: number | null;
  pricing_mode: string | null; price_amount: number | string | null;
  currency: string | null; sort_order: number | null;
};

const SELECT = [
  'slug','name','category','short_promise','description','scope_of_work',
  'deliverables','eligibility','estimated_duration_days','pricing_mode',
  'price_amount','currency','sort_order',
].join(',');

function mapRow(r: DbService, i: number): Service {
  const price = r.price_amount === null || r.price_amount === undefined
    ? null : Number(r.price_amount);
  const scope = (r.scope_of_work ?? '')
    .split(/[;\n]/).map(s => s.trim()).filter(Boolean);
  return {
    slug: r.slug,
    name: r.name,
    category: r.category ?? 'Services',
    icon: String(i + 1).padStart(2, '0'),
    shortPromise: r.short_promise ?? '',
    description: r.description ?? '',
    scope: scope.length ? scope : (r.deliverables ?? []),
    deliverables: r.deliverables ?? [],
    eligibility: r.eligibility ?? 'Contact us to confirm eligibility.',
    duration: r.estimated_duration_days ? `~${r.estimated_duration_days} days` : 'Scope-dependent',
    pricing: price && r.pricing_mode === 'from_price'
      ? `From $${price.toLocaleString('en-US')}`
      : price ? `$${price.toLocaleString('en-US')}` : 'Custom proposal',
  };
}

export type Catalogue = { services: Service[]; source: 'live' | 'demo'; reason?: string };

export async function getCatalogue(): Promise<Catalogue> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || key.includes('YOUR_') || url.includes('YOUR-')) {
    return { services: demoServices, source: 'demo', reason: 'Supabase not configured' };
  }
  try {
    const res = await fetch(
      `${url}/rest/v1/services?select=${SELECT}&visibility=eq.published&order=sort_order.asc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, next: { revalidate: 60 } },
    );
    if (!res.ok) return { services: demoServices, source: 'demo', reason: `catalogue HTTP ${res.status}` };
    const rows = (await res.json()) as DbService[];
    if (!Array.isArray(rows) || rows.length === 0) {
      return { services: demoServices, source: 'demo', reason: 'catalogue empty' };
    }
    return { services: rows.map(mapRow), source: 'live' };
  } catch {
    return { services: demoServices, source: 'demo', reason: 'catalogue unreachable' };
  }
}

export async function getServiceBySlug(slug: string): Promise<{ service: Service | null } & Catalogue> {
  const c = await getCatalogue();
  return { ...c, service: c.services.find(s => s.slug === slug) ?? null };
}
