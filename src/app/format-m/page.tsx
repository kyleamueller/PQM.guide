import { Metadata } from "next";
import FormatClient from "./FormatClient";

export const metadata: Metadata = {
  title: "Format M Code",
  description:
    "Format Power Query M code canonically using Microsoft's official parser and formatter.",
  openGraph: {
    title: "Format M Code | PQM.guide",
    description:
      "Format Power Query M code canonically using Microsoft's official parser and formatter.",
    url: "/format-m",
    type: "website",
  },
};

export default function FormatMPage() {
  return (
    <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Format M Code</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 16 }}>
          Paste a Power Query M snippet — a full <code>let … in …</code> query or a bare
          expression — and get canonical formatting back. Use <strong>Validate</strong> to
          parse-check without reformatting.
        </p>
      </div>

      <section style={{ marginBottom: 32 }}>
        <FormatClient />
      </section>

      <section>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Attribution</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
          Formatting and parsing are powered by Microsoft&apos;s official MIT-licensed
          libraries:{" "}
          <a
            href="https://github.com/microsoft/powerquery-formatter"
            target="_blank"
            rel="noopener noreferrer"
          >
            @microsoft/powerquery-formatter
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/microsoft/powerquery-parser"
            target="_blank"
            rel="noopener noreferrer"
          >
            @microsoft/powerquery-parser
          </a>
          . The same engines back VS Code&apos;s Power Query extension. This tool is also
          exposed via the{" "}
          <a href="/mcp">MCP server</a> as <code>format_m_code</code> and{" "}
          <code>validate_m_code</code>.
        </p>
      </section>
    </article>
  );
}
