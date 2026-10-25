# 05 — Security & Authorisation Model

## 1. Identity vs authorisation
`auth.users` is the identity (Supabase Auth). `public.profiles` holds application data. `public.user_roles` + `public.author_memberships` + `public.project_members` + `public.department_memberships` determine **what a person may see**. Being logged in grants almost nothing on its own.

## 2. Roles (configurable, not hardcoded)
`public.roles` is a table, not an enum in application code. Initial rows: `visitor`, `author`, `team_member`, `department_head`, `project_manager`, `finance_officer`, `administrator`, `executive`.

A user can hold multiple roles. A job title (`positions.title`) is **descriptive only** and never grants access. An admin can create new roles and attach permissions.

## 3. Permission layers (all must pass)
```
1. Supabase Auth session valid
2. RLS policy on the row (relationship-based, not role-only)
3. Netlify Function re-validates caller + resource for privileged ops
4. Zod input validation
5. DB constraints / triggers (final backstop)
```
Hiding a button is not security.

## 4. Role capability matrix (v1)
| Capability | Author | Team | Dept head | PM | Finance | Admin | Exec |
|---|---|---|---|---|---|---|---|
| Read own books / projects / invoices | ✅ | — | — | — | — | ✅ | ✅ |
| Read other clients' records | ❌ | ❌ | ❌ | ❌ | ❌ | ✅¹ | ✅¹ |
| Update own task status | — | ✅ | ✅ | ✅ | — | ✅ | — |
| Approve internal review | ❌ | ❌ | ✅ | ✅ | — | ✅ | — |
| See internal notes / cost & margin | ❌ | Scoped | Scoped | Scoped | ❌ | ✅ | ✅ |
| Create / send invoice | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | — |
| Mark payment verified | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reconcile verified payment | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | — |
| Grant roles / change permissions | ❌ | ❌ | ❌ | ❌ | ❌ | ✅² | — |
| Manage public content | ❌ | ❌ | Scoped | ❌ | ❌ | ✅ | — |
| Full financial + delivery reports | ❌ | ❌ | Dept only | Projects only | Finance only | ✅ | ✅ |

¹ Subject to audit logging. ² Requires a second server-side check + audit event.

**Note:** "Mark payment verified" is intentionally available to **no human role**. Only the trusted webhook/verification function, using a verified Paystack response, can write that state. This is the single most important rule in the finance module.

## 5. Financial trust boundary
- The browser never supplies the amount. The function re-reads the invoice from the DB.
- Amount, currency, invoice status, outstanding balance and invoice ownership are all checked server-side.
- `payment_transactions.provider_reference` is UNIQUE. `payment_events` is append-only.
- Replaying a successful webhook is a no-op (idempotent upsert keyed on the provider event/reference).
- Invoice status is **derived** from verified transactions, never set directly by a client.
- Refunds are separate records and never delete the original payment.

## 6. Storage
- Private buckets by default. Signed URLs expire quickly (e.g. 5–15 min).
- Object path starts with the owning author/project UUID; storage policies call the same helper functions as the DB.
- MIME allowlist + size cap enforced both client-side (UX) and server-side (security).
- Deliverable versions are append-only; a new upload never overwrites history.

## 7. Audit
`public.audit_events` is append-only for ordinary users (no UPDATE/DELETE policy). It records: role/permission changes, invoice creation/adjustment, payment verification, proposal acceptance, approvals, admin configuration changes, privileged record access. Each row includes actor, action, entity, before/after hash, IP/user-agent where available, and timestamp.

`public.activity_events` is the lighter-weight operational feed (task moved, file uploaded, message posted) that drives in-app notifications.

## 8. Operational hardening
- Rate-limit inquiry, login and payment-init endpoints.
- Validate Paystack webhook signature using the raw request body.
- Explicit Supabase Auth redirect allowlist; no wildcard redirects in production.
- Security headers in `netlify.toml` (nosniff, DENY framing, strict referrer).
- Secrets only in Netlify env UI; rotate on exposure.
- Synthetic data only in dev; no real customer records in development.
