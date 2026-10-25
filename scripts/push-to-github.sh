#!/usr/bin/env bash
# Safe one-shot push. The token is read from the environment and supplied via
# GIT_ASKPASS, so it is NEVER written into .git/config, the remote URL, argv,
# the process list, or any committed file.
set -euo pipefail

: "${GH_REPO_URL:?Set GH_REPO_URL, e.g. https://github.com/OWNER/REPO.git}"
: "${GH_PUSH_TOKEN:?Set GH_PUSH_TOKEN to a short-lived fine-grained PAT}"

cd "$(dirname "$0")/.."

# Refuse to run if secrets are accidentally tracked.
if git ls-files | grep -qE '(^|/)\.env(\.local|\.production)?$'; then
  echo "ERROR: a .env file is tracked. Refusing to push." >&2
  exit 1
fi

git remote remove origin 2>/dev/null || true
git remote add origin "$GH_REPO_URL"

ASKPASS="$(mktemp)"
trap 'rm -f "$ASKPASS"' EXIT
cat > "$ASKPASS" <<'ASK'
#!/usr/bin/env bash
case "$1" in
  *Username*) printf '%s' 'x-access-token' ;;
  *Password*) printf '%s' "$GH_PUSH_TOKEN" ;;
  *) printf '' ;;
esac
ASK
chmod +x "$ASKPASS"

export GIT_ASKPASS="$ASKPASS"
export GIT_TERMINAL_PROMPT=0
export GH_PUSH_TOKEN

echo "Pushing branch 'main' to $GH_REPO_URL ..."
git push -u origin main
echo "Done. Revoke the token now."
