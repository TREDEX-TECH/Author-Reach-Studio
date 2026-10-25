# START HERE — Author Reach Studio

**Status:** Phase 1 foundation + interactive prototype (25 Oct 2026).
**Read time:** 8 minutes.

---

## 1. Short answer

Yes — this can be built. Your blueprint is genuinely good: it already defines the architecture, the modules, the security boundaries and the acceptance criteria. What it does **not** yet define is the *business content and the decisions* that the code needs. That is the gap I need you to close.

I have already built you a **working foundation** so this is not just a conversation:

| What you have now | Where |
|---|---|
| A running Next.js + TypeScript prototype of the public site, client portal, team workspace and admin dashboard (demo data, clearly labelled) | `app/`, `components/`, `lib/` — live preview on port 3000 |
| The initial Supabase PostgreSQL schema: ~50 tables, foreign keys, constraints, RLS enabled, security-definer permission helpers, audit triggers | `supabase/migrations/20261025000000_init.sql` |
| Paystack + inquiry Netlify Function skeletons with the correct server-side trust boundaries | `netlify/functions/` |
| `.env.example`, `netlify.toml`, generated-types script, test harness | repo root, `tests/` |
| The decision register, the "what I need from you" checklist, Supabase setup guide, security model, content inventory and phased roadmap | `docs/` |

> **Important:** everything in the prototype is **demo/mock data** and no real credentials are wired in. It is a design and architecture artefact, not a production system. Nothing is live until you provide the items in §3 and we work through the phases in `docs/06-roadmap.md`.

---

## 2. How I propose we work

Your blueprint says it best: *"Phase 1 completion condition: the project has an agreed, documented foundation before extensive coding begins."* So:

1. **You answer the 17 decisions** in `docs/02-decisions-register.md` (I've pre-filled a recommended default for every single one — you can just say "defaults are fine" and we move).
2. **You supply the inputs** in `docs/03-what-we-need-from-you.md` (brand, content, accounts, service catalogue, people).
3. I convert the prototype into the real application, starting with Phase 2 (repo + Supabase + auth + RLS), then Phase 3 (public site), and so on.
4. Each phase ends with a testable, deployed increment — not a big-bang launch.

I will **not** need your passwords or secret keys in this chat. You set them in Supabase, Netlify and Paystack dashboards; I only need to know *that they are configured* and their non-secret identifiers (project URL, project ref, public key, merchant currency).

---

## 3. The short list — what I need from you to fully design this

### A. Decisions (blocking — needed before we build the relevant workflow)
The 17 open questions from §17 of your blueprint, plus a few technical ones. Full table with recommendations: **`docs/02-decisions-register.md`**. The five that block the most work:
1. Full payment only, or instalments/partial payments?
2. Open client registration, or invite/approval only?
3. Public pricing, or custom proposals only?
4. Which currencies at launch (and which does your Paystack merchant account actually accept)?
5. Which registered legal entity is the contracting party and payment recipient — Tredex, or another name?

### B. Brand & identity
- Logo (SVG/AI/PNG, ideally vector) + any brand guidelines: colours, fonts, tone of voice.
- The exact legal/business name, registration number, registered address, and the precise wording of the Tredex relationship ("Author Reach Studio is a brand of Tredex" vs "a Tredex company" vs something else).
- Domain name(s) you own, and whether the portal lives on a subdomain or the same domain.

### C. Real content (I will not invent this)
- **Service catalogue**: name, one-line promise, full description, scope, deliverables, eligibility, estimated duration, price or "by proposal", for each service you actually offer. ~8–12 services.
- **Portfolio / case studies**: only genuine projects with written client permission. If you have none yet, we ship an honest "Selected work coming soon" section instead of fake logos.
- **Testimonials**: real quotes with attribution permission. Same rule.
- **Team**: names, roles, departments, headshots (optional), bios.
- **Legal text**: Privacy Policy, Terms of Service, Refund/Cancellation Policy, and any required payment disclosures — ideally reviewed by your lawyer. I can provide a solid first draft, but it is not legal advice.
- **FAQ**: the 10–15 questions authors actually ask you.
- **Contact**: email addresses, phone, WhatsApp, physical address, business hours, social links.

### D. People & permissions
- The real department list (the blueprint gives 7 examples — confirm, rename, add).
- Who are the department heads, project managers, finance officers, and the one or two **system administrators**?
- The initial staff roster (name + email + department + job title). Job titles must not grant permissions — we map them separately.
- Who owns backups/recovery and who approves going live with real Paystack keys?

### E. Accounts & access (you own all of these — keep billing control)
| Account | What I need from you |
|---|---|
| **Supabase** | Create the org/project under a business-owned account. Give me: project name, project URL, project ref, region, and whether it is dev/staging/prod. Grant developer access through Supabase's team/membership controls. Do **not** paste the service-role key here. |
| **Netlify** | Site created and linked to the GitHub repo; you add the environment variables from `.env.example`. |
| **Paystack** | Business account verified, **test** keys for development, supported currencies confirmed, webhook URL we will register. Live keys only after Phase 8 sign-off. |
| **GitHub** | Repo created under a business-owned org; developer access for me. |
| **Email provider** | Resend/Postmark/SMTP account + verified sending domain (SPF/DKIM). Needed for verification, invoices, notifications. |
| **Domain / DNS** | Registrar access to point the domain and create the email records. |
| **Backups** | Confirm the Supabase plan's backup retention and name the recovery owner. |

### F. Operational rules
- Invoice numbering format, payment terms (e.g. due in 14 days), late-fee policy, tax/VAT handling, refund window.
- File limits: allowed types + max sizes for client uploads and video deliverables.
- Proposal validity period and whether online acceptance is enough or you need e-signature.
- Notification preferences: which events should email vs in-app only.

### G. Success criteria
- Your target launch date and what **must** be in the first release vs what can wait.
- 3–5 concrete acceptance tests you care most about (e.g. "Author A cannot see Author B's invoice").

---

## 4. What you do **not** need to give me

- Passwords, secret keys, service-role keys, database passwords, Paystack secret keys — ever, in chat, in a GitHub issue, or in a document.
- Real customer data for development. We use synthetic seed data (`supabase/seed.sql`).
- Live Paystack keys until Phase 8.

---

## 5. What I'll deliver after you answer

1. A **confirmed decisions document** signed off and stored in `docs/`.
2. A **real Phase 2 repo**: auth flows, generated DB types, RLS policies, CI checks, dev + prod Supabase projects, deployed Netlify preview.
3. A **clickable, content-accurate public website** using your real service catalogue and brand.
4. Then, phase by phase, the four working environments.

**Next action:** open `docs/02-decisions-register.md`, mark each row "Confirm" / "Change", and send me the brand + content pack from `docs/03-what-we-need-from-you.md`. If you want to move fast, just say **"use your recommended defaults"** and I'll proceed with those, flagging anything that needs a legal decision.


---

## 6. Your decisions so far (recorded 25 Oct 2026)

| Topic | Your answer | What I changed |
|---|---|---|
| Currency | **USD only** | Schema defaults, `application_settings`, all demo pricing/invoices/reports now use USD (`$`). |
| Next step | **Refine the prototype design first** | Added `/design-system` — a reviewable style guide (colours, type scale, components, states). |
| Provider accounts | **Some exist, some don't** | Tell me which ones; I'll give you a setup checklist for the rest. |
| 20 decisions | **Discuss the big ones first** | See the four discussion points below — I have not guessed these. |

### Four things I still need from you before full design work
1. **Legal entity** — the exact registered name, registration number, address, and the Tredex relationship sentence. This appears on invoices, Paystack recipient details, contracts and legal pages.
2. **USD settlement** — confirm in your Paystack dashboard that the merchant account can accept and settle USD. If it cannot, we must pick NGN (with a conversion policy) or a USD-capable payment route.
3. **Payments** — full payment only, or instalments? (Recommendation: full payment at launch, data model supports partial.)
4. **Registration** — invite/approval-only clients and staff, or open self-registration? (Recommendation: invite-only.)

> I have not hardcoded the other 16 decisions. They remain in `docs/02-decisions-register.md` with recommended defaults.


---

## 7. Visual redesign applied (25 Oct 2026)

Your Google Drive folder supplied the missing brand assets. I applied them across the whole
application: **orange `#F4761F` + white**, real **Author Reach Studio** and **Tredex** logos,
an ARS favicon, **light/dark theme switcher**, and the dashboard-style structure from your
three design boards (gradient hero banner, KPI tiles, quick actions, dark sidebar, search,
status tables). The **invoice** is now a print-ready branded document with a payment card.

See `docs/09-visual-redesign.md` for the full spec and `DRIVE-CONTENTS.md` for the Drive
inventory. Open `/design-system` in the live preview to review and toggle themes.

Still needed for pixel-perfect branding: a vector (SVG/AI) ARS logo, your official brand hex
if it differs from the sampled orange, and any corporate font files.
