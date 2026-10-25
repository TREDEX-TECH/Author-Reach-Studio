# Supabase Edge Functions

## `inquiry/` — public enquiry intake

**Deployed:** project `xozbyrzpsopqugobjivs`, slug `inquiry`, version **3**, `verify_jwt = false`.

`verify_jwt = false` is intentional: this is a public contact form. Security comes from
server-side validation, a honeypot, rate limiting, and the fact that **there is no anon
INSERT policy on `public.inquiries`** — the browser cannot write to that table directly.
Only this function (using the runtime-injected `SUPABASE_SERVICE_ROLE_KEY`) can insert.

Deploy with:

```bash
supabase functions deploy inquiry --project-ref xozbyrzpsopqugobjivs --no-verify-jwt
```

No external npm/esm.sh imports — the first version imported `@supabase/supabase-js`
from `esm.sh` and failed to boot (`BOOT_ERROR`). This version uses plain `fetch` to
PostgREST, which is reliable in the edge runtime.

The website calls it through the same-origin proxy `app/api/inquiry/route.ts`, so the
browser never needs the Supabase function URL or CORS handling.

The equivalent `netlify/functions/inquiry.ts` remains as the Netlify deployment option;
both paths enforce the same trust boundary.
