# PQM.guide

A community-driven Power Query M language reference, hosted at [pqm.guide](https://pqm.guide).

PQM.guide documents 161 Power Query M functions across 27 categories with clear syntax references, visual output examples, and practical best practices. It also includes concept guides, practical patterns, and an MCP server so AI assistants can query M documentation directly. Think of it as [DAX.guide](https://dax.guide) for the M language.

## What's on the Site

| Section | URL | Description |
|---|---|---|
| Functions | `/functions/[slug]` | 161 functions across 27 categories with syntax, parameters, examples, and best practices |
| Concepts | `/concepts/[slug]` | 16 concept guides covering M fundamentals (lazy evaluation, query folding, type system, etc.) |
| Patterns | `/patterns/[slug]` | Practical M recipes grouped by difficulty (beginner → advanced) |
| Start Here | `/learn` | A curated 8-step learning path for developers new to M |
| Sample Tables | `/sample-tables` | Reference data used in function examples (Sales, Customers, Products, Employees, OrderLog) |
| Resources | `/resources` | Curated tools, books, YouTube channels, blogs, and community links |
| MCP Server | `/mcp` | Connect AI assistants like Claude and Cursor to PQM.guide via the Model Context Protocol |

## API & LLM Access

PQM.guide exposes several machine-readable endpoints:

| Endpoint | Description |
|---|---|
| `GET /api/functions` | All 161 functions (metadata) |
| `GET /api/functions/[slug]` | Single function with full content |
| `GET /api/concepts` | All concept guides |
| `GET /api/concepts/[slug]` | Single concept with full content |
| `GET /api/patterns` | All patterns |
| `GET /api/search?q=` | Fuzzy search across all functions |
| `GET /llms.txt` | Plain-text index (llmstxt.org format) for LLM crawlers |
| `POST /api/mcp` | MCP JSON-RPC 2.0 endpoint (Streamable HTTP transport) |

### MCP Server

Connect Claude Desktop by adding this to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pqm-guide": {
      "command": "npx",
      "args": ["mcp-remote", "https://pqm.guide/api/mcp"]
    }
  }
}
```

Any client supporting Streamable HTTP can also connect directly to `https://pqm.guide/api/mcp`.

## Contributing

PQM.guide is open to contributions from the Power Query community. All content lives in MDX files — no special build knowledge required for most edits.

### Quick edits (typos, wording, examples)

1. Fork this repository
2. Find the file you want to edit:
   - Functions: `src/content/functions/[slug].mdx`
   - Concepts: `src/content/concepts/[slug].mdx`
   - Patterns: `src/content/patterns/[slug].mdx`
3. Make your changes and submit a pull request

### Adding a new function page

Function pages are MDX files in `src/content/functions/` with YAML frontmatter. Use any existing file as a template.

**File naming:** `category-functionname.mdx` in lowercase (e.g., `text-contains.mdx`)

**Rules:**
- Examples must use the shared sample tables (Sales, Customers, Products, Employees, OrderLog) — never `Table.FromRecords` for sample data
- Wrap expected output in `<!--output ... -->` HTML comments as JSON with `columns` and `rows`
- See the [Sample Tables](https://pqm.guide/sample-tables) page for available data

### Adding a new concept guide

Concept guides live in `src/content/concepts/`. Use any existing concept as a template.

**Frontmatter:**
```yaml
---
title: "Your Concept Title"
slug: "your-concept-slug"
description: "One sentence description shown in listings and meta tags."
relatedConcepts:
  - "other-concept-slug"
relatedFunctions:
  - "function-slug"
---
```

Body is standard Markdown with fenced code blocks using the `powerquery` language identifier.

### Adding a new pattern

Patterns live in `src/content/patterns/`. Use any existing pattern as a template.

**Frontmatter:**
```yaml
---
title: "Pattern Title"
slug: "pattern-slug"
description: "One sentence description."
difficulty: "beginner"   # beginner | intermediate | advanced
relatedFunctions:
  - "function-slug"
relatedConcepts:
  - "concept-slug"
---
```

Patterns should follow a problem → solution → explanation structure with working code examples.

### Suggesting changes without code

- [Open an issue](https://github.com/kyleamueller/PQM.guide/issues) to report errors or suggest improvements
- [Start a discussion](https://github.com/kyleamueller/PQM.guide/discussions) to propose new content or features

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to preview the site. New MDX content is picked up automatically — restart the dev server if a brand-new content directory isn't appearing.

## Tech Stack

- [Next.js 16](https://nextjs.org) with App Router
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- TypeScript, MDX, gray-matter, PrismJS, Fuse.js, next-themes
- [@fluentui/react-icons](https://github.com/microsoft/fluentui-system-icons) for sidebar category icons
- MCP: JSON-RPC 2.0 over Streamable HTTP (no external SDK)
- Deployed on [Vercel](https://vercel.com)
