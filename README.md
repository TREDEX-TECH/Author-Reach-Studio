# Author Reach Studio

> A full-stack author marketing, client management and business operations platform.
> **Author Reach Studio** is a specialist brand of **Tredex**.

This repository is the Phase 1 foundation built from the *Master Project Blueprint*. It currently runs on **demo data** so the design and information architecture can be reviewed before real credentials are connected.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in only when connecting real services
npm run dev                    # http://localhost:3000
```

Demo mode is on by default (`NEXT_PUBLIC_DEMO_MODE=true`). No Supabase project is required to view the prototype.

```bash
npm run typecheck
npm test
npm run build
```

## What's in here

```
app/
  (public)/                 Home, About, Services, Service detail, How It Works,
                            Work, Resources, FAQ, Contact, Legal
  (auth)/sign-in/           Sign-in / reset / invitation shell
  portal/                   Author–client portal (projects, proposals, invoices,
                            books, files, messages, settings)
  workspace/                Team workspace (my tasks, projects, reviews, files)
  admin/                    Management dashboard (CRM, pipeline, finance, team,
                            services, reports, settings, audit log)
components/                  Shared UI primitives + site header/footer + app shell
lib/                         Types, navigation config, demo data, Supabase clients
netlify/functions/           Trusted server-side: inquiry, payment init, webhook
supabase/migrations/         Version-controlled schema — source of truth
supabase/seed.sql            Safe synthetic test data (non-production only)
docs/                        Charter, decisions, requirements, setup, security,
                             content inventory, roadmap
tests/                       Business-rule + permission unit tests (no deps)
```

## Architecture in one paragraph

Next.js (App Router, TypeScript) renders all four interfaces on Netlify. Supabase provides Postgres, Auth, RLS and private Storage. All privileged operations (payment initialisation, webhook verification, role changes, inquiry intake) go through Netlify Functions using a server-only service-role key — **never** through the browser. Paystack processes payments; only a server-verified transaction can change an invoice's financial state. See `docs/05-security-model.md`.

## Rules for any developer or AI assistant working here

1. Read `docs/01-project-charter.md` and `docs/02-decisions-register.md` before implementing.
2. Inspect the existing repo before adding files; reuse existing components and naming.
3. All schema changes happen through a new file in `supabase/migrations/` — never by hand in the dashboard.
4. Validate all inputs with Zod on the server; enforce authorisation server-side **and** in RLS.
5. Never expose a secret through a `NEXT_PUBLIC_` variable.
6. Add a test for every business rule and every access restriction you touch.
7. Report files changed, migrations added, tests run, and manual setup still required.
8. A feature is not done until its full workflow, permissions, error states and tests are checked.

## Environment variables

See `.env.example`. Browser-safe values use `NEXT_PUBLIC_`. Everything else is server-only and must be set in Netlify's environment UI (or a secret manager), never committed.

## Deployment

`netlify.toml` includes the Next.js plugin, security headers and the Paystack callback redirect. Configure production env vars in Netlify and allowlist the production URL + `/auth/callback` in Supabase Auth redirect settings.

## Legal note

Branding Author Reach Studio under Tredex does **not** create a separate legal entity. Legal disclosures, contracts, invoices and the Paystack payment recipient must reflect the actual registered service provider. Confirm this in `docs/02-decisions-register.md` (Decision 9).
