# 11 — Thin Vertical Slice Plan (~6–8 weeks)

**Decided 25 Oct 2026.** Instead of building all four interfaces shallowly, we make **one
complete real journey** work end-to-end against live Supabase, Netlify, Paystack (test mode)
and email. Once that journey is proven, we scale the same patterns across every other screen.

**Confirmed constraints:** USD only (Paystack settlement confirmed by owner, still to be proven
with a test transaction) · most provider accounts exist · **draft legal entity** for now ·
invite-only vs open registration still open · full vs partial payments still open.

---

## The one journey (the "golden path")

> A visitor enquires → admin qualifies and invites a client → admin sends a versioned proposal →
> client signs in, reviews and accepts → a project with milestones is created → admin issues an
> invoice → client pays via Paystack (test mode) → verified webhook marks it paid → team uploads a
> deliverable to a private bucket → client downloads it via a signed URL and approves it →
> everyone gets the right email/notification at each step.

One service, one client, one staff member, one admin, one project, one invoice, one deliverable.
That is enough to prove **every trust boundary in the blueprint**.

---

## Week-by-week

### Weeks 1–2 — Backend foundation (deployable, no UI change yet)

| # | Work | Done when |
|---|---|---|
| 1 | Apply both existing migrations to **dev**, **staging**, **prod** Supabase projects via CLI; verify all 54 tables, 60 policies, triggers | `supabase db push` succeeds on all three; schema recreated from repo alone |
| 2 | Add **missing migration**: private Storage buckets (`author_assets`, `project_deliverables`, `client_documents`, `marketing_assets`, `public_site_assets`), `storage.objects` policies, signed-URL helper, upload size/MIME limits | A client can list only their own objects; anonymous read fails |
| 3 | Tighten the **9 `using (true)` policies** (roles, org, departments, memberships, package items) to `is_staff()` / `is_admin()` | `docs/05-security-model.md` capability matrix matches the SQL |
| 4 | Generate `lib/database.types.ts` from the live DB; wire `Database` generic into both Supabase clients | `tsc --noEmit` passes with real types |
| 5 | Supabase Auth: invite-only signup, email verification, password reset, MFA for staff, explicit redirect allowlist, custom templates | No self-registration; redirects only to your real domains |
| 6 | `middleware.ts`: session refresh + route protection for `/portal`, `/workspace`, `/admin` | An unauthenticated request to `/admin` redirects to `/sign-in` |
| 7 | CI (GitHub Actions) running `npm test`, `npm run typecheck`, `npm run build`; Netlify deploy from `main`, staging from `staging` | PRs cannot merge on red; preview deploys work |
| 8 | All env vars set in Netlify (dev/staging/prod scopes); `REQUIRE_AUTH=true` in staging | App boots against real Supabase |

**Deliverable:** the current 45 screens still render, but now on top of a real, protected backend.

### Weeks 3–4 — Identity, CRM, catalogue, proposals

| # | Work | Done when |
|---|---|---|
| 9 | Replace the demo `/sign-in` link with real Supabase Auth (sign-in, sign-out, reset, verify) | A real invited user can sign in and their session survives refresh |
| 10 | `profiles` auto-created on first sign-in; roles/permissions seeded; server-side capability checks | A client cannot call an admin-only action even with a crafted request |
| 11 | **Service catalogue from DB** — replace `lib/demo-data.ts` on public `/services` and detail pages; seed with **your one real service** | Editing a service in admin changes the public page |
| 12 | Inquiry function writes to real `inquiries` + sends acknowledgement email; CRM pipeline in `/admin/crm` reads real rows | A real enquiry appears in CRM within seconds and triggers an email |
| 13 | Admin creates client/author/book; invite email sent; `/admin/clients`, `/portal/books` read real data | Client sees only their own books |
| 14 | Versioned proposals: create, add items, send v1, send v2, accept/decline; **accepted version immutable** | Editing the service catalogue later does not change an accepted proposal |
| 15 | On acceptance: create engagement + project + milestones + default tasks (server-side transaction) | Accepting a proposal produces a project with milestones |

### Weeks 5–6 — Finance & payments (the highest-risk part)

| # | Work | Done when |
|---|---|---|
| 16 | Invoices + invoice_items from DB; `/admin/finance` creates an invoice with a **legal-entity snapshot**; `/portal/invoices` reads real rows | Invoice renders from DB, not demo data |
| 17 | Wire `paystack-initialize`, `paystack-webhook`, `paystack-callback` to real **test** keys; webhook URL registered in Paystack | Init returns a real Paystack authorization URL |
| 18 | Prove the money boundary: signature check → re-verify with Paystack → unique provider reference → amount/currency cross-check → single status transition → audit event | A test payment marks the invoice paid exactly once |
| 19 | Negative tests: forged signature, duplicate webhook, wrong amount, wrong currency, refunded/cancelled invoice, browser "success" redirect | None of them can change financial state |
| 20 | **Real USD test-mode transaction** + settlement/payout check in Paystack dashboard | USD settlement is proven, not assumed |
| 21 | Payment history, receipt email, refund workflow (admin-only, audited) | Refund never silently deletes a payment record |

### Weeks 7–8 — Deliverables, notifications, hardening, launch-ready

| # | Work | Done when |
|---|---|---|
| 22 | Private Storage upload (direct-to-storage with size/MIME checks), `file_metadata` rows, `deliverable_versions` | Staff can upload a versioned file; anonymous access is denied |
| 23 | Signed URLs with ownership checks; client download; **approval is a separate step — uploading ≠ complete** | A task stays "in review" until an authorised approver acts |
| 24 | Project conversations + in-app notifications, deduped by `event_key` | Each event produces exactly one notification |
| 25 | Transactional emails: enquiry ack, invite, proposal sent, invoice issued, payment received, deliverable ready, approval requested | All seven templates land with correct links |
| 26 | **7-persona RLS test suite**: anon, client A, client B, staff, dept head, finance, admin | Cross-client leakage is impossible and proven by tests |
| 27 | Mobile/a11y pass, performance check, backup + **tested restore**, runbook, launch checklist | Restore actually works |
| 28 | Replace draft legal text with lawyer-reviewed policies; switch Paystack to **live** only after sign-off | Go/no-go decision documented |

---

## Exact inputs I need from you to start (Week 1)

Send these as **dashboard values or env vars**, never as real secrets in chat.

### 1. Supabase (dev + prod; staging optional but recommended)
- Project name, **project ref**, region, and project URL for each environment
- Publishable key for each (browser-safe — OK to paste)
- Confirm the **service-role key**, **DB password** and **JWT secret** are set in Netlify env vars only
- Confirm branch/CLI access so I can run `supabase db push` and `supabase gen types`
- ⚠️ Tell me the **email** on the Supabase org so I can confirm business ownership

### 2. Netlify
- Site name + team, connected to `TREDEX-TECH/Author-Reach-Studio`
- Production domain + staging URL
- Confirm all env vars from `.env.example` are set with the right scopes (dev/staging/prod)
- Build command `npm run build`, publish `.next`, `@netlify/plugin-nextjs` installed

### 3. Paystack
- Confirm **test** secret key + public key are in Netlify (not chat)
- Register webhook URL: `https://<your-domain>/.netlify/functions/paystack-webhook`
- Confirm the merchant's **legal name matches the invoice entity** (draft is fine for test, must be real for live)
- Do one USD test transaction and show me the settlement result

### 4. Email
- Provider (Resend / Postmark / Supabase SMTP), API key in Netlify, **verified sending domain** (SPF/DKIM/DMARC)
- `From` address, e.g. `Author Reach Studio <hello@yourdomain.com>`
- Reply-to / support address

### 5. Domain
- The real domain (set `NEXT_PUBLIC_SITE_URL`; `app/layout.tsx` reads it instead of a hardcoded domain)
- DNS access for the email domain + Auth redirect allowlist entries

### 6. Content (even a minimal version unblocks the whole slice)
- **One complete service**: name, category, short promise, full description, what's included, deliverables, eligibility, duration, pricing model, **USD price**, revision rounds
- **Draft legal entity** string to use consistently everywhere (clearly marked as draft)
- About text, contact details, response SLA
- Draft Privacy / Terms / Refund / Cancellation / Service policies (lawyer review can come later)
- Confirmation: no real case studies/testimonials yet → the section launches empty

### 7. People for testing
- 1 admin, 1 staff member, 1 client — real emails for invite testing
- Department names + heads
- Capability matrix: who can approve, refund, issue invoices, see reports, manage roles

### 8. Two decisions still open
- **Full payment only** or allow instalments/partial? (recommend full)
- **Invite/approval-only** or open self-registration? (recommend invite-only)

---

## What I can start immediately, before any of the above arrives

- Write the Storage buckets + `storage.objects` policies migration.
- Tighten the 9 broad RLS policies.
- Write `middleware.ts` scaffold, the 7-persona RLS test harness, and the GitHub Actions CI file (staged in `ci/` — enable per `ci/README.md`).
- Write the email templates and notification dedup logic.
- Write the proposal → project transaction and the deliverable approval state machine.
- Add regression tests for the money boundary (forged/duplicate/wrong-amount webhooks).

None of these need credentials, so they can land in the repo this week while you gather the inputs.

---

## Definition of done for the slice

A real person can:

1. Visit the live site, read a real service page, submit an enquiry, and get an acknowledgement email.
2. Be invited as a client, sign in, and see **only** their own records.
3. Receive a versioned proposal, accept it, and see a project with milestones appear.
4. Receive an invoice, pay it in Paystack **test mode**, and see it marked paid **only** after server-side verification.
5. Download a real deliverable from private storage via a signed URL and approve it.
6. Have a staff member upload work that stays "in review" until approved — never auto-complete.
7. Have an admin see the whole chain in CRM, finance and the audit log, with reports that reconcile to verified payments.

And: no client can see another client's data, internal notes or costs; no forged/duplicate payment event can change state; backups restore; USD settlement is proven.

**Only then** do we scale the same patterns across the remaining services, campaigns, reporting modules and content pages — that's the rest of the 14–20 week roadmap.
