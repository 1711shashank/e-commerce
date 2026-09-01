---
name: branch-and-commit
description: >-
  Create a new git branch, commit scoped changes, and run local lint/CI checks.
  Use when the user asks to create a branch, commit work, prepare a PR, run
  eslint/CI locally, or commit without Cursor attribution.
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

## Workflow

Copy this checklist and track progress:


- [ ] 1. Inspect changes
- [ ] 2. Create branch
- [ ] 3. Run local checks
- [ ] 4. Commit
- [ ] 5. Verify commit (no Cursor trailer)


### 1. Inspect changes

Run in parallel:

⁠ bash
git status
git diff
git diff --staged
git log -5 --oneline
 ⁠