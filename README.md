# PQM.guide

A community-driven Power Query M language reference, hosted at [pqm.guide](https://pqm.guide).

PQM.guide documents 661 Power Query M functions across 26 categories with clear syntax references, visual output examples, and practical best practices. It also includes concept guides, practical patterns, and an MCP server so AI assistants can query M documentation directly. Think of it as [DAX.guide](https://dax.guide) for the M language.

## What's on the Site

| Section | URL | Description |
|---|---|---|
| Functions | `/functions/[slug]` | 661 functions across 26 categories with syntax, parameters, examples, and best practices |
| Concepts | `/concepts/[slug]` | 22 concept guides covering M fundamentals (lazy evaluation, query folding, type system, etc.) |
| Patterns | `/patterns/[slug]` | 18 practical M recipes grouped by difficulty (beginner → advanced) |
| Start Here | `/learn` | A curated 8-step learning path for developers new to M |
| Sample Tables | `/sample-tables` | Reference data used in function examples (Sales, Customers, Products, Employees, OrderLog) |
| Resources | `/resources` | Curated tools, books, YouTube channels, blogs, and community links |
| MCP Server | `/mcp` | Connect AI assistants like Claude and Cursor to PQM.guide via the Model Context Protocol |

## API & LLM Access

PQM.guide exposes several machine-readable endpoints:

| Endpoint | Description |
|---|---|
| `GET /api/functions` | All 661 functions (metadata) |
| `GET /api/functions/[slug]` | Single function with full content, remarks, and parsed examples |
| `GET /api/concepts` | All concept guides |
| `GET /api/concepts/[slug]` | Single concept with full content |
| `GET /api/patterns` | All patterns |
| `GET /api/patterns/[slug]` | Single pattern with full content |
| `GET /api/search?q=` | Fuzzy search across all functions |
| `GET /api/tables/[id]` | Sample table data as JSON (Sales, Customers, Products, Employees, OrderLog) |
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

PQM.guide is open to contributions from the Power Query community. Most content is MDX (Markdown + YAML frontmatter) — no React, TypeScript, or Next.js knowledge required for typical edits.

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for full details: frontmatter schemas, example output format, slug rules, sample table usage, and PR guidelines.

**Quick ways to help:**

- Fix a typo or improve a function's remarks
- Improve a function's remarks or examples
- Write a new concept guide or pattern recipe
- [Open an issue](https://github.com/kyleamueller/PQM.guide/issues) or [start a discussion](https://github.com/kyleamueller/PQM.guide/discussions) if you'd rather suggest changes without code

### Claude Code commands

If you use [Claude Code](https://claude.com/claude-code), the repo includes slash commands that automate content scaffolding and publishing:

| Command | What it does |
|---|---|
| `/add-function` | Scaffold a new function page — prompts for the function name, researches the official spec, generates the MDX file with correct frontmatter, and runs tests |
| `/add-concept` | Scaffold a new concept guide |
| `/add-pattern` | Scaffold a new pattern recipe |
| `/publish` | Package uncommitted changes into a pull request |
| `/refresh-site` | Full content freshness review — scans Microsoft blogs, checks for new M functions, verifies compatibility flags, and updates stale content |

These commands live in `.claude/commands/` and are loaded automatically when you open the project in Claude Code.

## Running Locally

```bash
git clone https://github.com/kyleamueller/PQM.guide.git
cd PQM.guide
npm install
cp .env.example .env.local   # optional — enables Google Analytics locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to preview the site. `npm install` also sets up a pre-push hook that runs type checking and tests automatically. Google Analytics is optional — the site works fully without setting `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

Other useful commands:

```bash
npm run typecheck   # TypeScript type check
npm run test        # Vitest test suite (45 tests)
npm run build       # Full production build (1,447 pages)
```

## License

- **Code** (the Next.js app, components, API routes): [MIT](LICENSE)
- **Content** (function references, concept guides, patterns in `src/content/`): [CC BY 4.0](LICENSE-CONTENT)

If you republish or build on the documentation content, attribution to [pqm.guide](https://pqm.guide) is required.

## Tech Stack

- [Next.js 16](https://nextjs.org) with App Router
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- TypeScript, MDX, gray-matter, PrismJS, Fuse.js, next-themes
- [@fluentui/react-icons](https://github.com/microsoft/fluentui-system-icons) for sidebar category icons
- MCP: JSON-RPC 2.0 over Streamable HTTP (no external SDK)
- Deployed on [Vercel](https://vercel.com)
