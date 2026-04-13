# PQM.guide — Claude Instructions

## Workflow rules

- **NEVER work directly on `main`.** All changes — no matter how small — must be made on a feature branch and submitted via a pull request.
- Branch naming: `feature/<short-description>` or `fix/<short-description>`
- After pushing a feature branch, always create a PR using `gh pr create`
- Only merge PRs when explicitly asked to by the repo owner (`gh pr merge <number> --merge --delete-branch --admin`)

## Session startup

- Check `.claude/BACKLOG.md` first — it is the canonical prioritized backlog
- Status legend: `[ ]` = todo · `[~]` = in progress · `[x]` = done

## Project overview

- **Stack**: Next.js 16 App Router, React 19, TypeScript, MDX content, Fuse.js search
- **Content**: MDX files in `src/content/` (functions, concepts, patterns)
- **Tests**: Vitest, 42 tests across 4 files (`npm test`)
- **Typecheck**: `npm run typecheck`
- Pre-push hook runs both — fix failures before pushing
- **Licensing**: MIT for code (`LICENSE`), CC BY 4.0 for content (`LICENSE-CONTENT`)

## Windows gotcha

MDX files on Windows have CRLF line endings. All file readers in `src/lib/mdx.ts` normalize with `.replace(/\r\n/g, "\n")` — do not remove this.

## Recently Edited section

The home page "Recently Edited" section is driven by `src/data/recently-edited.json`.
When editing content files, update this JSON:
1. Add a new entry at the top with the slug, type, today's date, and a short change description.
2. Keep the array at 6 entries max — remove the oldest if needed.
3. A content-integrity test enforces that the most recent entry is within the last 45 days.
