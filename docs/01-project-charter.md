# 01 — Project Charter (condensed source of truth)

## Mission
Build one connected platform for Author Reach Studio (a specialist brand of **Tredex**) that runs the whole agency: marketing site → inquiry → CRM → proposal → project delivery → invoice → verified payment → reporting.

## The four interfaces
| Interface | Audience | Primary job |
|---|---|---|
| Public website | Prospective authors | Discover, trust, enquire |
| Client portal | Registered authors | Books, proposals, projects, approvals, invoices, files, messages |
| Team workspace | Staff | Assigned tasks, uploads, internal review, project conversations |
| Admin dashboard | Management / finance / admins | Users, CRM, org structure, service catalogue, finance, reports, settings, audit |

They are **one application** with one database, not four websites.

## Non-negotiable principles
1. **One source of truth** — Supabase Postgres holds the authoritative record.
2. **Role-based + resource-level access** — RLS plus server-side checks; never UI-only security.
3. **Secure by default** — validate on the server, audit sensitive changes, private storage by default.
4. **Modular monolith** — one deployable, clear feature modules, no premature microservices.
5. **Configurable operations** — services, departments, statuses and settings editable in admin, not in code.
6. **Traceable changes** — proposals, invoices, payments, approvals, permissions are append-only histories.
7. **Honest reporting** — no promise of guaranteed sales/rankings; distinguish work completed, activity, observed results, and external-platform-dependent outcomes.

## Technology
| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + React + TypeScript, responsive, accessible |
| Hosting / server | Netlify + Netlify Functions for trusted operations |
| Database / auth / storage | Supabase: Postgres, Auth, RLS, Storage, migrations |
| Payments | Paystack (server-side init + verification, webhook, idempotency) |
| Email | Configurable provider (Resend/Postmark/SMTP) behind one interface |
| Repo | GitHub (business-owned), CI checks on typecheck/test/build |

## Trust boundaries (the most important diagram in this project)
```
Browser  ──(publishable key + RLS)──►  Supabase Data API / Storage
   │
   └──(authenticated request)──►  Netlify Function (service-role key)
                                      │
                                      ├── validate caller identity + permission
                                      ├── re-read authoritative DB state
                                      ├── call Paystack with secret key
                                      └── write verified result (idempotent)
Paystack ──(signed webhook)──►  Netlify Function ──►  verify ──►  DB
```
A browser redirect to a "success" page is **never** proof of payment.

## Definition of done (per feature)
A feature is complete only when: the full user workflow works, server-side auth + RLS are enforced, inputs are validated, all states (loading/empty/error/success) are handled, audit/notification events are recorded, and automated tests cover the business rule and the forbidden access path.

## Out of scope for the first usable release
Realtime collaboration, complex marketing automation, AI content generation, advanced third-party analytics, multi-tenant reselling, native mobile apps. The data model should not prevent adding them later.
