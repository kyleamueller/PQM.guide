# Contributing to PQM.guide

PQM.guide is a community-driven Power Query M reference. Contributions are welcome — whether you're fixing a typo, improving an example, adding a missing function, or writing a new concept guide.

## Ways to Contribute

- **Fix an error** — incorrect syntax, wrong parameter description, broken example
- **Improve remarks** — add a gotcha, a PQLint rule, or a behavioral note that's missing
- **Add a missing function** — if a function exists in the [official M spec](https://learn.microsoft.com/en-us/powerquery-m/power-query-m-function-reference) but not here, add it
- **Write a concept guide** — add to `src/content/concepts/`
- **Write a pattern** — add a practical recipe to `src/content/patterns/`
- **Report an issue** — use GitHub Issues if you find something wrong

## Development Setup

```bash
git clone https://github.com/kyleamueller/PQM.guide.git
cd PQM.guide
npm install
cp .env.example .env.local   # optional — enables Google Analytics locally
npm run dev
```

The site runs at `http://localhost:3000`. Google Analytics is optional — the site works fully without it.

## File Structure

| Path | What lives here |
|---|---|
| `src/content/functions/` | One MDX file per function |
| `src/content/concepts/` | Concept guides (lazy evaluation, query folding, etc.) |
| `src/content/patterns/` | Practical recipes (pagination, running totals, etc.) |
| `src/data/sample-tables.ts` | Shared sample data used in examples |
| `src/app/` | Next.js pages and API routes |

## Function Page Format

Every function page is an MDX file at `src/content/functions/{slug}.mdx`. Required frontmatter:

```yaml
---
title: "Namespace.FunctionName"
slug: "namespace-functionname"
category: "CategoryName"
description: "One-sentence description."
syntax: "Namespace.FunctionName(param1 as type, optional param2 as type) as returnType"
returnType: "type"
returnDescription: "What the function returns."
parameters:
  - name: "param1"
    type: "type"
    required: true
    description: "What this parameter does."
compatibility:
  pbiDesktop: true
  pbiService: true
  excelDesktop: true
  excelOnline: true
  dataflows: true
  fabricNotebooks: true
relatedFunctions:
  - "other-function-slug"
---

## Remarks

Two to four paragraphs explaining behavior, gotchas, and best practices.

## Examples

### Example 1: Descriptive title

Description of what this example demonstrates.

Input: `Sales`

```powerquery
// M code here
```

<!--output
{"columns":[...],"rows":[...]}
-->
```

### Example Output Format

The `<!--output ... -->` comment is parsed and rendered as a visual table. Use this JSON shape:

```json
{
  "columns": [{ "name": "ColumnName", "type": "text|number|date|logical|any" }],
  "rows": [{ "ColumnName": "value" }]
}
```

### Sample Tables

Reference the shared sample tables by name. Available tables: **Sales**, **Customers**, **Products**, **Employees**, **OrderLog**. See `/sample-tables` for schemas and data.

### Slugs

- Function slugs: `namespace-functionname` (e.g. `table-addcolumn`, `list-accumulate`)
- Literal constructor slugs: `sharpdate`, `sharptable`, etc.
- All slugs must exist in the [official M spec](https://learn.microsoft.com/en-us/powerquery-m/power-query-m-function-reference) — a test will fail otherwise

## Running Tests

```bash
npm run typecheck   # TypeScript type check
npm run test        # Vitest test suite
```

Tests check: MDX frontmatter completeness, slug validity against the official spec, and unit tests for parsers and search.

## Pull Request Guidelines

- Keep PRs focused — one function or one concept per PR is easier to review than 50 at once
- Run `npm run test` before pushing — a pre-push hook does this automatically after `npm install`
- Follow the existing format — match indentation and section structure of existing pages
- Use the sample tables for examples where possible — it keeps examples consistent across the site
