# 13 — Production front-end cleanup (25 Oct 2026)

**Goal:** remove demo mode and invented records from the UI so the public site and the three
dashboards can be deployed without fake names, invoices, metrics, team members, tasks, messages,
files, case studies or audit events.

## What changed

- **`lib/demo-data.ts` deleted.** No page or component imports it. A regression test now fails
  if it comes back or if any page imports it.
- **One live, RLS-aware data layer.** `lib/data/live.ts` reads Supabase using the signed-in
  user's JWT when a session exists, otherwise the publishable key. Anonymous visitors therefore
  see no private rows; signed-in users see exactly what their role permits. There is no global
  snapshot cache and private requests use `cache: 'no-store'`.
- **All dashboards rewritten** (`/portal`, `/workspace`, `/admin`) to render live records with
  honest empty states. No fake client names, invoices, payments, tasks, staff, files, results,
  reports, messages or audit events remain.
- **Invoice detail** renders a real invoice, its actual line items, amounts, balance, legal
  entity snapshot (when present) and payment-attempt history. Online payment is disabled until
  `PAYSTACK_SECRET_KEY` exists on the server; a browser success page still cannot mark it paid.
- **Public site** uses the live Supabase service catalogue and live enquiry intake. The homepage
  preview reads live counts. Empty catalogue, resources and work pages show honest empty states.
  The design-system page is `noindex` and uses live records rather than sample data.
- **Legal pages** have clean, plain-language wording. No `DRAFT`, `CONFIRM` or
  “to be confirmed” placeholders are rendered. The real contracting entity must still be set
  before live invoices/payments; the database guard `payment_entity_is_configured()` enforces that.
- **Contact details are environment-driven:** `NEXT_PUBLIC_CONTACT_EMAIL`,
  `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_CONTACT_ADDRESS`. `NEXT_PUBLIC_SITE_URL` now drives
  `metadataBase` instead of a hardcoded placeholder domain.
- **Demo UI removed:** `NEXT_PUBLIC_DEMO_MODE`, `.demo-banner` CSS, fake dashboard greetings and
  sample invoice links are gone. `middleware.ts` keeps session refresh and an optional
  `REQUIRE_AUTH=true` hard sign-in wall.
- **Tests updated:** currency/USD, middleware, catalogue degradation, migration-004 guard,
  and a new whole-UI check for demo switches and invented records.

## Current access model

The owner chose **open read preview with real data** for now:

- `REQUIRE_AUTH=false` (default): private dashboard URLs are viewable, but RLS returns no
  private rows to an anonymous visitor, so screens show honest empty states.
- `REQUIRE_AUTH=true`: middleware redirects unauthenticated visitors from `/portal`,
  `/workspace` and `/admin` to `/sign-in`.

The dashboards are **read-only** in this pass. Creating/editing books, tasks, approvals,
messages, invoices or settings requires signed-in server-authorised workflows; no button claims
to have saved something it did not.

## Still required before a real public launch

| Area | Required |
|---|---|
| Domain / email | Real domain in `NEXT_PUBLIC_SITE_URL`, Supabase Auth redirect allowlist, verified sender domain (SPF/DKIM/DMARC) and `EMAIL_API_KEY`. |
| Accounts | At least three real test users (admin, staff, client), invite/reset email delivery tested, then `REQUIRE_AUTH=true`. |
| Payments | Paystack test keys, webhook URL, one USD test transaction, real legal entity in `organizations`, then live keys. `payment_entity_is_configured()` must return `true`. |
| Content | Real service catalogue copy/prices, genuine permissioned case studies/testimonials, legally reviewed policies. |
| Environments | Separate staging/production Supabase projects, backups with a tested restore, monitoring, CI enabled, branch protection. |
| Operations | Durable rate limiting for enquiry/payment endpoints, full CRUD/review workflows, generated DB types, two-client RLS isolation test, repo privacy decision, revoke the exposed GitHub PAT. |

## Verification

```bash
npm install
npm test
npm run typecheck
npm run build
node scripts/verify.mjs
npm start   # preview on port 3000
```

Set the production environment variables in Netlify — never commit secret values. See
`.env.example` for the complete list and `docs/12-live-supabase-state.md` for live DB state.
