# 12 — Live Supabase State (25 Oct 2026)

**Project:** `Author Reach Studio` · ref `xozbyrzpsopqugobjivs` · region `eu-west-3`
**URL:** `https://xozbyrzpsopqugobjivs.supabase.co` · PostgreSQL 17.11
**Status:** ACTIVE_HEALTHY (auth, db, pooler, rest, storage, realtime, pg_bouncer)

> ⚠️ This is currently the **only** Supabase project. Your blueprint requires separate
> **dev / staging / prod** projects. Treat this one as **development** for now and create
> two more before any real customer data or live payments.

---

## What is live right now

### Schema (5 migrations, 285 SQL statements, all SHA‑256 verified before execution)

| Migration | Contents |
|---|---|
| `20261025000000_init.sql` | 54 tables, 24 enums, 30 triggers, 60 policies, audit/immutability, invoice recalculation, role helpers, seed roles/permissions/settings/stages |
| `20261025000001_security_rpcs.sql` | `is_invoice_payable_by`, service-role-only invoice recalculation, explicit revokes on financial/role/audit tables |
| `20261025000002_storage.sql` | 5 Storage buckets + `storage.objects` RLS + append-only `file_metadata` policies |
| `20261025000003_rls_hardening.sql` | Tightens all 9 broad `using (true)` policies + internal note isolation |
| `20261025000004_auth_and_capabilities.sql` | `auth.users` → `profiles` triggers, 44-row capability matrix, DRAFT org skeleton, `payment_entity_is_configured()` guard |

Verified in the live DB:

```
tables 54 · rls_tables 54 · public policies 62 · storage policies 4
buckets 5 (4 private + public_site_assets public) · security functions 9
auth triggers 2 · role_permissions 44 · organizations 2
published services 8 · broad `using(true)` policies 0
payment_entity_is_configured() = false   ← deliberate: blocks live charges
```

### Storage buckets

| Bucket | Public | Size limit | Purpose |
|---|---|---|---|
| `author_assets` | no | 50 MB | covers, author photos |
| `project_deliverables` | no | 200 MB | versioned deliverables |
| `client_documents` | no | 50 MB | contracts, briefs |
| `marketing_assets` | no | 100 MB | campaign creative |
| `public_site_assets` | **yes** | 10 MB | published site images only |

No authenticated DELETE policy exists — file removal is a soft-delete plus an audited server job.

### Auth configuration

- `disable_signup = true` → **invite-only**, matching `registration.clients = invite_only`.
- `mailer_autoconfirm = false`, email verification required, secure email change on.
- JWT 3600s, refresh-token rotation on, reuse interval 10s.
- Phone auth off, MFA/TOTP available for staff.
- **Explicit** redirect allowlist (no broad wildcards):
  `http://localhost:3000/**`, `http://127.0.0.1:3000/**`,
  `https://3000-ij1zgnp66q4o5cxwua4oq.e2b.app/**`.
  `site_url` is still `http://localhost:3000` — **replace when the real domain is known.**
- SMTP is **not configured** (`smtp_host = null`). Supabase's built-in mailer has a very
  low send limit, so invites/resets/receipts will not work reliably until a provider is set up.

### Application settings (already correct)

`payments.currencies = ["USD"]` · `payments.allow_partial = false` ·
`payments.provider = paystack` · `invoices.payment_terms_days = 14` ·
`proposals.validity_days = 30` · `registration.clients = invite_only` ·
`registration.staff = admin_invite`.

### Service catalogue

8 published services seeded from `supabase/seed.sql` (synthetic dev reference data — replace
with the real catalogue). Prices in USD: $250, $200, $350 starting prices; 5 custom-proposal items.

---

## What actually works end-to-end (proven today)

1. **Live catalogue.** `/`, `/services` and `/services/[slug]` now read from Supabase via
   `lib/data/catalogue.ts` using only the **publishable** key and RLS (`visibility=published`).
   The `/services` page shows a "Live catalogue — managed in Supabase" badge when connected.
   Verified rendered output includes `From $250`, `~14 days`, `Custom proposal` read from the DB.
   Falls back to demo data (clearly labelled) if Supabase is unreachable.

2. **Enquiry → CRM.** `components/inquiry-form.tsx` → `POST /api/inquiry` →
   Supabase Edge Function `inquiry` (v3) → `public.inquiries`.
   Verified: valid enquiry returned `201` with a real reference (`INQ-2026-…`) and the row
   existed in the DB with consent, source tag and spam score; invalid input returned `422`;
   honeypot returned a filtered response; **anonymous direct INSERT returned 401 (RLS block)**.
   All test rows were deleted afterwards — the table is empty.

3. **Isolation.** Anon reads of `profiles`, `inquiries`, `invoices`, `payment_transactions`,
   `user_roles` all return `[]` (RLS), not data.

### Architecture note on the inquiry path

The Edge Function uses **plain `fetch` to PostgREST**, not an external import. The first
version imported `@supabase/supabase-js` from `esm.sh` and failed to boot (`BOOT_ERROR`).
Supabase injects `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` into Edge Functions at
runtime, so no secret is stored in the repo. `verify_jwt = false` is intentional — it is a
public contact form — but all validation, honeypot and rate limiting happen server-side.

The original `netlify/functions/inquiry.ts` remains as the Netlify deployment alternative;
the site currently uses the same-origin `/api/inquiry` proxy so it works in both environments.

The `extensions.http` extension was temporarily enabled to bootstrap the migrations from the
public repo with SHA‑256 verification. It lives in the `extensions` schema, which is **not**
exposed through PostgREST (`db_schema = public,graphql_public`), so it is not callable by
anon. Drop it once no longer needed: `drop extension if exists http;`.

---

## What is NOT live yet (do not assume otherwise)

- **No users.** `auth.users` and `profiles` are empty. The sign-in screen is still a design
  shell; invite-only onboarding, password reset and MFA enrollment are not wired.
  `NEXT_PUBLIC_DEMO_MODE` stays `true` deliberately, so `middleware.ts` stays dormant and
  the three dashboards remain viewable. Flipping it to `false` before Auth is built would
  lock every private route behind a non-functional sign-in.
- **No Paystack connection.** No keys, no webhook, no test transaction. Owner said credentials
  will follow. `payment_entity_is_configured()` returns `false` on purpose — **no live charge
  is possible until the real legal entity is supplied.**
- **No email provider.** No invites, resets, receipts or notifications.
- **No real domain.** `metadataBase` still `authorreachstudio.com` (placeholder); Auth
  `site_url` still localhost.
- **No file uploads.** Buckets and policies exist, but no upload/signed-URL UI or server action.
- **No proposals, projects, invoices, payments, messages or reports from the DB.** Those
  screens still render `lib/demo-data.ts`.
- **No dev/staging/prod split, no backup restore test, no monitoring, no CI enabled yet**
  (workflow is staged at `ci/github-actions-ci.yml`; see `ci/README.md`).
- **Draft legal entity.** `organizations` rows contain `DRAFT — replace with registered legal
  name`. Must be replaced before any real invoice or live payment.

---

## Local configuration

`.env.local` (gitignored) contains only the **public** values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xozbyrzpsopqugobjivs.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Never** put `SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY`, `EMAIL_API_KEY`,
database passwords or the GitHub token in the repo, `.env.local` commits, docs or chat.
Set them in **Netlify → Site configuration → Environment variables** (and Supabase Edge
Function secrets where relevant).

---

## Next inputs needed (blocking the rest of the slice)

1. Paystack **test** keys + webhook URL registered + one USD test transaction.
2. Email provider + verified sending domain (SPF/DKIM/DMARC) + `From` address.
3. Real domain + DNS access (updates `metadataBase`, `site_url`, redirect allowlist, email domain).
4. Real legal entity (registered name, number, address) to replace DRAFT rows.
5. One complete real service definition (scope, deliverables, eligibility, duration, USD price).
6. Three test people (admin, staff, client) with real emails for invite testing.
7. Two decisions still open: **full vs partial payments** and **invite-only vs open registration**
   (settings currently default to full-payment + invite-only, which is reversible).
8. Two more Supabase projects for staging and production.

See `docs/11-vertical-slice-plan.md` for the week-by-week plan and `docs/10-operational-readiness.md`
for the full requirements audit.
