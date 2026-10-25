# 04 — Supabase Setup Guide (for the business owner)

> Do all of this from your own business-owned Supabase account. Keep billing and ownership with Tredex — never make a freelancer's personal account the sole owner.

## Step 1 — Create the projects
Create at least two projects (three is better before real clients):

| Project | Name suggestion | Purpose |
|---|---|---|
| Development | `ars-dev` | All implementation + testing. Synthetic data only. |
| Staging | `ars-staging` | Pre-launch rehearsal, Paystack **test** keys. |
| Production | `ars-prod` | Real clients, real payments. |

Record for each: **project name, project URL, project ref, region, environment**. Suggested regions: `eu-west-2` (London) or `eu-central-1` (Frankfurt) for good latency to Nigeria. Confirm data-residency requirements with your legal adviser.

## Step 2 — Keys and environment variables
From **Project Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` — project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — the publishable key (legacy projects use the `anon` key). Safe in the browser.
- `SUPABASE_SERVICE_ROLE_KEY` (or the new secret key) — **server-only**. Bypasses RLS. Set in Netlify's environment UI only. Never prefix with `NEXT_PUBLIC_`, never commit, never paste into chat.
- Database password — store in a password manager; only needed for direct migration/maintenance tasks.

Copy `.env.example` → `.env.local` locally (git-ignored). In production, set everything in **Netlify → Site configuration → Environment variables**, scoped per deploy context (Production / Deploy Previews / Branch deploys).

If any secret was ever committed, **rotate it immediately**.

## Step 3 — Authentication
In **Authentication → URL Configuration**:
- Site URL: `https://yourdomain.com`.
- Redirect URLs (explicit, no broad wildcards in production):
  - `http://localhost:3000/auth/callback`
  - `https://staging.yourdomain.com/auth/callback`
  - `https://yourdomain.com/auth/callback`
  - `https://yourdomain.com/reset-password`
- Enable **email confirmation**.
- Configure password reset + email templates.
- Set session policy appropriate to your risk appetite (e.g. 8-hour access token, 30-day refresh, with re-authentication for sensitive actions).
- Connect your custom SMTP/email provider so verification and invoice emails come from your domain (SPF/DKIM/DMARC).
- Staff and client accounts are created by invitation; there is no public staff signup.

## Step 4 — Apply the schema (migrations are the source of truth)
```bash
npm i -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push                 # applies supabase/migrations/*
supabase gen types typescript --linked > lib/database.types.ts
supabase db reset                # dev only: rebuild from migrations + seed.sql
```
Alternatively paste `supabase/migrations/20261025000000_init.sql` into the SQL Editor once for the very first bootstrap, then use migrations for every subsequent change. **Never** create tables by hand in the dashboard and leave the repo unaware of them.

`supabase/seed.sql` contains synthetic test data and must **never** be run against production.

## Step 5 — Row Level Security
The initial migration enables RLS on every application table and creates security-definer helper functions (`has_role`, `is_author_member`, `can_access_project`, `is_finance`, `is_admin`, …). Policies are added per module as features are built. Rules:
- No policy grants "all authenticated users" blanket read access.
- Users cannot insert/update their own `user_roles` rows.
- Financial state changes go through trusted server-side logic, not a client `update`.
- Test with the seven personas below before any launch.

**RLS test personas:** anonymous visitor, Author A, Author B, team member, department head, finance officer, administrator. Test both allowed and forbidden actions:
- Author A cannot fetch Author B's invoice by changing an ID.
- A team member cannot promote themselves to admin.
- A client cannot set their own invoice to `paid`.
- A department head cannot read unrelated private client conversations.

## Step 6 — Storage buckets
Create these buckets (first four **private**):

| Bucket | Public? | Purpose |
|---|---|---|
| `author-assets` | No | Covers, manuscripts, brand assets uploaded by clients |
| `project-deliverables` | No | Drafts and approved deliverables |
| `client-documents` | No | Contracts, briefs, licensed material |
| `marketing-assets` | No | Campaign graphics/videos |
| `public-site-assets` | Yes | Website imagery only |

Rules: short-lived signed URLs for private objects; path prefix must include the owning author/project ID; verify MIME type + size; never rely on an unguessable path alone. Large videos use direct-to-Storage signed uploads (TUS/resumable), not a Netlify Function body.

## Step 7 — Webhooks and background work
Register the Paystack webhook URL at:
`https://yourdomain.com/.netlify/functions/paystack-webhook`
Validate the signature on every event. Processing is idempotent on the unique provider reference. See `netlify/functions/paystack-webhook.ts`.

## Step 8 — Backups and recovery
- Confirm the backup retention included in your Supabase plan (daily PITR availability varies by plan).
- Document: who can restore, where backups live, how long a restore takes, and how Storage objects are backed up.
- **Test a restore into a scratch project** and record the result with a date. An untested backup is not a recovery plan.
- Name the recovery owner in `docs/02-decisions-register.md`.

## Step 9 — Pre-launch checklist
- [ ] Dev / staging / prod separated, with different keys.
- [ ] All secrets only in Netlify env UI; no secrets in the repo.
- [ ] Email domain verified; verification + invoice emails tested.
- [ ] RLS tested with all seven personas (allowed + denied).
- [ ] Storage policies tested with a guessed cross-client path.
- [ ] `supabase gen types` committed and used in the app.
- [ ] Restore tested and documented.
- [ ] Auth redirect allowlist contains only explicit production URLs.
