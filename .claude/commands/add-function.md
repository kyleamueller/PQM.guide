Scaffold and publish a new Power Query M function page on pqm.guide.

---

## Steps

### 1. Gather inputs

Ask the user for:
- **Function name** (e.g. `Table.AddColumn`)
- **Category** (e.g. `Table`, `Text`, `List`, `Date`) — use `list_categories` MCP tool or read `src/data/categories.ts` if unsure
- **Brief description** — one sentence

If the user doesn't have all the details, search `learn.microsoft.com/en-us/powerquery-m/` for the official Microsoft reference to fill in the gaps (syntax, parameters, return type, remarks).

---

### 2. Check for duplicates

Derive the slug: lowercase the function name, replace `.` with `-` (e.g. `Table.AddColumn` → `table-addcolumn`).

Check if `src/content/functions/{slug}.mdx` already exists. If it does, stop and tell the user — do not overwrite it.

---

### 3. Scaffold the MDX file

Create `src/content/functions/{slug}.mdx` with the following structure:

```mdx
---
title: "Function.Name"
slug: "function-name"
category: "CategoryName"
description: "One sentence description ending with a period."
syntax: "Function.Name(param1 as type, optional param2 as type) as returnType"
returnType: "type"
returnDescription: "What the function returns."
parameters:
  - name: paramName
    type: type
    required: true
    description: "What this parameter does."
compatibility:
  pbiDesktop: true
  pbiService: true
  excelDesktop: true
  excelOnline: false
  dataflows: true
  fabricNotebooks: false
relatedFunctions: []
relatedConcepts: []
---

## Remarks

Explain any important usage notes, edge cases, or behavior differences across environments. If none, omit this section.

## Examples

### Example 1: Brief title describing what this example shows

Short description of the scenario.

```powerquery
// M code here
```

Input: `Sales`

<!--output JSON
{"columns":[{"name":"ColName","type":"text"}],"rows":[{"ColName":"value"}]}
-->
```

**Schema notes:**
- `category` must exactly match an existing category name from `src/data/categories.ts`
- `compatibility` booleans: set to `false` if the function is known to be unavailable; use `true` as the safe default when unknown
- `parameters`: include all required params first, then optional ones
- Examples using a sample table (`Sales`, `Customers`, `Products`, `Employees`, `OrderLog`): include the `Input: \`TableName\`` line and the `<!--output JSON ... -->` comment with actual column/row data
- Examples that don't use a sample table: omit the Input and output JSON lines
- `relatedFunctions` / `relatedConcepts`: use slugs (e.g. `"table-selectcolumns"`, `"query-folding"`)

Include at least 1 example. 2–3 is better for functions with multiple common use cases.

---

### 4. Verify

Run both checks and fix any failures before proceeding:

```bash
npm run typecheck
npm test
```

---

### 5. Publish

Invoke `/publish` to stage, commit, open a PR, and wait for review.

---

## Rules

- Never overwrite an existing MDX file — check first
- Never push directly to `main`
- The `category` field must match a real category in `src/data/categories.ts` — check if unsure
- Output JSON in the `<!--output JSON ... -->` comment must be valid JSON
- Do not invent parameter types — use official Microsoft docs or ask the user
