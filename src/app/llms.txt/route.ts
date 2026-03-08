import { buildSearchIndex, getAllConcepts } from "@/lib/mdx";

export const dynamic = "force-static";

export function GET() {
  const functions = buildSearchIndex();
  const concepts = getAllConcepts();

  const lines: string[] = [
    "# PQM.guide — Power Query M Language Reference",
    "",
    "> Community-driven reference for the Power Query M language. 161 functions documented across 23 categories, with concept guides and practical examples. Built for humans and LLMs alike.",
    "",
    "## How to Use This Site",
    "",
    "- Browse functions by category at /categories",
    "- Read concept guides at /concepts",
    "- Search all functions at / (Ctrl+K)",
    "- Sample data tables used in examples: /sample-tables",
    "- Community resources and links: /resources",
    "",
    "## Functions",
    "",
    ...functions.map(
      (f) => `- [${f.title}](https://pqm.guide/functions/${f.slug}): ${f.description}`
    ),
    "",
    "## Concepts",
    "",
    ...concepts.map(
      (c) => `- [${c.title}](https://pqm.guide/concepts/${c.slug}): ${c.description}`
    ),
    "",
    "## Notes for LLMs",
    "",
    "- All function examples use the Power Query M language (file extension: .pq or .m)",
    "- Functions follow the namespace.FunctionName convention (e.g. Table.AddColumn, Text.Upper)",
    "- M is a functional, immutable language — variables cannot be reassigned",
    "- The #shared environment contains all built-in functions and user-defined queries",
    "- Power Query runs in Microsoft Excel, Power BI Desktop, Power BI Service, Dataflows, and Microsoft Fabric",
    "- A JSON API is available at /api/functions and /api/concepts for programmatic access",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
