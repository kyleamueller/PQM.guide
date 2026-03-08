import Link from "next/link";
import { categories } from "@/data/categories";
import { getAllFunctions } from "@/lib/mdx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PQM.guide — Power Query M Function Reference",
  description:
    "Community-driven Power Query M language reference with visual table examples, concept guides, and practical patterns.",
  openGraph: {
    title: "PQM.guide — Power Query M Function Reference",
    description:
      "Community-driven Power Query M language reference with visual table examples, concept guides, and practical patterns.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  const allFunctions = getAllFunctions();

  const categoryCounts = categories.map((cat) => ({
    ...cat,
    count: allFunctions.filter(
      (f) => f.category.toLowerCase().replace(/\s+/g, "-") === cat.slug
    ).length,
  }));

  return (
    <div>
      <div className="home-hero">
        <h1>
          <span style={{ color: "var(--accent)" }}>PQ</span>M.guide
        </h1>
        <p>
          Community-driven Power Query M language reference with visual table
          examples. No more <code>Table.FromRecords</code>.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 40, flexWrap: "wrap" }}>
        <Link
          href="/learn"
          style={{
            flex: "1 1 200px",
            display: "block",
            background: "var(--accent)",
            color: "#fff",
            borderRadius: 8,
            padding: "20px 24px",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>New to M? Start Here →</div>
          <div style={{ fontSize: 13, opacity: 0.88, lineHeight: 1.5 }}>
            An 8-step learning path from the M paradigm to query folding.
          </div>
        </Link>
        <div
          style={{
            flex: "1 1 200px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 8,
            padding: "20px 24px",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Search {allFunctions.length} functions</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Press <kbd style={{ fontSize: 11 }}>Ctrl+K</kbd> to search by name or description.
          </div>
        </div>
      </div>

      <div className="category-grid">
        {categoryCounts.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="category-card"
          >
            <div className="category-card-name">{cat.name}</div>
            <div className="category-card-desc">{cat.description}</div>
            {cat.count > 0 && (
              <div className="category-card-count">
                {cat.count} function{cat.count !== 1 ? "s" : ""}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
