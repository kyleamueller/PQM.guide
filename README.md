# PQM.guide

A community-driven Power Query M function reference, hosted at [pqm.guide](https://pqm.guide).

PQM.guide documents 161 Power Query M functions across 27 categories with clear syntax references, visual output examples, and practical best practices. Think of it as [DAX.guide](https://dax.guide) for the M language.

## Contributing

PQM.guide is open to contributions from the Power Query community. Whether you want to fix a typo, improve an example, or add a new function page, here's how:

### Quick edits

1. Fork this repository
2. Find the function file you want to edit in `src/content/functions/` (e.g., `table-addcolumn.mdx`)
3. Make your changes and submit a pull request

### Adding a new function page

Function pages are MDX files in `src/content/functions/` with YAML frontmatter. Use any existing file as a template. Key rules:

- **File naming**: `category-functionname.mdx` in lowercase (e.g., `text-contains.mdx`)
- **Examples must use shared sample tables** (Sales, Customers, Products, Employees, OrderLog) — never `Table.FromRecords` for sample data
- **Output format**: Wrap expected output in `<!--output ... -->` HTML comments as JSON with `columns` and `rows`
- See the [Sample Tables](https://pqm.guide/sample-tables) page for available data

### Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to preview the site.

### Suggesting changes without code

If you're not comfortable with pull requests, you can:

- [Open an issue](https://github.com/kyleamueller/PQM.guide/issues) to report errors or suggest improvements
- [Start a discussion](https://github.com/kyleamueller/PQM.guide/discussions) to propose new content or features

## Tech Stack

- [Next.js 16](https://nextjs.org) with App Router
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- TypeScript, MDX, PrismJS
