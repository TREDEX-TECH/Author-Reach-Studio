# 10 — Operational Readiness: what it takes to make this fully functional

**Date:** 25 Oct 2026 · **Repo:** `TREDEX-TECH/Author-Reach-Studio` (`2320962`, branch `main`)
**Question answered:** what is needed for the site to actually perform every operation in the master blueprint?

---

## 0. Your answers (25 Oct 2026) — plan adjusted

| Question | Your answer | Effect |
|---|---|---|
| Paystack USD settlement | ✅ Confirmed available | Keeps USD. Still prove with a real test-mode transaction before live. |
| Provider accounts | ✅ Most already exist | Send me the list + project refs; I only write setup steps for gaps. |
| Build sequence | ✅ **Thin vertical slice first (~6–8 weeks)** | See `docs/11-vertical-slice-plan.md` — one complete journey, then scale. |
| Legal entity | 🟡 Use a draft for now | Placeholders clearly marked; must be real before any real invoice/live payment. |

Still open: **full vs partial payments** and **invite-only vs open registration** — both affect weeks 1–6.

## 0b. Update — Supabase connected (25 Oct 2026)

Since this audit was written, the schema has been applied to a live Supabase project and the
first two workflows are real: the public service catalogue reads from the DB, and enquiries
write to CRM through a trusted Edge Function. **See `docs/12-live-supabase-state.md`** for the
current live state. This document remains the complete list of what is still required.

## 1. Honest current status

| Area | State today | Reality |
|---|---|---|
| Screens / routes | ✅ 45 routes, all four interfaces, orange/white brand, light+dark themes, real logos, print-ready invoice | Looks finished and is clickable |
| Data | ❌ **22 pages import `lib/demo-data.ts`** — hardcoded fictional records | Nothing is read from or written to a database |
| Database | 🟡 54 tables, 60 RLS policies, audit/immutability triggers in 2 SQL migrations | Never executed against a real Postgres instance; only syntax-parsed |
| Auth | ❌ No Supabase Auth, no middleware, no session, no route protection | `/sign-in` is a `<Link>` to the portal; anyone can open any URL |
| Storage | ❌ No buckets, no storage policies, no signed URLs, no upload flow | "Files" screens are static demo lists |
| Netlify Functions | 🟡 4 real server handlers (inquiry, Paystack init, webhook, callback) | Correct trust-boundary design, but need live env vars + a real Supabase project to run |
| Payments | 🟡 Init/verify/webhook logic written, idempotent, signature-checked | Never processed a real transaction; USD settlement unverified |
| Email / notifications | ❌ None — one `TODO Phase 7` in `inquiry.ts` | No acknowledgement, no invites, no alerts |
| Reporting | ❌ No views, no aggregation, no charts from real data | Reports are demo tables |
| CI / deploy | ❌ No pipeline, no live site, no domain | Code is on GitHub only; preview runs locally |
| Secrets | ✅ None in repo (only `.env.example` placeholders) | Good — keep it that way |

**One-line summary:** the *design* is done and the *architecture* is designed; the *engine* is not connected. Making it "fully functional" means Phases 2–8 of `docs/06-roadmap.md` — roughly **14–20 weeks** of implementation once inputs arrive.

---

## 2. Gap analysis against your blueprint

| Blueprint requirement | What exists now | What is still needed |
|---|---|---|
| **Public website** — Home, About, Services + detail, How It Works, Case Studies, Resources, FAQ, Contact, Privacy/Terms/Refund | All pages exist with demo copy | Real copy, real service catalogue (scope/deliverables/eligibility/duration/price), genuine case studies with written permission, lawyer-reviewed legal text, SEO + structured data, admin-editable content |
| **Inquiry → CRM** | Form posts to `/.netlify/functions/inquiry`; validation, honeypot, rate limit, spam score | Live Supabase project + service key, CRM pipeline UI wired to real rows, notification + acknowledgement email, durable rate limiting |
| **Client portal** — profile, books, proposals/versions, accept/decline, projects, milestones, deliverables, uploads, feedback/approvals, invoices, payments, reports, messages, settings | All screens exist | Auth + RLS so a client sees **only** their records; every create/edit action as a server action or RPC; real file storage with signed URLs; real messaging; settings persistence |
| **Team workspace** — tasks, deadlines/priorities, projects, updates, uploads, internal review, work notes, conversations, department info, approvals | All screens exist | Task CRUD, review workflow where uploading ≠ completion, versioned deliverables, internal notes hidden from clients, conversation scoping, department/role assignment |
| **Admin / management** — users/status, staff, departments, roles/permissions, clients, books, services/packages, proposals/projects, assignments, campaigns, deliverables/approvals, invoices/payments/refunds, reports, website content, config | All screens exist | Full CRUD + configurable roles (not hardcoded), service catalogue editor, campaign module, refund workflow, audit viewer, config UI, content CMS |
| **Next.js + TS / Netlify / Supabase / Paystack / email / modular monolith** | Stack chosen, config templates written | Real accounts, env vars, deployment, generated DB types, CI |
| **Security** — server-side authz, RLS, private storage, migrations, audit, idempotent payments, no frontend-only security | Schema + helper functions designed | Apply migrations to a real DB, tighten **9 `using (true)` policies**, add storage policies, add middleware + server-side authz on every write, RLS tests with 7 personas |
| **Finance** — separate invoice/payment, no frontend success marking paid, only verified webhook changes state, partial-payment-ready | Invoice UI + webhook logic | Live Paystack test→live switch, reconciliation UI, refunds, receipts, real payment history, currency confirmation |
| **Reporting** — separate completed work / campaign activity / observed results / external outcomes, no fabricated results | Demo tables | Reporting views/functions, source+date-range labels, export, campaign metrics ingestion |
| **Operational** — backups, restore test, dev/staging/prod separation, allowlisted redirects | Documented in `docs/04` | Actually configure and test all of it |

---

## 3. What you need to supply (6 buckets)

### A. Decisions — blocking (see `docs/02-decisions-register.md`)

Confirmed already: **USD only**, **visual direction**, **favicon**. Still open:

1. **Legal entity** — exact registered name, registration number, registered address, and the Tredex relationship sentence. Appears on invoices, Paystack recipient, contracts, legal pages.
2. **Paystack USD settlement** — ⚠️ **critical**. Confirm in your Paystack dashboard that the merchant account can accept *and settle* USD. Nigerian Paystack accounts commonly settle NGN. If not: choose NGN + documented conversion policy, or a USD-capable corridor/provider. **Do not go live on the assumption.**
3. **Payment rule** — full payment only, or instalments/partial? (Recommendation: full at launch; data model already supports partial.)
4. **Registration model** — invite/approval-only for clients and staff, or open signup? (Recommendation: invite-only.)
5. The other **16 decisions** in the register — say "defaults are fine" or amend any row.

### B. Accounts & access — you own every one (see `docs/04`)

| Provider | Need | Notes |
|---|---|---|
| **Supabase** | 3 projects: **dev**, **staging**, **prod** (business-owned org) | Give me Project URL + publishable key + project ref; keep service-role/DB password in the dashboard |
| **Netlify** | Team/site connected to the GitHub repo | Build from `main`; staging from a `staging` branch |
| **Paystack** | Test keys first, live keys at launch | Must be the same legal entity as invoices |
| **Email** | Resend / Postmark / Supabase SMTP + **verified sending domain** (SPF, DKIM, DMARC) | For invites, resets, receipts, notifications |
| **Domain / DNS** | The real domain (currently placeholder `authorreachstudio.com`) | Needed for `metadataBase`, Auth redirects, email domain |
| **GitHub** | ✅ `TREDEX-TECH/Author-Reach-Studio` | Needs branch protection + CI; confirm org ownership |
| **Monitoring/backups** | Sentry (optional), Supabase backups/PITR | Restore must be tested before launch |

**Which of these do you already have?** Earlier you said "some exist, some don't" — send the list so I can give you a per-provider setup checklist only for the missing ones.

### C. Credentials — set in dashboards, never in chat or the repo

Set these in **Netlify → Site configuration → Environment variables** (and locally in `.env.local`, which is gitignored):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY            # server only
PAYSTACK_SECRET_KEY                  # server only
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY      # only if using Paystack Inline JS
NEXT_PUBLIC_PAYSTACK_MODE            # test | live
EMAIL_PROVIDER, EMAIL_API_KEY, EMAIL_FROM
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_APP_ENV                  # development | staging | production
NEXT_PUBLIC_DEMO_MODE                # set false when Supabase is live
```

Also: Supabase Auth **URL allowlist** (exact domains, no wildcards), Paystack **webhook URL** pointing at `/.netlify/functions/paystack-webhook`, and email domain verification.

> ⚠️ Housekeeping I'll fix: `.env.example` mentions `PAYSTACK_WEBHOOK_SECRET` but the webhook correctly uses `PAYSTACK_SECRET_KEY` for HMAC. I'll remove the unused variable and the stale "RPC missing" comment in `paystack-initialize.ts` (the RPC already exists in migration `...001_security_rpcs.sql`).

### D. Real content — I will not fabricate any of it (see `docs/07`)

- **Service catalogue** — for each of the 8 services: name, category, short promise, full description, what's included, deliverables, client requirements/eligibility, typical duration, pricing model, USD price, revision rounds.
- **About** — real story, team, values, Tredex relationship wording.
- **Portfolio / case studies / testimonials** — only genuine, permissioned items with source and date range. No invented sales figures, rankings, logos or quotes.
- **FAQ** — real questions and answers.
- **Legal** — Privacy, Terms, Refund/Cancellation/Service policies, reviewed by **your lawyer**; must name the real legal entity.
- **Contact** — real email, phone, address, business hours, response SLA.
- **Brand** — vector ARS logo (SVG/AI/EPS), official hex if different from sampled `#F4761F`, any corporate fonts.
- **Resources / blog** — initial articles, or confirm the section launches empty.

### E. People & permissions

- Owner/admin names + emails (invite-only accounts).
- Department names and heads; staff list with job titles.
- **Capability matrix** — who can: create proposals, approve deliverables, issue invoices, refund, edit services, see financial reports, manage roles. Job title must not automatically grant permissions.
- Notification preferences per role.
- Who is the Paystack/billing owner and who signs off refunds.

### F. Operational rules & success criteria

- Enquiry response SLA; inquiry→client conversion definition.
- Proposal validity period, versioning rule, acceptance = electronic signature?
- Project milestone template, what counts as "complete", review/approval steps, revision limits.
- Invoice terms (currently 14 days), late-payment rule, refund policy, receipt format.
- Campaign activity logging and how external-platform results are sourced/labelled.
- **Definition of done** — e.g. "a client can enquire → receive proposal → accept → be invoiced → pay → receive deliverable → approve, with correct emails at each step, and no client can see another client's data."

---

## 4. What I must build (Phases 2–8, from `docs/06`)

| Phase | Concrete work | Exit test |
|---|---|---|
| **2 — Backend foundation** | Apply both migrations to dev/staging/prod; generate TypeScript DB types; Supabase Auth (invite, verify, reset, MFA for staff); `middleware.ts` session refresh + route protection; 7 RLS test personas; tighten 9 broad policies; CI running `npm test`, `tsc`, `build`; deploy to Netlify | App deploys; schema recreates from migrations; a client cannot read another client's row |
| **3 — Public site + content** | Replace all demo copy with your content pack; service catalogue driven by DB; admin content editor; SEO/OG/structured data; inquiry → CRM row + acknowledgement email; durable rate limiting | A real enquiry lands in CRM and sends an email |
| **4 — Users, CRM, org** | Invite-only onboarding; clients/authors/books; CRM pipeline; departments, staff, configurable roles/permissions; permission UI | Isolation between users/departments verified by automated tests |
| **5 — Proposals & delivery** | Service packages, versioned proposals (accepted versions immutable), accept/decline, projects, milestones, tasks, assignments, deadlines, deliverable versions, **private Storage buckets + signed URLs + MIME/size limits**, review workflow where upload ≠ completion, client feedback/approval | End-to-end: accepted proposal → task → review → approved delivery, with files that only the right people can open |
| **6 — Finance** | Invoices/items from DB, Paystack test mode, init + verify + webhook, idempotency, refunds, reconciliation, receipts, payment history; switch `NEXT_PUBLIC_DEMO_MODE=false` | A test payment is verified exactly once; duplicate/forged webhooks cannot mark an invoice paid; frontend success page cannot change state |
| **7 — Comms & reporting** | Transactional email, in-app notifications (deduped by `event_key`), project conversations, notification prefs, reporting views + exports, campaign activity vs observed results vs external outcomes, audit UI | Correct notifications; reports reconcile with verified payment records |
| **8 — Security, QA, launch** | All-role permission tests, storage policy tests, mobile/a11y, performance, production domains + allowlisted redirects, **backup restore test**, Paystack live switch, runbook | Core workflows pass end-to-end; security tests green; production settings verified |

---

## 5. The minimum to unblock Phase 2 (do this first)

1. Confirm the **4 big decisions** in §3A (especially **Paystack USD settlement**).
2. Create/confirm **Supabase dev + prod** projects and put the URL + publishable key + service-role key in Netlify env vars.
3. Tell me the **real domain** and connect Netlify to the GitHub repo.
4. Set up the **email provider + verified domain**.
5. Give me **Paystack test keys** and confirm the webhook URL.
6. Send the **content pack** (§3D) and the **people/permissions list** (§3E) — these can arrive in parallel with Phase 2.

Once 1–5 are done I can immediately: apply migrations, generate types, wire Auth + middleware, protect all routes, and turn the first screens (sign-in, portal dashboard, invoices) into real database-backed pages — while you work on content.

### Already done this session (no credentials required)

Per "what I can start immediately" in `docs/11-vertical-slice-plan.md`, I added and pushed:

- `supabase/migrations/20261025000002_storage.sql` — 5 private Storage buckets with
  size/MIME limits, `storage.objects` RLS, path-scope helpers, and append-only
  `file_metadata` policies (no authenticated delete path).
- `supabase/migrations/20261025000003_rls_hardening.sql` — tightens all 9 broad
  `using (true)` policies plus internal client-note isolation.
- `middleware.ts` — session refresh + route protection for the three private
  interfaces; **dormant while `NEXT_PUBLIC_DEMO_MODE` is true** so the preview still works.
- `ci/github-actions-ci.yml` — tests, typecheck, verify, build, and a secret-string guard (see `ci/README.md` for the one-step enable).
- `tests/rls-personas.test.mjs` — 7-persona harness (4 live-DB tests skip until a real
  Supabase project is configured).
- Removed the unused `PAYSTACK_WEBHOOK_SECRET` placeholder and a stale RPC comment.

All 4 migrations parse cleanly (215 + 23 + 12 + 21 statements), 21 tests pass (4 correctly
skipped), typecheck and production build are green.

---

## 6. Two ways to sequence this

**Option 1 — Full specification (recommended for your blueprint):** build Phases 2→8 in order, ~14–20 weeks, each phase ending in a deployed, testable increment. Nothing goes live until Phase 8.

**Option 2 — Thin vertical slice first (~6–8 weeks):** make *one* complete journey real end-to-end — enquiry → CRM → proposal → invoice → Paystack test payment → deliverable → approval — with a single service, one client and one staff user. Prove the architecture works, then scale out the remaining modules. Lower risk, faster feedback, but not "fully functional" across every screen on day one.

Both end at the same place; Option 2 just proves the plumbing earlier.

---

## 7. Definition of "fully operational"

- A real visitor can browse real services and submit an enquiry that appears in CRM with an acknowledgement email.
- A real client can sign in, see only their books/projects/proposals/invoices, accept a versioned proposal, pay a real invoice via Paystack, download deliverables and approve them.
- A real staff member can be assigned tasks, upload versioned work, request internal review and approve deliverables — without clients seeing internal notes.
- A real admin can manage users, roles, departments, services, proposals, invoices, refunds, content and reports, with every important change audited.
- Financial state changes **only** through verified server-side Paystack events; reports reconcile with those records.
- No client can see another client's data, internal costs, or staff discussions; no file is publicly reachable.
- Backups exist and a restore has been tested; dev/staging/prod are separate; live keys never touch dev data.
- The site is on your real domain over HTTPS, with allowlisted redirects, monitored errors, and a runbook.

That is the bar. Everything in §3 is what's needed to reach it.
