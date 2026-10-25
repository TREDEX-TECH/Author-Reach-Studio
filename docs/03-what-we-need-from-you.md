# 03 — What We Need From You (the complete intake checklist)

Two kinds of input: **information** (you can paste it here) and **access** (you grant it through the provider's own dashboard — never send secrets in chat).

---

## A. Decisions — blocking
Work through `docs/02-decisions-register.md`. Twenty rows, all pre-filled with a recommendation. Blocking minimum: currency, legal entity, registration model, payment rule, pricing visibility.

---

## B. Brand pack
- [ ] Logo — vector (SVG/AI/EPS) preferred, plus a monochrome version and a favicon.
- [ ] Brand colours (hex) and typography (font names or files). If you have no guidelines, I'll use the prototype's editorial palette and document it as the interim system.
- [ ] Tone of voice: 3 adjectives + one example paragraph you like.
- [ ] Any imagery you own (team photos, office, book/marketing visuals).
- [ ] The exact Tredex relationship sentence, e.g. *"Author Reach Studio is a specialist brand of Tredex."*
- [ ] Business details: registered name, registration number, registered address, contact email, phone, WhatsApp, business hours, social links.

---

## C. Content pack (I will not fabricate this)
For **each service** in your catalogue (expect 8–12):
- [ ] Service name
- [ ] One-line promise
- [ ] Full description (who it's for + the problem it solves)
- [ ] Scope of work (included / not included)
- [ ] Concrete deliverables
- [ ] Eligibility requirements (e.g. "Amazon A+ Content requires Brand Registry")
- [ ] Typical duration
- [ ] Price: fixed / from / custom proposal
- [ ] 3–5 FAQs specific to that service

Other pages:
- [ ] **Home** headline + 3 proof points + primary CTA wording.
- [ ] **About**: founding story, mission, why you exist, who is behind it.
- [ ] **How It Works**: your real 4–6 step engagement process.
- [ ] **Portfolio/Case studies**: real projects, with written permission to show name/logo/results. If none: confirm we publish an honest "work coming soon" state.
- [ ] **Testimonials**: real quote + name + role + permission. No invented results.
- [ ] **Resources/Blog**: 3–5 starter article topics or existing articles.
- [ ] **FAQ**: the 10–15 questions authors actually ask, with your answers.
- [ ] **Legal**: Privacy Policy, Terms of Service, Refund/Cancellation & Payment Policy. I can draft these for your lawyer to review — flag if you already have them.
- [ ] **Team**: names, job titles, departments, short bios, optional photos.

---

## D. People & permissions
- [ ] Final department list (blueprint suggests 7 — confirm/rename/add).
- [ ] Named department heads, project managers, finance officers.
- [ ] Named **system administrators** (recommend max 2).
- [ ] Staff roster: full name, work email, department, job title, reporting manager.
- [ ] Who approves: (a) going live with Paystack live keys, (b) production deployments, (c) refunds.
- [ ] Who owns backup/restore testing.

---

## E. Accounts & access — you own every account
| # | Provider | What you do | What you tell me (non-secret only) |
|---|---|---|---|
| 1 | **Supabase** | Create organisation + **Dev** project under a business-owned account. Note region. Add developers via team access (least privilege). Enable Auth email verification. Create the 5 storage buckets. | Project name, project URL, project ref, region, environment label (dev/staging/prod). |
| 2 | **Netlify** | Create site, connect GitHub repo, add all env vars from `.env.example` (server-only values typed directly into Netlify UI). | Site name + deploy preview URL. |
| 3 | **Paystack** | Verify business, get **test** keys, confirm supported currencies, register the webhook URL after we deploy. | Test public key, merchant currency list, business/recipient name. |
| 4 | **GitHub** | Create repo under a business-owned org, add developers. | Repo URL. |
| 5 | **Email provider** | Create account, verify sending domain (SPF/DKIM/DMARC), set `EMAIL_FROM`. | Provider chosen + verified domain. |
| 6 | **Domain/DNS** | Own the domain; be ready to add A/CNAME + email records. | Domain + subdomain plan (e.g. `app.yourdomain.com` vs `yourdomain.com/portal`). |
| 7 | **Backups** | Confirm Supabase plan's backup retention and schedule a restore test. | Plan name, retention period, named recovery owner. |

**Never send me:** service-role/secret keys, database passwords, Paystack secret keys, email API keys, or real client data. Put them in Netlify/Supabase/Paystack dashboards only.

---

## F. Operational rules
- [ ] Invoice number format + starting number.
- [ ] Payment terms (days), late fee / reminder cadence.
- [ ] Tax/VAT treatment + tax ID on invoices.
- [ ] Refund window + approval workflow.
- [ ] Proposal validity period (e.g. 30 days).
- [ ] Allowed file types + max sizes (or accept the defaults in decision 8).
- [ ] Which events should trigger an email vs in-app notification only.
- [ ] Support channel: is project messaging the only channel, or also email/WhatsApp?

---

## G. Success criteria
- [ ] Target launch date.
- [ ] Must-have vs nice-to-have for the first release.
- [ ] 3–5 acceptance tests you personally want to see pass (e.g. *"Author A cannot fetch Author B's invoice by changing the ID"*).
- [ ] Who signs off each phase.

---

## H. Nice-to-have (speeds things up but not blocking)
- Existing brand/style references (2–3 websites you like, and why).
- Analytics accounts (GA4 / Plausible) and a privacy-friendly analytics choice.
- A staging domain.
- Sample historical data to import (CSV is fine).
