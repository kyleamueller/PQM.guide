Scaffold and publish a new Power Query M pattern (recipe) on pqm.guide.

---

## Steps

### 1. Gather inputs

Ask the user for:
- **Title** (e.g. `Running Totals`, `Dynamic Column Rename`)
- **Slug** (kebab-case, e.g. `running-totals`, `dynamic-column-rename`)
- **Difficulty**: `beginner`, `intermediate`, or `advanced`
  - `beginner` — uses basic M features, suitable for new Power Query users
  - `intermediate` — uses functions like `List.Accumulate`, `Table.Group`, custom functions
  - `advanced` — recursive logic, metadata, complex type transformations
- **One-sentence description** — shown on the patterns index and in search results
- **Related functions** (optional) — slugs of key M functions used in the pattern
- **Related concepts** (optional) — slugs of concepts that explain the theory behind the pattern

---

### 2. Check for duplicates

Check if `src/content/patterns/{slug}.mdx` already exists. If it does, stop and tell the user. Also list existing pattern slugs to surface close matches:

```bash
ls src/content/patterns/
```

---

### 3. Scaffold the MDX file

Create `src/content/patterns/{slug}.mdx` using this canonical structure:

```mdx
---
title: "Pattern Title"
slug: "pattern-slug"
description: "One sentence description ending with a period."
difficulty: beginner
relatedFunctions: []
relatedConcepts: []
---

## Problem

Describe the real-world situation or task this pattern addresses. One or two sentences. Be specific — "You have a table where..." rather than "Sometimes you need to...".

## Solution

```powerquery
// Complete, runnable M code
let
    Source = ...,
    Result = ...
in
    Result
```

## How it works

Walk through the solution step by step. Explain each meaningful transformation. If the solution uses a sample table, reference it:

Input: `Sales`

<!--output JSON
{"columns":[{"name":"ColName","type":"text"}],"rows":[{"ColName":"value"}]}
-->

## Variations (optional)

If there are common variations of this pattern (e.g. different ways to handle the same problem), describe them here with short code snippets.
```

**Writing guidelines:**
- The `## Problem` section sets the stage — make it concrete
- The `## Solution` code must be complete and runnable (no ellipses unless intentional)
- `## How it works` should explain *why* the code works, not just describe it line by line
- If using a sample table (`Sales`, `Customers`, `Products`, `Employees`, `OrderLog`) for the example, include the `Input:` line and `<!--output JSON ... -->` comment with real data
- Keep `## Variations` optional — only include if there are genuinely common alternative approaches

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

- Never overwrite an existing pattern file — check first
- Never push directly to `main`
- Difficulty must be exactly `beginner`, `intermediate`, or `advanced` — no other values
- Slugs must be unique across `src/content/patterns/`
- `relatedFunctions` and `relatedConcepts` values must be valid existing slugs — verify against the file system if unsure
- The solution code must be syntactically valid M — do not include pseudocode without clearly labeling it as such
