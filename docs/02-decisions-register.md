# 02 — Decision Register (please confirm or change each row)

> Reply with **"defaults are fine"** to accept every recommendation, or tell me the row numbers you want changed.
> Decisions 1–10 come from §17 of your blueprint. 11–20 are technical decisions the blueprint implies but does not settle. 21–22 record the confirmed visual direction.

| # | Decision | Recommended default | Why | Affects | Your call |
|---|---|---|---|---|---|
| 1 | Full payment only, or instalments? | **Data model supports partial payments; business rule starts as FULL payment only**, toggle per invoice (`allow_partial` flag). | Matches your blueprint; avoids reconciliation complexity at launch while keeping the option. | Invoices, Paystack init, balance calc | ☐ |
| 2 | Client registration | **Invite / approval only.** Public visitors submit an inquiry; an admin converts it to an account. | Prevents fake accounts and keeps CRM clean. You can switch to self-serve later with one setting. | Auth, onboarding, CRM | ☐ |
| 3 | Staff onboarding | **Admin-invited only.** | Strongest security; no public staff signup. | Auth, org module | ☐ |
| 4 | Proposal acceptance | **Online acceptance with recorded terms + IP + timestamp + version hash is sufficient for v1.** Add e-signature later if a client/contract requires it. | Avoids a third-party dependency before it is needed. Record the acceptance evidence anyway. | Proposals, legal | ☐ |
| 5 | Communication scope | **Project-scoped conversations + internal notes for v1.** No global inbox. | Simpler RLS, covers 90% of needs. | Messages, notifications | ☐ |
| 6 | Public pricing | **Show "from" prices or "Custom proposal" per service — admin-controlled per service.** | Flexibility: some services are fixed, some bespoke. | Service pages, catalogue | ☐ |
| 7 | Currencies | ✅ **CONFIRMED 25 Oct 2026: USD only.** Every invoice and payment stores its currency. ⚠️ **Action:** verify in your Paystack dashboard that your merchant account can **accept and settle USD**. Nigerian Paystack accounts commonly settle NGN; if USD is unavailable we must either (a) invoice in NGN with a documented conversion, or (b) use a USD-capable provider/corridor. Do not go live on this assumption. | Invoices, Paystack, reports | ✅ |
| 8 | File limits | **Documents 25 MB, images 15 MB, video deliverables 500 MB via direct-to-Storage signed upload; allowlist MIME types.** | Prevents serverless timeouts; large files never pass through a function. | Storage, uploads | ☐ |
| 9 | Legal / payment recipient | **Confirm exact registered entity name + registration no. + address.** Brand presents as "Author Reach Studio, a Tredex brand" but the contracting party and Paystack recipient must be the real registered business. | Legal and Paystack compliance. **This needs your answer — I cannot guess it.** | Legal pages, invoices, Paystack | ☐ |
| 10 | Reporting visibility | **Executives: full. Finance: financial only. Dept heads: their department's delivery metrics. Project managers: their projects. Team: their tasks.** | Principle of least privilege. | RLS, dashboards | ☐ |
| 11 | Supabase region | **`eu-west-2` (London) or `eu-central-1` (Frankfurt)** — good latency to Nigeria; confirm data-residency requirements. | Latency + compliance. | All data | ☐ |
| 12 | Number of environments | **Dev + Production minimum; add Staging before the first real client.** | Your blueprint §10.1. | Cost, CI | ☐ |
| 13 | Checkout method | **Server-initialised Paystack transaction → redirect to hosted checkout URL.** Inline JS only if you want the popup UX. | Both are safe with server init; hosted redirect is simplest and works on mobile. | Paystack function | ☐ |
| 14 | Invoice numbering | **`ARS-YYYY-####`** (e.g. `ARS-2026-0041`), gapless via a DB sequence, immutable once sent. | Audit-friendly. | Invoices | ☐ |
| 15 | Payment terms | **Due 14 days from issue. Overdue status computed from `due_date`, not a cron job.** | Simple, deterministic. | Invoices, reports | ☐ |
| 16 | Tax / VAT | **Confirm whether prices are tax-inclusive and which tax ID appears on invoices.** | Required for compliant invoices. **Needs your answer.** | Invoices, legal | ☐ |
| 17 | Email provider | **Resend** (simple API, good deliverability) with a verified sending domain; Supabase SMTP as fallback. | Reliable verification/invoice emails. | Auth, notifications | ☐ |
| 18 | Auth method | **Email + password with email verification; add magic link / SSO later.** | Familiar to non-technical authors. | Auth | ☐ |
| 19 | Realtime | **Defer.** Use polite polling / refetch on focus for v1. | Blueprint says optional. | Messages, notifications | ☐ |
| 20 | First-release scope | **Your §16 list (12 items), in the phase order of §14.** No campaign automation, no AI. | Prevents scope creep. | Roadmap | ☐ |

## Also needed (not decisions — facts)
- Domain name(s) and DNS control.
- Exact list of departments and the named system administrators.
- Real service catalogue content (see `docs/07-content-inventory.md`).
- Real portfolio/testimonial permissions (or confirmation to ship without them).
- Paystack test keys configured + supported currencies confirmed.
- Target launch date and budget/timeline for each phase.

| 21 | Visual direction | ✅ **CONFIRMED 25 Oct 2026:** orange + white brand (sampled `#F4761F` from Tredex logo), real ARS + Tredex logos, light **and** dark themes, dashboard-inspired layout (sidebar, hero banner, KPI tiles, quick actions) — tech-savvy but simple. Applied across all four interfaces and the invoice. | See `docs/09-visual-redesign.md` | ✅ |
| 22 | Favicon | ✅ **CONFIRMED:** AR monogram + book from the transparent ARS logo on an orange square. | Implemented as `app/icon.png`, `app/apple-icon.png`, `public/favicon.ico` | ✅ |

| 23 | Paystack USD settlement | ✅ **CONFIRMED 25 Oct 2026:** owner confirms the merchant account can accept and settle USD. ⚠️ Still prove it with a real **test-mode USD transaction** and a settlement/payout check before enabling live keys. | Finance, Paystack | ✅ |
| 24 | Provider accounts | ✅ **CONFIRMED:** most accounts already exist. Owner to supply the exact list + project refs/URLs. Only missing ones need setup checklists. | Phase 2 | ✅ |
| 25 | Build sequence | ✅ **CONFIRMED:** **thin vertical slice first** (~6–8 weeks) — make one complete journey real end-to-end before scaling out. See `docs/11-vertical-slice-plan.md`. | Roadmap | ✅ |
| 26 | Legal entity | 🟡 **DRAFT for now.** Build with clearly marked placeholders, but **replace with the real registered entity before any real invoice or live payment**. Must match the Paystack recipient exactly. | Invoices, legal, Paystack | 🟡 |
| 27 | Payment rule | ❓ **Still open:** full payment only vs instalments. Recommendation: full at launch; schema already supports partial. | Invoices, Paystack | ❓ |
| 28 | Registration model | ❓ **Still open:** invite/approval-only (recommended) vs open signup. Determines the Auth build in weeks 1–4. | Auth | ❓ |
