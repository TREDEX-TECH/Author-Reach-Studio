# Pushing this project to GitHub

The repository is initialised and committed locally on branch `main`.
**No credentials are stored in this repo.** `.env.local` and all secret files are ignored.

---

## Option A — Arena pushes it for you

1. **Create an empty repository** in your GitHub account or organisation
   (recommended: a business-owned org, not a freelancer's personal account).
   Do **not** add a README, licence or .gitignore — the repo already has them.
2. **Create a Personal Access Token (fine-grained)**:
   - GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.
   - Expiration: shortest available (e.g. 7 days).
   - Repository access: **Only select repositories → your new repo**.
   - Permissions → Repository permissions: **Contents: Read and write**, Metadata: Read-only.
   - Generate and copy the token.
3. Send me **the repository URL** (e.g. `https://github.com/tredex/author-reach-studio.git`)
   and **the token**. I will push using `scripts/push-to-github.sh` and then confirm.
   That script passes the token through `GIT_ASKPASS`, so it is never written into
   `.git/config`, the remote URL, the command line or the process list.
4. **Revoke/delete the token immediately after** the push is confirmed.

To run the same push yourself:
```bash
GH_REPO_URL=https://github.com/<OWNER>/<REPO>.git GH_PUSH_TOKEN=<token> ./scripts/push-to-github.sh
```

> ⚠️ Pasting a token into a chat means it appears in the conversation. Use a short-lived,
> single-repository, Contents-only token, and revoke it right after. If you are not
> comfortable with that, use **Option B** instead — no secret ever leaves your machine.

---

## Option B — You push it yourself (recommended for sensitivity)

From the workspace, download either:
- `author-reach-studio.zip` — source tree (no `.git`), or
- `author-reach-studio.bundle` — full git history, including the commit.

Then, on your own machine:

```bash
# Using the bundle (keeps the existing commit/history)
git clone author-reach-studio.bundle author-reach-studio
cd author-reach-studio

# Or, using the zip
unzip author-reach-studio.zip && cd author-reach-studio && git init -b main && git add -A && git commit -m "Initial commit"

# Create an empty repo on GitHub first, then:
git remote add origin https://github.com/<OWNER>/<REPO>.git
git branch -M main
git push -u origin main
```

If you use SSH instead, set `origin` to `git@github.com:<OWNER>/<REPO>.git`.

---

## After pushing

1. **Protect `main`**: GitHub → Settings → Branches → require PR reviews + status checks.
2. **Add secrets in Netlify**, not in the repo. Copy `.env.example` → Netlify environment variables.
3. **Connect Netlify to the GitHub repo** for automatic deploys.
4. **Add collaborators** through the GitHub org with least privilege; remove developer access when done.
5. **Never commit** `.env.local`, service-role keys, Paystack secret keys, or database passwords.

---

## What is in the commit

- Next.js 15 + TypeScript app — 45 routes across four interfaces
- Orange/white brand system, light + dark themes, real ARS/Tredex logos + favicon
- Supabase: 2 migrations (55 tables, RLS, audit), seed, config, auth templates
- Netlify Functions: inquiry, Paystack init/webhook/callback
- Print-ready branded invoice with verified-payment flow
- `docs/01–09`, decision register, security model, roadmap, visual redesign spec
- 15 architecture/security tests + verify and manifest scripts
