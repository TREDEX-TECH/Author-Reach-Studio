# CI workflow

`github-actions-ci.yml` is the GitHub Actions workflow for this repo, but it is
stored here (not in `.github/workflows/`) because **fine-grained Personal Access
Tokens cannot create workflow files without the `workflow` scope**. Pushing it in
one commit with everything else was rejected by GitHub.

## Enable it (choose one)

**Option A — GitHub UI (30 seconds, no new token):**
1. Open the repo on GitHub → "Add file" → "Create new file".
2. Name it `.github/workflows/ci.yml`.
3. Paste the contents of `ci/github-actions-ci.yml` and commit to `main`.

**Option B — regenerate the token with `workflow` scope:**
- Create a new fine-grained token with **Contents: read/write** AND
  **Workflows: read/write** on this repo, send it over, and I will move the file
  into place and push. Revoke the token afterwards.

**Option C — locally:**
```bash
mkdir -p .github/workflows
cp ci/github-actions-ci.yml .github/workflows/ci.yml
git add .github/workflows/ci.yml && git commit -m "Enable CI" && git push
```
This works from your own machine because your normal GitHub login has the scope.

Until enabled, run these locally: `npm test`, `npm run typecheck`, `npm run build`.
