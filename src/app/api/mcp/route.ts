import {
  getFunctionBySlug,
  getAllFunctions,
  getFunctionsByCategory,
  buildSearchIndex,
  getConceptBySlug,
  getAllConcepts,
  getPatternBySlug,
  getAllPatterns,
} from "@/lib/mdx";
import { categories } from "@/data/categories";
import { sampleTables } from "@/data/sample-tables";
import Fuse from "fuse.js";
import { createSearchIndex } from "@/lib/search";
import { PQTableData } from "@/lib/types";
import { formatMCode, validateMCode } from "@/lib/formatter";

// ---------------------------------------------------------------------------
// MCP Tool definitions
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "get_function",
    description:
      "Get complete documentation for a Power Query M function, including syntax, parameters, remarks, and examples. Accepts a function name like 'Table.AddColumn' or a slug like 'table-addcolumn'.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Function name (e.g. 'Table.AddColumn') or slug (e.g. 'table-addcolumn')",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "search_functions",
    description:
      "Fuzzy-search Power Query M functions by name, description, or common synonyms (including Excel, SQL, and DAX equivalents). For example, 'vlookup' finds join functions, 'concatenate' finds Text.Combine, 'missing value' finds null-handling functions. If no results are found, try search_concepts or search_patterns for broader topic coverage.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query — accepts M function names, plain English descriptions, or Excel/SQL/DAX equivalents (e.g. 'vlookup', 'concatenate', 'group by', 'null coalesce')" },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default 10)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "list_categories",
    description:
      "List all Power Query M function categories with their descriptions and function counts.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_concept",
    description:
      "Get a Power Query M concept guide by slug. Returns the full guide content including code examples.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description:
            "Concept slug (e.g. 'query-folding', 'lazy-evaluation', 'type-system')",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "list_concepts",
    description: "List all available Power Query M concept guides.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_pattern",
    description:
      "Get a practical Power Query M pattern or recipe by slug. Returns the full guide with code examples.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description:
            "Pattern slug (e.g. 'dynamic-column-selection', 'pagination-web-contents')",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "list_patterns",
    description:
      "List all available Power Query M patterns and recipes, grouped by difficulty.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "search_concepts",
    description:
      "Fuzzy-search Power Query M concept guides by keyword. Returns matching concepts with their slugs and descriptions. Use this when you know what topic you're looking for but not the exact slug.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query (e.g. 'lazy evaluation', 'null', 'folding')" },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default 5)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "search_patterns",
    description:
      "Fuzzy-search Power Query M patterns and recipes by keyword. Returns matching patterns with their slugs, difficulty, and descriptions.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query (e.g. 'pagination', 'running total', 'lookup')" },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default 5)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_sample_table",
    description:
      "Get sample data used in Power Query M examples on pqm.guide. Available tables: Sales, Customers, Products, Employees, OrderLog.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Table name (case-sensitive): Sales, Customers, Products, Employees, OrderLog",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "format_m_code",
    description:
      "Format Power Query M code using Microsoft's official formatter. Accepts a full `let … in …` document or a bare expression and returns canonical, consistently-indented M. Useful for cleaning up pasted code or normalizing AI-generated M before using it.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Power Query M source to format.",
        },
      },
      required: ["code"],
    },
  },
  {
    name: "validate_m_code",
    description:
      "Validate Power Query M code by parsing it. Returns `Valid M code.` on success, or a human-readable summary of the first syntax error (with line and column) on failure. Pair with format_m_code when you need both formatted output and explicit pass/fail status.",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Power Query M source to validate.",
        },
      },
      required: ["code"],
    },
  },
  {
    name: "list_functions_by_category",
    description:
      "List all Power Query M functions in a specific category. Use list_categories first to get valid category slugs.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description:
            "Category slug (e.g. 'list', 'table', 'text', 'date'). Use list_categories to see all valid slugs.",
        },
      },
      required: ["category"],
    },
  },
];

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\./g, "-").replace(/\s+/g, "-");
}

function formatTableData(data: PQTableData): string {
  const header = data.columns.map((c) => `${c.name} (${c.type})`).join(" | ");
  const divider = data.columns.map(() => "---").join(" | ");
  const rows = data.rows.map((row) =>
    data.columns.map((c) => String(row[c.name] ?? "")).join(" | ")
  );
  return [header, divider, ...rows].join("\n");
}

async function callTool(
  name: string,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const text = await (async () => {
    switch (name) {
      case "get_function": {
        const slug = nameToSlug(String(args.name ?? ""));
        try {
          const { frontmatter, content } = getFunctionBySlug(slug);
          const remarksMatch = content.match(
            /## Remarks\n([\s\S]*?)(?=## Examples|## Related|$)/
          );
          const remarks = remarksMatch ? remarksMatch[1].trim() : null;
          const exampleMatches = [
            ...content.matchAll(
              /### Example \d+:\s*(.+?)\n([\s\S]*?)(?=### Example \d+:|## |$)/g
            ),
          ].map((m) => {
            const codeMatch = m[2].match(/```powerquery\n([\s\S]*?)```/);
            return `**${m[1].trim()}**\n\`\`\`powerquery\n${codeMatch?.[1]?.trim() ?? ""}\n\`\`\``;
          });

          const params = frontmatter.parameters
            .map(
              (p) =>
                `- **${p.name}** (${p.type}${p.required ? "" : ", optional"}): ${p.description}`
            )
            .join("\n");

          return [
            `# ${frontmatter.title}`,
            `**Category:** ${frontmatter.category}`,
            `**Description:** ${frontmatter.description}`,
            "",
            `## Syntax\n\`\`\`\n${frontmatter.syntax}\n\`\`\``,
            "",
            `**Returns:** ${frontmatter.returnType} — ${frontmatter.returnDescription}`,
            "",
            params ? `## Parameters\n${params}` : null,
            remarks ? `## Remarks\n${remarks}` : null,
            exampleMatches.length
              ? `## Examples\n${exampleMatches.join("\n\n")}`
              : null,
            frontmatter.relatedFunctions?.length
              ? `## Related Functions\n${frontmatter.relatedFunctions.join(", ")}`
              : null,
          ]
            .filter(Boolean)
            .join("\n\n");
        } catch {
          return `Function not found: "${args.name}". Use search_functions to find the correct name.`;
        }
      }

      case "search_functions": {
        const query = String(args.query ?? "");
        const limit = Math.min(Number(args.limit ?? 10), 20);
        const index = createSearchIndex(buildSearchIndex().map((f) => ({ ...f, type: "function" as const })));
        const results = index.search(query, { limit });
        if (results.length === 0) return `No functions found matching "${query}". Try rephrasing with M function name fragments (e.g. "Table", "List", "Text"), or use search_concepts or search_patterns to find topic guides instead.`;
        return results
          .map(
            (r) =>
              `- **${r.item.title}** (${r.item.category}): ${r.item.description}\n  → /functions/${r.item.slug}`
          )
          .join("\n");
      }

      case "list_categories": {
        const allFunctions = getAllFunctions();
        const counts = new Map<string, number>();
        allFunctions.forEach((f) => {
          const slug = f.category.toLowerCase().replace(/\s+/g, "-");
          counts.set(slug, (counts.get(slug) ?? 0) + 1);
        });
        return categories
          .map(
            (c) =>
              `- **${c.name}** (${counts.get(c.slug) ?? 0} functions): ${c.description}\n  → /categories/${c.slug}`
          )
          .join("\n");
      }

      case "get_concept": {
        const slug = String(args.slug ?? "");
        try {
          const { frontmatter, content } = getConceptBySlug(slug);
          return [
            `# ${frontmatter.title}`,
            frontmatter.description,
            "",
            content,
            frontmatter.relatedConcepts?.length
              ? `\n**Related concepts:** ${frontmatter.relatedConcepts.join(", ")}`
              : null,
            frontmatter.relatedFunctions?.length
              ? `**Related functions:** ${frontmatter.relatedFunctions.join(", ")}`
              : null,
          ]
            .filter(Boolean)
            .join("\n");
        } catch {
          const available = getAllConcepts()
            .map((c) => c.slug)
            .join(", ");
          return `Concept not found: "${slug}". Available: ${available}`;
        }
      }

      case "list_concepts": {
        return getAllConcepts()
          .map(
            (c) =>
              `- **${c.title}** (\`${c.slug}\`): ${c.description}\n  → /concepts/${c.slug}`
          )
          .join("\n");
      }

      case "get_pattern": {
        const slug = String(args.slug ?? "");
        try {
          const { frontmatter, content } = getPatternBySlug(slug);
          return [
            `# ${frontmatter.title}`,
            `**Difficulty:** ${frontmatter.difficulty}`,
            frontmatter.description,
            "",
            content,
            frontmatter.relatedFunctions?.length
              ? `\n**Related functions:** ${frontmatter.relatedFunctions.join(", ")}`
              : null,
            frontmatter.relatedConcepts?.length
              ? `**Related concepts:** ${frontmatter.relatedConcepts.join(", ")}`
              : null,
          ]
            .filter(Boolean)
            .join("\n");
        } catch {
          const available = getAllPatterns()
            .map((p) => p.slug)
            .join(", ");
          return `Pattern not found: "${slug}". Available: ${available}`;
        }
      }

      case "list_patterns": {
        return getAllPatterns()
          .map(
            (p) =>
              `- **${p.title}** (${p.difficulty}, \`${p.slug}\`): ${p.description}\n  → /patterns/${p.slug}`
          )
          .join("\n");
      }

      case "search_concepts": {
        const query = String(args.query ?? "");
        const limit = Math.min(Number(args.limit ?? 5), 10);
        const concepts = getAllConcepts();
        const index = new Fuse(concepts, {
          keys: [
            { name: "title", weight: 2 },
            { name: "description", weight: 1 },
          ],
          threshold: 0.4,
          includeScore: true,
        });
        const results = index.search(query, { limit });
        if (results.length === 0) return `No concepts found matching "${query}". Use list_concepts to see all available concepts.`;
        return results
          .map((r) => `- **${r.item.title}** (\`${r.item.slug}\`): ${r.item.description}\n  → /concepts/${r.item.slug}`)
          .join("\n");
      }

      case "search_patterns": {
        const query = String(args.query ?? "");
        const limit = Math.min(Number(args.limit ?? 5), 10);
        const patterns = getAllPatterns();
        const index = new Fuse(patterns, {
          keys: [
            { name: "title", weight: 2 },
            { name: "description", weight: 1 },
            { name: "difficulty", weight: 0.3 },
          ],
          threshold: 0.4,
          includeScore: true,
        });
        const results = index.search(query, { limit });
        if (results.length === 0) return `No patterns found matching "${query}". Use list_patterns to see all available patterns.`;
        return results
          .map((r) => `- **${r.item.title}** (${r.item.difficulty}, \`${r.item.slug}\`): ${r.item.description}\n  → /patterns/${r.item.slug}`)
          .join("\n");
      }

      case "get_sample_table": {
        const tableName = String(args.name ?? "");
        const table = sampleTables[tableName];
        if (!table) {
          const available = Object.keys(sampleTables).join(", ");
          return `Table not found: "${tableName}". Available: ${available}`;
        }
        return [
          `# ${table.displayName}`,
          table.description,
          "",
          formatTableData(table.data),
        ].join("\n");
      }

      case "format_m_code": {
        const code = String(args.code ?? "");
        const result = await formatMCode(code);
        if (result.ok) {
          return `\`\`\`powerquery\n${result.formatted}\n\`\`\``;
        }
        const loc =
          result.error.line !== undefined && result.error.column !== undefined
            ? ` (line ${result.error.line}, col ${result.error.column})`
            : "";
        return `Could not format M code${loc}: ${result.error.message}`;
      }

      case "validate_m_code": {
        const code = String(args.code ?? "");
        const result = await validateMCode(code);
        if (result.valid) return "Valid M code.";
        return [
          `Invalid M code — ${result.errors.length} error${result.errors.length === 1 ? "" : "s"}:`,
          ...result.errors.map(
            (e) => `  - Line ${e.line}, col ${e.column}: ${e.message}`
          ),
        ].join("\n");
      }

      case "list_functions_by_category": {
        const categorySlug = String(args.category ?? "").toLowerCase();
        const functions = getFunctionsByCategory(categorySlug);
        if (functions.length === 0) {
          return `No functions found in category "${args.category}". Use list_categories to see all valid category slugs.`;
        }
        return functions
          .map((f) => `- **${f.title}**: ${f.description}\n  → /functions/${f.slug}`)
          .join("\n");
      }

      default:
        throw { code: -32601, message: `Unknown tool: ${name}` };
    }
  })();

  return { content: [{ type: "text", text }] };
}

// ---------------------------------------------------------------------------
// MCP JSON-RPC 2.0 handler
// ---------------------------------------------------------------------------

const SERVER_INFO = { name: "pqm-guide", version: "1.0.0" };
const PROTOCOL_VERSION = "2024-11-05";

type JsonRpcRequest = {
  jsonrpc: "2.0";
  method: string;
  params?: Record<string, unknown>;
  id?: string | number | null;
};

async function handleRequest(msg: JsonRpcRequest) {
  // Notifications (no id) require no response
  if (msg.id === undefined) return null;

  try {
    let result: unknown;

    switch (msg.method) {
      case "initialize":
        result = {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
        };
        break;
      case "ping":
        result = {};
        break;
      case "tools/list":
        result = { tools: TOOLS };
        break;
      case "tools/call": {
        const { name, arguments: toolArgs = {} } = (msg.params ?? {}) as {
          name: string;
          arguments?: Record<string, unknown>;
        };
        result = await callTool(name, toolArgs);
        break;
      }
      default:
        return {
          jsonrpc: "2.0",
          error: { code: -32601, message: `Method not found: ${msg.method}` },
          id: msg.id,
        };
    }

    return { jsonrpc: "2.0", result, id: msg.id };
  } catch (err: unknown) {
    const e = err as { code?: number; message?: string };
    return {
      jsonrpc: "2.0",
      error: { code: e.code ?? -32603, message: e.message ?? "Internal error" },
      id: msg.id,
    };
  }
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { jsonrpc: "2.0", error: { code: -32700, message: "Parse error" }, id: null },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // Batch requests
  if (Array.isArray(body)) {
    const responses = await Promise.all(
      body.map((msg) => handleRequest(msg as JsonRpcRequest))
    );
    return Response.json(
      responses.filter(Boolean),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const response = await handleRequest(body as JsonRpcRequest);
  // Notification — no response body needed
  if (response === null) {
    return new Response(null, { status: 202, headers: CORS_HEADERS });
  }

  return Response.json(response, {
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
