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

        <div className="resource-card">
          <h3>
            <a
              href="https://marketplace.visualstudio.com/items?itemName=analysis-services.TMDL"
              target="_blank"
              rel="noopener noreferrer"
            >
              TMDL VS Code Extension
            </a>
          </h3>
          <p>
            Microsoft&apos;s official VS Code extension for working with
            Tabular Model Definition Language (TMDL) files. Includes M code
            syntax highlighting, autocomplete, diagnostics, hover info, and
            formatting for Power Query expressions embedded in TMDL documents —
            making VS Code a first-class editor for M code.
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

        <div className="resource-card">
          <h3>
            <a
              href="https://www.thebiccountant.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              The BIccountant — Imke Feldmann
            </a>
          </h3>
          <p>
            A long-running blog packed with advanced Power Query techniques,
            creative M solutions, and deep dives into real-world data
            transformation challenges. Imke&apos;s posts frequently explore
            lesser-known M patterns and push the boundaries of what&apos;s
            possible in Power Query.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Books</h2>

        <div className="resource-card">
          <h3>M Is for (Data) Monkey — Ken Puls &amp; Miguel Escobar</h3>
          <p>
            A beginner-friendly guide to Power Query that introduces M through
            practical, hands-on examples. Covers the fundamentals of
            transforming and shaping data in Excel and Power BI, making it an
            excellent starting point for anyone new to the language.
          </p>
        </div>

        <div className="resource-card">
          <h3>The Definitive Guide to Power Query (M) — Greg Deckler, Rick de Groot &amp; Melissa de Korte</h3>
          <p>
            A thorough reference covering M from foundational concepts through
            advanced patterns. Ideal for users who want to go beyond the UI and
            write M code directly, with in-depth coverage of functions, types,
            error handling, and query optimization.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>YouTube Channels</h2>

        <div className="resource-card">
          <h3>
            <a
              href="https://www.youtube.com/@GuyInACube"
              target="_blank"
              rel="noopener noreferrer"
            >
              Guy in a Cube — Adam Saxton &amp; Patrick LeBlanc
            </a>
          </h3>
          <p>
            Weekly Power BI videos covering everything from Power Query
            transformations and M code to DAX, report design, and the Power BI
            service. One of the longest-running and most-watched Power BI
            channels on YouTube, with deep dives and live Q&amp;A sessions.
          </p>
        </div>

        <div className="resource-card">
          <h3>
            <a
              href="https://www.youtube.com/@GoodlyChandeep"
              target="_blank"
              rel="noopener noreferrer"
            >
              Goodly — Chandeep Chhabra
            </a>
          </h3>
          <p>
            Clear, practical Power BI and Power Query tutorials aimed at
            analysts who want to level up quickly. Covers M code, data
            modeling, and DAX with an emphasis on real business use cases.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Blogs</h2>

        <div className="resource-card">
          <h3>
            <a
              href="https://blog.crossjoin.co.uk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chris Webb&apos;s BI Blog
            </a>
          </h3>
          <p>
            One of the most technically deep Power Query blogs in the
            community. Chris Webb has been writing about Power Query since its
            earliest days and covers query folding behavior, M language
            internals, performance gotchas, and advanced connector patterns in
            detail that you won&apos;t find anywhere else. An essential
            reference for understanding <em>why</em> things work the way they
            do in Power Query.
          </p>
        </div>

        <div className="resource-card">
          <h3>
            <a
              href="https://gorilla.bi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gorilla.bi — Rick de Groot
            </a>
          </h3>
          <p>
            A well-organized Power BI and Power Query blog with searchable
            function references, technique breakdowns, and practical tutorials.
            Rick&apos;s articles are detailed and consistently well-explained,
            making it a reliable reference whether you&apos;re debugging a
            formula or learning a new pattern.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Community</h2>

        <div className="resource-card">
          <h3>
            <a
              href="https://github.com/ImkeF/M"
              target="_blank"
              rel="noopener noreferrer"
            >
              ImkeF/M — Custom M Function Library
            </a>
          </h3>
          <p>
            A collection of custom M functions for Power Query and Power BI
            maintained by Imke Feldmann. These reusable functions can be
            packaged as a library and cover common data transformation patterns
            that go beyond the built-in standard library.
          </p>
        </div>

        <div className="resource-card">
          <h3>
            <a
              href="https://github.com/ImkeF/M-Guide"
              target="_blank"
              rel="noopener noreferrer"
            >
              ImkeF/M-Guide — Native M Function Gotchas
            </a>
          </h3>
          <p>
            A collection of native M functions with unexpected behaviour and
            their workarounds. An invaluable reference for understanding edge
            cases and quirks in the standard M library that can trip up even
            experienced developers.
          </p>
        </div>

        <div className="resource-card">
          <h3>
            <a
              href="https://community.fabric.microsoft.com/t5/Power-Query/bd-p/power_query_en"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Fabric Community — Power Query Forum
            </a>
          </h3>
          <p>
            The official community forum for Power Query questions, hosted on
            the Microsoft Fabric Community site. Millions of threads covering
            every imaginable M scenario, with answers from Microsoft MVPs and
            the community at large.
          </p>
        </div>

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
            href="https://github.com/kyleamueller/PQM.guide/pulls"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open a PR
          </a>{" "}
          or{" "}
          <a
            href="https://github.com/kyleamueller/PQM.guide/discussions"
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
