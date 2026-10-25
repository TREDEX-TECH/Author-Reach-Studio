# START HERE — Author Reach Studio

**Status:** production-oriented front end + live Supabase foundation (25 Oct 2026).
**Read time:** 6 minutes.

---

## 1. Where we are

The platform is one Next.js + TypeScript application with four connected environments:
public website, client portal, team workspace and management/admin dashboard.

- **Public website** uses the real Author Reach Studio / Tredex logos, orange `#F4761F` + white,
  light/dark themes, live Supabase service catalogue, live enquiry intake and clean legal pages.
- **All three dashboards** now read live Supabase data through RLS and show honest empty states.
  Demo mode, `lib/demo-data.ts`, fake clients, fake invoices, fake tasks, fake files, fake
  results, fake team members and fake audit events are gone.
- **Supabase** project `xozbyrzpsopqugobjivs` has 5 migrations, 54 tables, RLS on all tables,
  5 Storage buckets, invite-only Auth, 8 published USD services and a working Enquiry → CRM
  Edge Function.
- **Invoices** render from real database rows, with real line items and verified payment history.
  Online payment stays disabled until Paystack server keys and a real legal entity are configured.
- **GitHub** repo: `TREDEX-TECH/Author-Reach-Studio` (branch `main`). Keep it private or accept
  that the source is public; revoke the previously exposed PAT.

See `docs/13-production-frontend.md` for the exact front-end cleanup and
`docs/12-live-supabase-state.md` for the live database state.

> **Not fully operational yet:** there are no user accounts, no email delivery, no Paystack keys,
> no real domain, no live payment, no file-upload UI and no write workflows. The dashboards are
> honest read-only views until those pieces are connected.

---

## 2. Access model right now

You chose **viewable dashboards with real data** rather than a hard login wall for now.

- `REQUIRE_AUTH=false` (default): `/portal`, `/workspace` and `/admin` are viewable, but an
  anonymous visitor sees no private rows because RLS blocks them.
- `REQUIRE_AUTH=true`: middleware requires a Supabase session before opening any private route.

Set `REQUIRE_AUTH=true` after creating accounts and testing invite/reset emails. Do not put
`SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY`, `EMAIL_API_KEY`, database passwords or a
GitHub token in chat, source code, docs or GitHub.

---

## 3. Decisions already confirmed

| Topic | Decision |
|---|---|
| Website name | Exactly **Author Reach Studio** — no attached tagline. |
| Parent brand | **Tredex**; ARS is a specialist brand, not automatically a separate legal entity. |
| Currency | **USD only.** Every price, invoice and payment stores its currency. |
| Design | Refine the prototype first; orange/white, real logos, light/dark, dashboard-reference layout. |
| Provider accounts | Most exist; exact project refs and access list still to be supplied. |
| Build sequence | **Thin vertical slice first (~6–8 weeks)** — one complete journey before scaling. |
| Paystack USD | Owner confirms USD settlement; still prove with a real test-mode transaction. |
| Legal entity | Use clean wording now; replace the database DRAFT org rows with the real registered entity before any live invoice/payment. |
| Dashboards | Open read preview with real data; optional `REQUIRE_AUTH=true` hard gate later. |
| Legal pages | Clean honest policy wording, no DRAFT/CONFIRM placeholders in rendered UI. |
| Contact details | Driven by `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_CONTACT_ADDRESS`. |

Still open: **full vs partial payments** and **invite-only vs open registration**. Current
defaults are full payment and invite-only; both are reversible.

---

## 4. What I still need from you (blocking true production)

1. **Real domain** and DNS access; set `NEXT_PUBLIC_SITE_URL` and Supabase Auth redirect allowlist.
2. **Email provider** + verified sending domain (SPF/DKIM/DMARC) + `EMAIL_API_KEY` / `EMAIL_FROM`.
3. **Three test users** (admin, staff, client) with real emails for invite/reset/RLS testing.
4. **Paystack test keys**, webhook URL, one USD test transaction, then live keys after sign-off.
5. **Registered legal entity**: exact name, registration number, address, tax details; must match
   the Paystack recipient. This replaces the guarded `DRAFT` rows in `organizations`.
6. **Real service catalogue copy and prices** (current 8 rows are synthetic dev reference data).
7. **Genuine case studies/testimonials** with written client permission — otherwise the site shows
   empty states, never invented results.
8. **Two more Supabase projects** for staging/production, backup retention + a tested restore.
9. **CI/branch protection**, monitoring, durable rate limiting, repo privacy decision, and token
   revocation for the previously exposed GitHub PAT.
10. Legal review of the Privacy Policy, Terms and Refund/Payment Policy before real contracts.

---

## 5. What you do not need to give me

Passwords, secret keys, service-role keys, database passwords, Paystack secret keys, live customer
data for development, or live payment credentials in chat. Set them in the provider dashboards
(Netlify, Supabase, Paystack) and tell me only that they are configured.

---

## 6. Verify locally

```bash
npm install
npm test
npm run typecheck
npm run build
node scripts/verify.mjs
npm start       # http://localhost:3000
```

Useful routes: `/`, `/services`, `/contact`, `/legal/privacy`, `/portal`, `/workspace`,
`/admin`, `/sign-in`, `/design-system` (unlinked, `noindex`).

---

## 7. Key documents

| Document | Purpose |
|---|---|
| `docs/01-project-charter.md` | Product scope and four environments. |
| `docs/02-decisions-register.md` | Decision log and outstanding confirmations. |
| `docs/05-security-model.md` | RLS, auth, storage and server-side authorization. |
| `docs/09-visual-redesign.md` | Brand system and dashboard layout. |
| `docs/10-operational-readiness.md` | Full operational gap analysis (historical baseline). |
| `docs/11-vertical-slice-plan.md` | 6–8 week thin-slice plan. |
| `docs/12-live-supabase-state.md` | Exact live Supabase configuration and limitations. |
| `docs/13-production-frontend.md` | Demo removal, live-data front end, launch blockers. |
| `PUSH-TO-GITHUB.md` | Safe push instructions; never commit secrets. |
