import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "80px 16px 48px" }}>
      <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>
        <span style={{ color: "var(--text-muted)" }}>404</span>
      </h1>
      <p
        style={{
          fontSize: 18,
          color: "var(--text-secondary)",
          maxWidth: 480,
          margin: "0 auto 32px",
          lineHeight: 1.6,
        }}
      >
        This page doesn&apos;t exist. It may have been moved, or the URL might
        have a typo.
      </p>
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "var(--accent)",
            color: "#fff",
            borderRadius: 6,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Browse functions
        </Link>
        <Link
          href="/concepts"
          style={{
            display: "inline-block",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 6,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            color: "var(--text-primary)",
          }}
        >
          Concept guides
        </Link>
      </div>
      <p
        style={{
          marginTop: 32,
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        Try <kbd style={{ fontSize: 11 }}>Ctrl+K</kbd> to search, or{" "}
        <a
          href="https://github.com/kyleamueller/PQM.guide/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          report a broken link
        </a>
        .
      </p>
    </div>
  );
}
