---
name: branch-and-commit
description: >-
  Create a new git branch, commit scoped changes, run local lint/CI checks, and
  always write an untracked PR description from the repo PR template. Use when
  the user asks to create a branch, commit work, prepare a PR, run eslint/CI
  locally, or commit without Cursor attribution.
---

# Branch and Commit

Prepare a clean branch + commit from the current work. Do not push or open a PR unless the user asks.

## Hard rules

•⁠  ⁠*Only commit when the user explicitly asks.*
•⁠  ⁠*Never push* unless the user explicitly asks.
•⁠  ⁠*No Cursor sign* — commit message must not include ⁠ Co-authored-by: Cursor ⁠, ⁠ Made with Cursor ⁠, or similar attribution.
•⁠  ⁠*Never update git config* (⁠ user.name ⁠, ⁠ user.email ⁠, etc.).
•⁠  ⁠*No destructive git* — no ⁠ reset --hard ⁠, ⁠ clean -fdx ⁠, force-push, or history rewrite unless the user explicitly requests it.
•⁠  ⁠*No ⁠ --no-verify ⁠* unless the user explicitly requests it.
•⁠  ⁠*Stage only relevant files* — no ⁠ git add . ⁠ / ⁠ git add -A ⁠ unless the user asks to commit everything.
•⁠  ⁠*Never commit secrets* — warn if ⁠ .env ⁠, credentials, or keys are staged.
•⁠  ⁠*Always write ⁠ PR_DESCRIPTION.md ⁠* at the repo root after a successful commit (see step 6).
•⁠  ⁠*Never commit ⁠ PR_DESCRIPTION.md ⁠* — leave it untracked; do not ⁠ git add ⁠ it.

## Workflow

Copy this checklist and track progress:


- [ ] 1. Inspect changes
- [ ] 2. Create branch
- [ ] 3. Run local checks
- [ ] 4. Commit
- [ ] 5. Verify commit (no Cursor trailer)
- [ ] 6. Write PR_DESCRIPTION.md (always; never commit)


### 1. Inspect changes

Run in parallel:

⁠ bash
git status
git diff
git diff --staged
git log -5 --oneline
 ⁠

Summarize what will be committed. Exclude unrelated or generated files unless the user wants them.
