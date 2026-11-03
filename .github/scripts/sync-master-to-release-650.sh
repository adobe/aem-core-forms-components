#!/usr/bin/env bash
set -euo pipefail

: "${GH_REPO:?GH_REPO must identify the target repository}"

git fetch --no-tags origin \
    +refs/heads/master:refs/remotes/origin/master \
    +refs/heads/release/650:refs/remotes/origin/release/650

source_sha=$(git rev-parse refs/remotes/origin/master)
base_sha=$(git rev-parse refs/remotes/origin/release/650)
branch="automation/sync-master-to-release-650-${source_sha}"

if [[ -n "${RELEASE_TAG:-}" ]]; then
    git check-ref-format "refs/tags/${RELEASE_TAG}"
    git fetch --no-tags origin "refs/tags/${RELEASE_TAG}:refs/tags/${RELEASE_TAG}"
    if ! git merge-base --is-ancestor "refs/tags/${RELEASE_TAG}^{commit}" "$source_sha"; then
        echo "::error::The published release tag is not on master."
        exit 1
    fi
fi

if git merge-base --is-ancestor "$source_sha" "$base_sha"; then
    echo "release/650 already contains master; no PR is needed."
    exit 0
fi

existing_pr=$(gh pr list --repo "$GH_REPO" --base release/650 --head "$branch" \
    --state all --json url --jq '.[0].url // empty')
if [[ -n "$existing_pr" ]]; then
    echo "A PR already exists for this master revision: ${existing_pr}"
    exit 0
fi

# Read the template before switching to release/650, which can have an older copy.
body_file=$(mktemp)
trap 'rm -f "$body_file"' EXIT
cat .github/PULL_REQUEST_TEMPLATE.md > "$body_file"

git switch --create "$branch" "$base_sha"
if ! git -c core.hooksPath=/dev/null merge --no-ff -X ours "$source_sha" \
    -m "Merge master into release/650 after release" \
    -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"; then
    echo "::error::Merge needs manual resolution. No branch or PR has been pushed."
    git diff --name-only --diff-filter=U
    git merge --abort
    exit 1
fi

git diff --check "$base_sha" HEAD

python3 - "$body_file" "$source_sha" "$base_sha" "${RELEASE_TAG:-manual run}" <<'PY'
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
body = path.read_text()
replacements = {
    "<!--- Describe your changes in detail -->":
        f"Merge master `{sys.argv[2]}` into release/650 `{sys.argv[3]}` "
        f"following `{sys.argv[4]}`. The source is the master tip captured at run time, "
        "including any commits after the release tag.",
    "<!--- Please link to the issue here: -->":
        "Automated release synchronization; no separate issue supplied.",
    "<!--- Why is this change required? What problem does it solve? -->":
        "Bring non-conflicting master changes to release/650. The merge starts on "
        "release/650 and uses `git merge --no-ff -X ours`, so release/650 wins "
        "conflicting hunks. Unresolved conflict types stop the workflow without pushing. "
        "This PR is not automatically merged.",
    "<!--- Please describe in detail how you tested your changes. -->":
        "`git diff --check \"$base_sha\" HEAD`: passed before pushing. "
        "Application tests were not run by this synchronization workflow; "
        "CI and maintainer review are required.",
}
for placeholder, text in replacements.items():
    if placeholder not in body:
        raise SystemExit(f"PR template placeholder missing: {placeholder}")
    body = body.replace(placeholder, placeholder + "\n\n" + text)
path.write_text(body)
PY

# Recover a pushed branch if a previous run failed while creating its PR.
if git ls-remote --exit-code origin "refs/heads/${branch}"; then
    git fetch --no-tags origin "refs/heads/${branch}:refs/remotes/origin/${branch}"
    remote_sha=$(git rev-parse "refs/remotes/origin/${branch}")
    if ! git merge-base --is-ancestor "$source_sha" "$remote_sha" ||
       ! git merge-base --is-ancestor "$base_sha" "$remote_sha" ||
       ! git diff --quiet "$remote_sha" HEAD; then
        echo "::error::Existing sync branch differs from this merge; refusing to overwrite it."
        exit 1
    fi
else
    remote_status=$?
    if [[ "$remote_status" -ne 2 ]]; then
        echo "::error::Unable to check for an existing sync branch."
        exit "$remote_status"
    fi
    git push origin "HEAD:refs/heads/${branch}"
fi

gh pr create --repo "$GH_REPO" --base release/650 --head "$branch" \
    --title "Sync master to release/650 (${source_sha:0:12})" --body-file "$body_file"
