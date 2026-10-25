# 08 — Build Report (Phase 1 foundation, 25 Oct 2026)

Per blueprint §13.2 rule 11: files changed, migrations added, tests run, manual setup still required.

## What was built
- **Running Next.js 15 + TypeScript application** with 45 routes across all four interfaces:
  public website (11 page types), client portal (8 screens + invoice detail + add-book),
  team workspace (7 screens), admin dashboard (11 screens), sign-in shell, 404.
- **Design system** (`app/globals.css` + `/design-system`) — editorial author-brand
  aesthetic, responsive, keyboard-visible focus states, semantic tables/forms,
  loading/empty/success/error states, plus a reviewable style-guide page with
  colour tokens, type scale, components, table, progress and empty states.
- **Supabase schema** — 55 tables, 20 enums, ~30 indexes, foreign keys and constraints,
  append-only histories, audit triggers, permission helpers, RLS on every table.
- **Netlify Functions** — inquiry intake, Paystack initialisation, Paystack webhook,
  callback, plus a shared server helper module.
- **Documentation** — charter, decision register, intake checklist, Supabase setup,
  security model, roadmap, content inventory, this report.
- **Tests** — 10 dependency-free architecture/security regression tests + verify script.

## Files added (high level)
```
START-HERE.md, README.md, package.json, tsconfig.json, next.config.mjs,
netlify.toml, .env.example, .gitignore
app/layout.tsx, app/globals.css, app/not-found.tsx
app/(public)/**            (12 page types + layout)
app/(auth)/sign-in/page.tsx
app/portal/**              (8 screens + invoice detail + new book + layout)
app/workspace/**           (7 screens + layout)
app/admin/**               (11 screens + layout)
components/**              (brand, header, footer, app shell, dashboard frame,
                            ui primitives, module views, inquiry form, payment button)
lib/**                     (types, demo data, navigation, Supabase browser/server clients)
netlify/functions/**       (_shared, inquiry, paystack-initialize, paystack-webhook, callback)
supabase/migrations/20261025000000_init.sql
supabase/migrations/20261025000001_security_rpcs.sql
supabase/seed.sql, supabase/config.toml, supabase/templates/*.html
tests/blueprint.test.mjs (11 tests), scripts/verify.mjs
docs/01..08*.md
```

## Migrations added
1. `20261025000000_init.sql` — 215 statements: enums, 55 tables, FKs, indexes,
   triggers, security-definer helpers, RLS enablement, representative policies,
   safe production seed (roles, permissions, pipeline stages, settings).
2. `20261025000001_security_rpcs.sql` — 23 statements: `is_invoice_payable_by`,
   service-role-only execution grants for financial RPCs, and explicit revocation
   of client writes to financial/role tables.

## Tests run
```
npm test          → 14/14 pass
npx tsc --noEmit  → 0 errors
npm run build     → success, 45 routes generated
curl smoke test   → 11 representative routes all HTTP 200
node scripts/verify.mjs → foundation checks pass
pglast parse_sql  → both migrations parse cleanly (215 + 23 statements)
```
Note: SQL was syntax-validated with a Postgres parser but has **not** yet been executed
against a live Supabase instance — that is Phase 2 and requires your project.

## Manual setup still required (yours)
1. Confirm the 20 decisions in `docs/02-decisions-register.md`.
2. Provide the brand + content pack in `docs/03-what-we-need-from-you.md`.
3. Create business-owned Supabase (dev + prod, staging recommended), Netlify,
   Paystack, GitHub, email-provider and domain accounts; grant developer access.
4. Set environment variables from `.env.example` in Netlify (server secrets in the UI only).
5. Run `supabase db push`, generate DB types, create the 5 storage buckets,
   configure Auth redirect URLs and email templates, register the Paystack webhook.
6. Provide lawyer-reviewed legal text and the exact registered legal entity name.
7. Complete RLS testing with all seven personas and a tested backup restore.

## Honest limitations of this prototype
- All data is fictional demo data. No Supabase/Auth/Paystack connection is live.
- Forms show a demo confirmation; no email is sent.
- The "Proceed to Payment" button explains the real flow but does not charge anything.
- Public copy, prices, service descriptions, portfolio and legal pages are clearly
  labelled as illustrative/draft and must be replaced before launch.
- Some RLS policies are representative; the full per-module write-policy set,
  storage policies, reporting views and notification functions come in later migrations.


## Revision 2 (same day, after owner's decisions)
- Currency set to **USD** across schema defaults, `application_settings`, seed data,
  demo pricing, invoices, reports, legal draft and the Paystack function fallback.
- ⚠️ Open risk: **confirm the Paystack merchant account can accept and settle USD**.
  If it cannot, choose NGN (with a documented conversion policy) or a USD-capable route.
- Added `/design-system` review page and a hero grid-texture refinement, per the
  owner's choice to refine the prototype design before backend work.
- Added a regression test guarding currency consistency (now 11 tests).


## Revision 3 — visual redesign v2 (25 Oct 2026)
- Replaced interim teal/brass/parchment palette with **Tredex orange `#F4761F` + white**,
  plus full **light/dark theme** support (pre-paint bootstrapped, persisted in localStorage).
- Integrated the real **Author Reach Studio** and **Tredex** logos from the owner's Google
  Drive; generated favicon, apple-touch icon and a white logo variant for dark surfaces.
- Rebuilt the shared component layer (sidebar, topbar, search, theme toggle, KPI tiles,
  hero banners, progress rings, quick actions, badges, tables) across all four interfaces.
- Rebuilt the **invoice** as a print-ready branded document with a payment card, and
  restyled the invoice list.
- Rebuilt public home, three dashboard home screens, design system, About and sign-in.
- Added `docs/09-visual-redesign.md` and 3 new regression tests (14 total).
- Assets: `public/logo-*.png`, `app/icon.png`, `app/apple-icon.png`, `public/favicon.ico`,
  `brand-assets/` (originals + contact sheet), `DRIVE-CONTENTS.md`.
