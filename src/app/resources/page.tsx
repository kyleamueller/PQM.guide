import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Community resources for learning Power Query M — tools, tutorials, and references from contributors across the ecosystem.",
};

export default function ResourcesPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Resources</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 32, lineHeight: 1.6 }}>
        PQM.guide wouldn&apos;t exist without the work of many people across the
        Power Query community. This page highlights tools, references, and
        learning materials that we think every M developer should know about.
      </p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Tools</h2>

        <div className="resource-card">
          <h3>
            <a
              href="https://pqlint.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              PQLint.com
            </a>
          </h3>
          <p>
            An automated linter for Power Query M code. Paste in your query and
            get instant feedback on best practices — from consolidating type
            changes to avoiding query-folding pitfalls. Many of the best-practice
            tips throughout PQM.guide were informed by PQLint&apos;s rule set.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Learning</h2>

        <div className="resource-card">
          <h3>
            <a
              href="https://bengribaudo.com/blog/2017/11/17/4107/power-query-m-primer-part1-introduction-simple-expressions-let"
              target="_blank"
              rel="noopener noreferrer"
            >
              Power Query M Primer — Ben Gribaudo
            </a>
          </h3>
          <p>
            A comprehensive multi-part blog series that walks through the M
            language from the ground up. Covers everything from simple
            expressions and <code>let</code> blocks to advanced topics like type
            system internals, metadata, and custom connectors. If you want to
            truly understand M rather than just copy-paste snippets, this is the
            place to start.
          </p>
        </div>

        <div className="resource-card">
          <h3>
            <a
              href="https://learn.microsoft.com/en-us/powerquery-m/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Power Query M Reference — Microsoft Learn
            </a>
          </h3>
          <p>
            The official language specification and function reference from
            Microsoft. PQM.guide builds on top of this documentation by adding
            visual examples and community-sourced best practices, but the
            official docs remain the authoritative source for language semantics.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Community</h2>

        <div className="resource-card">
          <h3>
            <a
              href="https://dax.guide"
              target="_blank"
              rel="noopener noreferrer"
            >
              DAX.guide
            </a>
          </h3>
          <p>
            The inspiration for this project. DAX.guide is the gold standard for
            DAX function documentation — clear syntax references, practical
            examples, and community contributions. PQM.guide aims to bring the
            same approach to the Power Query M language.
          </p>
        </div>
      </section>

      <div
        style={{
          borderTop: "1px solid var(--border-color)",
          paddingTop: 24,
          color: "var(--text-secondary)",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        <p>
          Know of a resource that should be listed here?{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open a PR
          </a>{" "}
          or{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            start a discussion
          </a>{" "}
          on GitHub.
        </p>
      </div>
    </div>
  );
}
