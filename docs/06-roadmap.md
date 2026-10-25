# 06 — Delivery Roadmap

Each phase produces a deployable increment. Durations assume one developer + AI assistance, and assume the required inputs from `docs/03-what-we-need-from-you.md` arrive on time.

| Phase | Scope | Key deliverables | Exit criteria | Indicative effort |
|---|---|---|---|---|
| **1 — Requirements & architecture** ✅ *partly done now* | Decisions, schema, security model, content inventory, prototype | This starter kit: docs 01–07, SQL migration, running Next.js prototype | You sign off the decision register + brand/content pack | 1–2 days of your input |
| **2 — Repo & backend foundation** | GitHub repo, Netlify, 2–3 Supabase projects, migrations, Auth, RLS skeleton, generated types, CI | Auth flows (invite, verify, reset), `lib/supabase/*`, seed data, `tests/` RLS cases | App deploys; schema recreates from migrations; 7 personas tested | 1–2 weeks |
| **3 — Public website & content** | Brand site, service catalogue + detail pages, inquiry forms, SEO/structured data, admin content editing | Real content from your pack, CRM intake function, spam protection | Visitor can discover services and submit an inquiry that lands in CRM | 2–3 weeks |
| **4 — Users, CRM & organisation** | Onboarding, authors/books, clients, departments, staff, roles | Client + author records, CRM pipeline, department membership, permission UI | Isolation between users/departments verified by tests | 2–3 weeks |
| **5 — Proposals & project delivery** | Service packages, versioned proposals, projects, milestones, tasks, reviews, private files, deliverable versions | Client portal + team workspace | Engagement runs end-to-end: accepted proposal → task → review → approved delivery | 3–4 weeks |
| **6 — Finance & payments** | Invoices, items, Paystack test mode, init + verify + webhook, idempotency, refunds, reconciliation, payment history | `netlify/functions/paystack-*`, finance views | Test transactions verified once; duplicate/forged events cannot mark an invoice paid | 2–3 weeks |
| **7 — Communications & reporting** | Transactional email, in-app notifications, project conversations, dashboards, campaign metrics, audit UI | Reporting dashboards, audit log viewer | Users get correct notifications; managers get reliable verified-payment reports | 2 weeks |
| **8 — Security, QA & launch** | All-role permission testing, RLS + storage policy tests, mobile/a11y, performance, production domains, backup restore test, Paystack live switch | Launch checklist, runbook | Core workflows end-to-end; security tests pass; production settings verified | 1–2 weeks |

**Total indicative:** ~14–20 weeks of implementation after Phase 1 sign-off, depending on how fast content and access arrive and how much of the first-release scope you keep.

## What I can do without waiting for you
- Refine the prototype's UI and information architecture.
- Expand the SQL migration, RLS policies and generated types.
- Write the Netlify Function skeletons, validation schemas and unit tests.
- Draft legal page templates for your lawyer to review.
- Build the CI configuration and deployment runbook.

## What I cannot do without you
- Anything requiring real brand assets, real service content, real portfolio/testimonials, the legal entity name, currency confirmation, or provider accounts/keys.
- Going live. Production access and live Paystack keys must remain under your control.
