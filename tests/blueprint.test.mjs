// Dependency-free architecture + security regression tests.
// Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = p => readFileSync(join(ROOT, p), 'utf8');
const migrations = () => readdirSync(join(ROOT, 'supabase/migrations'))
  .filter(f => f.endsWith('.sql')).map(f => read(`supabase/migrations/${f}`)).join('\n');

function walk(dir, out = []) {
  for (const e of readdirSync(join(ROOT, dir))) {
    const p = join(dir, e);
    if (statSync(join(ROOT, p)).isDirectory()) walk(p, out);
    else out.push(p.replace(/\\/g, '/'));
  }
  return out;
}

test('schema contains every core table named in the blueprint', () => {
  const sql = migrations();
  const required = [
    'profiles','roles','permissions','user_roles','role_permissions','organizations','departments',
    'positions','department_memberships','reporting_relationships','authors','author_memberships',
    'books','book_contributors','client_notes','client_interactions','inquiries','services',
    'service_packages','proposals','proposal_versions','proposal_items','proposal_acceptances',
    'engagements','projects','project_members','milestones','tasks','task_assignments',
    'task_dependencies','task_comments','campaigns','campaign_channels','campaign_metrics',
    'deliverables','deliverable_versions','approvals','invoices','invoice_items',
    'payment_transactions','payment_events','refunds','financial_adjustments','conversations',
    'conversation_members','messages','notifications','notification_deliveries','file_metadata',
    'activity_events','audit_events','application_settings',
  ];
  const created = new Set([...sql.matchAll(/create table public\.(\w+)/g)].map(m => m[1]));
  const missing = required.filter(t => !created.has(t));
  assert.deepEqual(missing, [], `missing tables: ${missing.join(', ')}`);
});

test('RLS is enabled for every application table (no exceptions)', () => {
  const sql = migrations();
  const created = [...sql.matchAll(/create table public\.(\w+)/g)].map(m => m[1]);
  // There are several foreach loops; pick the one whose body enables RLS.
  const blocks = [...sql.matchAll(/foreach t in array array\[([\s\S]*?)\]\s*loop\s*execute format\('alter table public\.%I ([^']+)'/g)];
  const rlsBlock = blocks.find(b => b[2].includes('enable row level security'));
  assert.ok(rlsBlock, 'RLS enablement loop not found');
  const listed = new Set([...rlsBlock[1].matchAll(/'(\w+)'/g)].map(m => m[1]));
  const missing = created.filter(t => !listed.has(t));
  assert.deepEqual(missing, [], `tables without RLS: ${missing.join(', ')}`);
});

test('payment idempotency and notification dedupe constraints exist', () => {
  const sql = migrations();
  assert.match(sql, /unique\s*\(provider,\s*provider_reference\)/i, 'provider reference must be unique');
  assert.match(sql, /provider_event_id text unique/i, 'webhook event ids must be unique');
  assert.match(sql, /unique\s*\(user_id,\s*event_key,\s*channel\)/i, 'notifications must be deduplicated');
  assert.match(sql, /unique\s*\(proposal_id,\s*version_number\)/i, 'proposal versions must be unique');
});

test('immutable history triggers protect money and approvals', () => {
  const sql = migrations();
  for (const t of ['proposal_versions','payment_events','audit_events','proposal_items']) {
    assert.match(sql, new RegExp(`trg_${t}_immutable[\\s\\S]{0,160}prevent_mutation`, 'i'), `${t} must be append-only`);
  }
});

test('clients cannot write financial state or grant themselves roles', () => {
  const sql = migrations();
  for (const t of ['payment_transactions','payment_events','invoices','invoice_items','audit_events']) {
    assert.match(sql, new RegExp(`revoke[^;]*on public\\.${t}[^;]*from authenticated`, 'i'), `${t} must be read-only for clients`);
  }
  assert.match(sql, /revoke\s+update,\s*delete\s+on public\.user_roles\s+from authenticated/i);
  assert.match(sql, /revoke\s+insert\s+on public\.user_roles\s+from authenticated/i);
  assert.match(sql, /revoke all on function public\.recalculate_invoice_status\(uuid\) from public, anon, authenticated/i);
  assert.match(sql, /grant execute on function public\.recalculate_invoice_status\(uuid\) to service_role/i);
});

test('no server secret is exposed through a NEXT_PUBLIC_ variable', () => {
  const env = read('.env.example');
  const secrets = ['SUPABASE_SERVICE_ROLE_KEY','PAYSTACK_SECRET_KEY','EMAIL_API_KEY','SUPABASE_DB_PASSWORD'];
  for (const s of secrets) {
    assert.ok(env.includes(s), `${s} should be documented`);
    assert.doesNotMatch(env, new RegExp(`NEXT_PUBLIC_${s}\\s*=`), `${s} must never be public`);
  }
  assert.match(env, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(env, /\.env\.local/);
});

test('all internal navigation links resolve to a real page', () => {
  // Build the route table from the App Router filesystem.
  const routes = walk('app').filter(f => f.endsWith('/page.tsx')).map(f => {
    let r = f.replace(/^app\//,'').replace(/\/?page\.tsx$/,'');
    r = r.replace(/^\(public\)\/?/, '').replace(/^\(auth\)\/?/, '');
    if (r === '') return '/';
    return '/' + r;
  });
  const routeSet = new Set(routes.map(r => r === '/' ? '/' : r.replace(/\/$/,'')));
  assert.ok(routeSet.size > 25, `expected a substantial app, found ${routeSet.size} routes`);

  // Turn dynamic segments ([slug], [id]) into single-segment matchers.
  const matchers = [...routeSet].map(r => new RegExp('^' + r.replace(/\[[^\]]+\]/g, '[^/]+').replace(/\//g, '\\/') + '$'));
  const resolves = h => matchers.some(re => re.test(h.replace(/\/$/,'') || '/'));

  const nav = read('lib/navigation.ts');
  const hrefs = [...nav.matchAll(/href:\s*'([^']+)'/g)].map(m => m[1]);
  assert.ok(hrefs.length > 25, 'expected a full navigation config');
  const unresolved = [...new Set(hrefs.filter(h => !resolves(h)))];
  assert.deepEqual(unresolved, [], `navigation points at missing pages: ${unresolved.join(', ')}`);
});

test('decision register documents every open question with a recommendation', () => {
  const doc = read('docs/02-decisions-register.md');
  const rows = [...doc.matchAll(/^\|\s*(\d+)\s*\|/gm)].map(m => Number(m[1]));
  assert.ok(rows.length >= 20, `expected >=20 decisions, found ${rows.length}`);
  assert.deepEqual(rows, [...Array(rows.length)].map((_,i)=>i+1), 'decision numbering must be contiguous');
  assert.match(doc, /Your call/, 'each decision must be confirmable');
});

test('Paystack function never trusts a browser-supplied amount', () => {
  const fn = read('netlify/functions/paystack-initialize.ts');
  const schema = fn.match(/const schema = z\.object\(\{([^}]*)\}\)/);
  assert.ok(schema, 'input schema not found');
  assert.doesNotMatch(schema[1], /amount/, 'amount must not be accepted from the browser');
  assert.match(fn, /chargeAmount/, 'amount must be derived on the server');
  assert.match(fn, /is_invoice_payable_by/, 'ownership must be re-checked server-side');
  assert.match(fn, /application_settings/, 'currency allowlist must come from settings');
});

test('webhook verifies signature and re-verifies with Paystack before writing state', () => {
  const fn = read('netlify/functions/paystack-webhook.ts');
  assert.match(fn, /validSignature/, 'signature validation required');
  assert.match(fn, /api\.paystack\.co\/transaction\/verify/, 'server-side re-verification required');
  assert.match(fn, /amount_currency_mismatch/, 'amount/currency cross-check required');
  assert.match(fn, /recalculate_invoice_status/, 'invoice status must be derived');
  assert.match(fn, /duplicate/, 'idempotent replay handling required');
  assert.match(fn, /payment_verification/, 'verification must be audited');
});


test('currency configuration is consistent with the confirmed USD decision', () => {
  const sql = migrations();
  assert.match(sql, /'payments\.currencies', '\["USD"\]'/, 'settings must enable USD');
  assert.doesNotMatch(sql, /default 'NGN'/, 'no stale NGN column defaults');
  assert.doesNotMatch(read('supabase/seed.sql'), /'NGN'/, 'seed data must be USD');
  assert.match(read('lib/demo-data.ts'), /currency = 'USD'/, 'demo pricing must be USD');
  assert.doesNotMatch(read('netlify/functions/paystack-initialize.ts'), /\['NGN'\]/, 'payment function fallback must be USD');
});

test('v2 visual system: real logos, both themes, and brand orange are wired in', () => {
  const css = read('app/globals.css');
  assert.match(css, /--brand:\s*#F4761F/i, 'brand orange from Tredex logo must be the primary token');
  assert.match(css, /html\[data-theme="dark"\]/, 'dark theme overrides must exist');
  assert.match(css, /@media print/, 'invoice print styles must exist');
  assert.match(css, /\.logo-on-dark/, 'dark-surface logo variant must exist');
  for (const asset of ['public/logo-ars.png','public/logo-ars-white.png','public/logo-tredex.png','app/icon.png','app/apple-icon.png']) {
    assert.ok(existsSync(join(ROOT, asset)), `missing brand asset: ${asset}`);
  }
  const layout = read('app/layout.tsx');
  assert.match(layout, /data-theme/, 'theme must be applied before paint to avoid a flash');
  assert.match(layout, /icons:/, 'favicon metadata must be declared');
});

test('all four interfaces share the new components and no stale palette remains', () => {
  const appFiles = walk('app').filter(f => f.endsWith('.tsx')).map(f => read(f));
  const all = appFiles.join('\n');
  const legacy = ['#e0b45c','#0d5c50','#b8863b','var(--teal)','var(--brass)','var(--paper)'];
  for (const token of legacy) assert.ok(!all.includes(token), `stale palette token still in app: ${token}`);
  assert.match(read('app/portal/page.tsx'), /HeroBanner/);
  assert.match(read('app/workspace/page.tsx'), /HeroBanner/);
  assert.match(read('app/admin/page.tsx'), /HeroBanner/);
  assert.match(read('app/(public)/page.tsx'), /platform-preview/);
});

test('invoice uses the branded document layout and remains print/PDF-ready', () => {
  const inv = read('app/portal/invoices/[id]/page.tsx');
  for (const cls of ['invoice-shell','invoice-paper','inv-head','inv-meta','inv-parties','inv-items','inv-totals','inv-foot','pay-card']) {
    assert.ok(inv.includes(cls), `invoice missing ${cls}`);
  }
  assert.match(inv, /ArsLogo/, 'invoice must use the real ARS logo');
  assert.match(inv, /TredexLogo/, 'invoice must show the parent-brand mark');
  assert.match(inv, /PrintButton/, 'invoice must offer print/PDF export');
  assert.match(inv, /ProceedToPayment/, 'invoice must keep the verified payment flow');
});

test('the website name is exactly "Author Reach Studio" with no tagline attached', () => {
  const layout = read('app/layout.tsx');
  assert.match(layout, /default:\s*'Author Reach Studio'/, 'home page <title> must be the bare name');
  assert.doesNotMatch(layout, /Tech-savvy|author growth/, 'no tagline in metadata');

  const header = read('components/site-header.tsx');
  const shell = read('components/app-shell.tsx');
  for (const f of [header, shell]) {
    assert.doesNotMatch(f, /Tech-savvy|brand-wordmark|Client platform|Workspace<small>/,
      'no descriptive suffix next to the logo');
    assert.match(f, /ArsLogo/, 'header/sidebar must render the real logo');
  }

  // No tagline anywhere in rendered UI copy or metadata.
  const ui = [...walk('app').filter(f => f.endsWith('.tsx')).map(f => read(f)),
              ...walk('components').filter(f => f.endsWith('.tsx')).map(f => read(f))].join('\n');
  assert.doesNotMatch(ui, /Tech-savvy author growth/);
});

test('Phase 2 foundation artefacts exist and fail safe', () => {
  const mw = read('middleware.ts');
  assert.match(mw, /NEXT_PUBLIC_DEMO_MODE/, 'middleware must be dormant in demo mode');
  assert.match(mw, /auth\.getUser/, 'middleware must verify the session');
  for (const prefix of ['/portal', '/workspace', '/admin']) assert.ok(mw.includes(prefix));

  const ci = read('ci/github-actions-ci.yml');
  for (const step of ['npm test', 'npm run typecheck', 'npm run build']) assert.ok(ci.includes(step));

  const storage = read('supabase/migrations/20261025000002_storage.sql');
  for (const bucket of ['author_assets','project_deliverables','client_documents','marketing_assets','public_site_assets']) {
    assert.ok(storage.includes(bucket), `missing bucket ${bucket}`);
  }
  assert.match(storage, /create policy "storage_authenticated_read"/);
  assert.ok(!/create policy[^;]*for delete/.test(storage), 'no authenticated delete on storage objects');

  const hardening = read('supabase/migrations/20261025000003_rls_hardening.sql');
  assert.match(hardening, /drop policy if exists "roles_read"/);
  assert.match(hardening, /drop policy if exists "org_read"/);
  assert.ok(read('tests/rls-personas.test.mjs').includes('client_a'));
});

test('live data layer: catalogue + inquiry route use publishable key only, no service-role in browser', () => {
  const cat = read('lib/data/catalogue.ts');
  assert.match(cat, /visibility=eq\.published/, 'anon must be restricted to published services');
  assert.match(cat, /source: 'demo'/, 'must degrade to demo data when backend is absent');
  assert.ok(!cat.includes('SERVICE_ROLE'), 'catalogue must never use a service-role key');

  const route = read('app/api/inquiry/route.ts');
  assert.match(route, /functions\/v1\/inquiry/, 'must call the trusted Edge Function');
  assert.ok(!route.includes('SERVICE_ROLE'), 'route must not use a service-role key');
  assert.match(route, /status: 503/, 'must fail honestly when unconfigured');

  const form = read('components/inquiry-form.tsx');
  assert.match(form, /fetch\('\/api\/inquiry'/);
  assert.ok(!form.includes('demo confirmation'), 'must never claim a message was saved when it was not');
});

test('migration 004 provisions profiles and enforces the capability matrix', () => {
  const sql = read('supabase/migrations/20261025000004_auth_and_capabilities.sql');
  assert.match(sql, /create trigger on_auth_user_created/);
  assert.match(sql, /insert into public\.role_permissions/);
  assert.match(sql, /payment_entity_is_configured\(\)/);
  assert.match(sql, /DRAFT/);
  assert.ok(!sql.toLowerCase().includes('grant .* to anon') , 'no capability grants to anon');
});

test('deployed Edge Function source is version-controlled and has no external imports', () => {
  const src = read('supabase/functions/inquiry/index.ts');
  assert.match(src, /Deno\.serve/);
  assert.match(src, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(src, /rateLimit/);
  assert.match(src, /website/, 'honeypot must exist');
  assert.match(src, /consent !== true/, 'consent must be enforced server-side');
  assert.ok(!/esm\.sh|npm:|https:\/\/deno\.land/.test(src), 'must not import remote modules (BOOT_ERROR risk)');
  assert.match(read('supabase/functions/README.md'), /no-verify-jwt/);
});
