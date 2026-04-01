Scaffold and publish a new Power Query M concept guide on pqm.guide.

---

## Steps

### 1. Gather inputs

Ask the user for:
- **Title** (e.g. `Query Folding`, `Null Handling`)
- **Slug** (kebab-case, e.g. `query-folding`, `null-handling`)
- **One-sentence description** — shown in search results and the concepts index
- **Related functions** (optional) — slugs of M functions that are closely tied to this concept
- **Related concepts** (optional) — slugs of other concepts to cross-link

---

### 2. Check for duplicates

Check if `src/content/concepts/{slug}.mdx` already exists. If it does, stop and tell the user. Also scan existing concept slugs to surface any close matches:

```bash
ls src/content/concepts/
```

If a close match exists, show the user the existing page slug and ask whether they still want to create a new page.

---

### 3. Scaffold the MDX file

Create `src/content/concepts/{slug}.mdx`:

```mdx
---
title: "Concept Title"
slug: "concept-slug"
description: "One sentence description ending with a period."
relatedConcepts: []
relatedFunctions: []
---

Opening paragraph that explains what the concept is and why it matters in Power Query M.

## Section heading

Body text. Use `## ` headings to divide the concept into logical sections.

```powerquery
// Code example illustrating the concept
let
    Source = ...
in
    Source
```

Explanation of what the code does and what to notice.

## Edge cases / Notes

Any gotchas, environment-specific behavior, or common mistakes.
```

**Writing guidelines:**
- Lead with a plain-English explanation before any code
- Include at least 1 `powerquery` code block
- Keep each section focused — prefer multiple short sections over one long one
- Use `relatedFunctions` and `relatedConcepts` to point to the most useful cross-links (slugs only)

---

### 4. Verify

```bash
npm run typecheck
npm test
```

Fix any failures before continuing.

---

### 5. Publish

Invoke `/publish` to stage, commit, open a PR, and wait for review.

---

## Rules

- Never overwrite an existing concept file — check first
- Never push directly to `main`
- Slugs must be unique across `src/content/concepts/`
- `relatedFunctions` and `relatedConcepts` values must be valid existing slugs — verify against the file system if unsure
