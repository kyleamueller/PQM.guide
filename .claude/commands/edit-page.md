Edit an existing page on pqm.guide. Accepts a URL, slug, or M function name.

---

## Steps

### 1. Resolve the input to a file

The user provides one of:
- A URL: `pqm.guide/functions/table-addcolumn` or `https://pqm.guide/concepts/query-folding`
- A slug: `table-addcolumn`, `query-folding`
- An M function name: `Table.AddColumn` or `Table.AddColumn()`

**Normalize the input:**
1. Strip any `https://`, `http://`, and `pqm.guide` prefix
2. Strip trailing `()` if present
3. If the input contains `.` and no `/`, treat it as an M function name — lowercase it and replace `.` with `-` to get the slug (e.g. `Table.AddColumn` → `table-addcolumn`)
4. Extract the content type and slug from the path:
   - `/functions/{slug}` → look in `src/content/functions/{slug}.mdx`
   - `/concepts/{slug}` → look in `src/content/concepts/{slug}.mdx`
   - `/patterns/{slug}` → look in `src/content/patterns/{slug}.mdx`
   - `/resources` → open `src/app/resources/page.tsx`
5. If no content type prefix is present (bare slug), search all three content directories for a matching `.mdx` file

If the file doesn't exist, tell the user and stop.

---

### 2. Show what's there

Read the file and give the user a brief summary:
- For MDX files: show the title, description, and list the main sections (Remarks, Examples, etc.)
- For the resources page: list the current resource entries

---

### 3. Ask what to change

Ask the user to describe the edit they want to make. Examples:
- "The syntax example has a typo"
- "Add a remark about query folding behavior"
- "Update the compatibility flags — this now works in Excel Online"
- "Add a new example showing how to use optional parameters"

---

### 4. Make the edit

Apply the change to the file. Keep the existing structure and style intact — don't reformat or reorganize content the user didn't ask to change.

---

### 5. Verify

Run both checks and fix any failures before proceeding:

```bash
npm run typecheck
npm test
```

---

### 6. Publish

Invoke `/publish` to stage, commit, open a PR, and wait for review.

---

## Rules

- Never delete or overwrite content the user didn't ask to change
- Never push directly to `main`
- Keep the same frontmatter schema — don't add or remove fields
- If the user's description is ambiguous, ask a clarifying question before editing
