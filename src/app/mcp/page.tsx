import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Server",
  description:
    "Connect AI assistants like Claude and Cursor to PQM.guide using the Model Context Protocol.",
  openGraph: {
    title: "MCP Server | PQM.guide",
    description:
      "Connect AI assistants like Claude and Cursor to PQM.guide using the Model Context Protocol.",
    url: "/mcp",
    type: "website",
  },
};

const TOOLS = [
  {
    name: "get_function",
    args: `{ "name": "Table.AddColumn" }`,
    description: "Full documentation for a function — syntax, parameters, remarks, and examples.",
  },
  {
    name: "search_functions",
    args: `{ "query": "merge tables", "limit": 5 }`,
    description: "Fuzzy-search all functions by keyword.",
  },
  {
    name: "list_categories",
    args: `{}`,
    description: "All 24 function categories with descriptions and counts.",
  },
  {
    name: "get_concept",
    args: `{ "slug": "query-folding" }`,
    description: "Full content of a concept guide.",
  },
  {
    name: "list_concepts",
    args: `{}`,
    description: "All concept guides with slugs and descriptions.",
  },
  {
    name: "search_concepts",
    args: `{ "query": "null handling" }`,
    description: "Fuzzy-search concept guides by keyword.",
  },
  {
    name: "get_pattern",
    args: `{ "slug": "dynamic-column-selection" }`,
    description: "Full content of a practical M pattern/recipe.",
  },
  {
    name: "list_patterns",
    args: `{}`,
    description: "All patterns grouped by difficulty.",
  },
  {
    name: "search_patterns",
    args: `{ "query": "running total" }`,
    description: "Fuzzy-search patterns by keyword.",
  },
  {
    name: "get_sample_table",
    args: `{ "name": "Sales" }`,
    description: "Sample data table used in examples (Sales, Customers, Products, Employees, OrderLog).",
  },
  {
    name: "list_functions_by_category",
    args: `{ "category": "list" }`,
    description: "All functions in a given category. Use list_categories first to get valid category slugs.",
  },
  {
    name: "format_m_code",
    args: `{ "code": "let x=1 in x", "style": "long" }`,
    description: "Format M code canonically using Microsoft's official Power Query formatter. Accepts documents or bare expressions. Optional `style`: 'long' (default, editor-style) or 'short' (spreads complex function args onto their own lines).",
  },
  {
    name: "validate_m_code",
    args: `{ "code": "let x = in" }`,
    description: "Parse-check M code. Returns valid/invalid plus line and column of the first syntax error.",
  },
];

export default function McpPage() {
  return (
    <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>MCP Server</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 16 }}>
          PQM.guide exposes a{" "}
          <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">
            Model Context Protocol
          </a>{" "}
          (MCP) endpoint so AI assistants can query Power Query M documentation directly — no copy-pasting, no context limits.
        </p>
      </div>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Endpoint</h2>
        <div className="syntax-block">
          <pre style={{ background: "var(--code-bg)", border: "1px solid var(--border-color)", borderRadius: 6, padding: "16px 20px", fontSize: 14 }}>
            <code>https://pqm.guide/api/mcp</code>
          </pre>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 8 }}>
          JSON-RPC 2.0 over HTTP (POST). Implements the{" "}
          <a href="https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/transports/#streamable-http" target="_blank" rel="noopener noreferrer">
            Streamable HTTP transport
          </a>{" "}
          from the MCP 2024-11-05 spec. Stateless — no sessions required.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Connect Claude Desktop</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
          Add this to your <code>claude_desktop_config.json</code>:
        </p>
        <div className="syntax-block">
          <pre style={{ background: "var(--code-bg)", border: "1px solid var(--border-color)", borderRadius: 6, padding: "16px 20px", fontSize: 13, overflowX: "auto" }}>
            <code>{`{
  "mcpServers": {
    "pqm-guide": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://pqm.guide/api/mcp"
      ]
    }
  }
}`}</code>
          </pre>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>
          Requires <code>mcp-remote</code>: <code>npm install -g mcp-remote</code>
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Connect Cursor / Windsurf / Other Clients</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
          Any client supporting Streamable HTTP transport can connect directly:
        </p>
        <div className="syntax-block">
          <pre style={{ background: "var(--code-bg)", border: "1px solid var(--border-color)", borderRadius: 6, padding: "16px 20px", fontSize: 13 }}>
            <code>{`MCP Server URL: https://pqm.guide/api/mcp
Transport: Streamable HTTP`}</code>
          </pre>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>Available Tools</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
          {TOOLS.length} tools covering functions, concepts, patterns, and sample data.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: 8,
                padding: "16px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                <code style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>
                  {tool.name}
                </code>
                <code style={{ fontSize: 12, color: "var(--text-muted)" }}>{tool.args}</code>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Test the Endpoint</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
          Send a raw JSON-RPC request with curl:
        </p>
        <div className="syntax-block">
          <pre style={{ background: "var(--code-bg)", border: "1px solid var(--border-color)", borderRadius: 6, padding: "16px 20px", fontSize: 13, overflowX: "auto" }}>
            <code>{`curl -X POST https://pqm.guide/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get_function","arguments":{"name":"Table.AddColumn"}},"id":1}'`}</code>
          </pre>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Open Source</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
          The MCP server is part of the open-source PQM.guide codebase. Contributions welcome —{" "}
          <a href="https://github.com/kyleamueller/PQM.guide" target="_blank" rel="noopener noreferrer">
            view on GitHub
          </a>
          .
        </p>
      </section>
    </article>
  );
}
