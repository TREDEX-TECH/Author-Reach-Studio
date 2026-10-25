# Author Reach Studio

> Full-stack author marketing, client management and business operations platform.
> **Author Reach Studio** is a specialist brand of **Tredex**.

The front end is production-oriented: the public website reads live Supabase service catalogue
records, enquiries write to the live CRM through a trusted Edge Function, and the client portal,
team workspace and admin dashboard read live records through RLS with honest empty states. There
is **no demo mode** and no invented client data. See `docs/13-production-frontend.md`.

## Quick start

```bash
npm install
cp .env.example .env.local    # fill browser-safe values; keep secrets in Netlify/Supabase
npm run dev                   # http://localhost:3000
npm run typecheck
npm test
npm run build
node scripts/verify.mjs
```

Private dashboards are readable by default but show no private rows until a user signs in. Set
`REQUIRE_AUTH=true` in production once accounts and email delivery are working to require sign-in.

## Structure

```
app/                         App Router: public site, sign-in, portal, workspace, admin, API routes
components/                  Brand, header/footer, dashboard shell, forms, UI primitives
lib/                         Config, live RLS-aware data layer, formatting, navigation, Supabase clients
netlify/functions/           Trusted server-side: inquiry, Paystack init/webhook/callback
supabase/migrations/         5 migrations — schema source of truth
supabase/functions/inquiry/  Exact deployed Edge Function source
docs/                        Charter, decisions, security, roadmap, operational readiness, live state
tests/                       Architecture/security regression tests + RLS persona harness
```

## Architecture

Next.js App Router + TypeScript runs on Netlify. Supabase provides Postgres, Auth, RLS and
private Storage. Normal reads use the publishable key (and the signed-in user's JWT when
available); privileged operations use trusted server functions with server-only secrets — never
the browser. Paystack payments are verified server-side before an invoice changes state. See
`docs/05-security-model.md` and `docs/12-live-supabase-state.md`.

## Environment variables

`.env.example` is the template. Browser-safe values use `NEXT_PUBLIC_`; secrets such as
`SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY` and `EMAIL_API_KEY` belong only in Netlify /
Supabase environment settings. Contact details are set with `NEXT_PUBLIC_CONTACT_EMAIL`,
`NEXT_PUBLIC_CONTACT_PHONE` and `NEXT_PUBLIC_CONTACT_ADDRESS`.

## Deployment readiness

`netlify.toml` configures the Next.js plugin, security headers and Paystack callback. Before a
real public launch, configure the production domain, email provider, three test accounts,
Paystack test→live keys and webhook, the real legal entity, staging/production Supabase projects,
backups/restore and CI. Full list in `docs/13-production-frontend.md`.

## Legal note

Author Reach Studio is a brand of Tredex, not automatically a separate legal entity. Contracts,
invoices and Paystack recipient details must name the actual registered service provider.
