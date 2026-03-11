Take all uncommitted changes and publish them to GitHub via a pull request. The user must review and approve the PR before you merge.

---

## Steps

### 1. Verify there is something to publish

Run `git status` and `git diff`. If there are no changes (clean working tree, nothing staged), stop and tell the user there is nothing to publish.

### 2. Stage and commit

Stage all modified and new files relevant to the changes. Do NOT stage:
- `.env` files or anything with credentials
- Large binaries unrelated to the feature

Write a clear commit message that describes *what changed and why* in 1–2 sentences. Use present tense ("Add getting-started page", "Fix null handling in filter step"). End the commit message with:

```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

### 3. Push to a feature branch

Create and push a new branch. Name it based on the change — short, lowercase, hyphenated (e.g. `add-getting-started`, `fix-ui-bridge-examples`). Do not push directly to `main`.

### 4. Create the pull request

Use `gh pr create` to open the PR. The PR body must include:

- **Summary** — 3–5 bullet points describing what changed
- **Why** — one sentence on the motivation or context
- **Pages/files affected** — list the files modified or created
- **Test plan** — what to check in the browser before merging

### 5. STOP — show the user the PR URL and ask for review

Output the PR URL clearly. Then say:

> "Review the PR above and let me know when you're ready to merge, or if anything needs to change."

**Do not merge yet.** Wait for the user to explicitly say to merge (e.g. "merge it", "looks good", "go ahead").

### 6. Merge after explicit approval

Once the user approves:

1. Merge the PR: `gh pr merge --squash --delete-branch`
2. Pull main locally: `git checkout main && git pull`
3. Confirm success with the merge commit SHA

---

## Rules

- Never merge without explicit user approval
- Never push directly to `main`
- If pre-push hooks fail (tsc, tests), fix the failures before pushing — do not use `--no-verify`
- If the branch already exists remotely, use a unique suffix (e.g. `-2`) rather than force-pushing
