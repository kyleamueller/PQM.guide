import Link from "next/link";
import { categories } from "@/data/categories";
import recentlyEditedData from "@/data/recently-edited.json";
import { getAllFunctions, getFunctionBySlug, getConceptBySlug, getPatternBySlug, getAllPatterns } from "@/lib/mdx";
import { PatternDifficulty } from "@/lib/types";
import type { RecentlyEditedEntry } from "@/lib/types";
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

function getRecentlyEdited() {
  return (recentlyEditedData as RecentlyEditedEntry[]).flatMap((entry) => {
    try {
      let title: string, contentDesc: string;
      switch (entry.type) {
        case "function": {
          const { frontmatter } = getFunctionBySlug(entry.slug);
          title = frontmatter.title;
          contentDesc = frontmatter.description;
          break;
        }
        case "concept": {
          const { frontmatter } = getConceptBySlug(entry.slug);
          title = frontmatter.title;
          contentDesc = frontmatter.description;
          break;
        }
        case "pattern": {
          const { frontmatter } = getPatternBySlug(entry.slug);
          title = frontmatter.title;
          contentDesc = frontmatter.description;
          break;
        }
      }
      return [{ ...entry, title, contentDescription: contentDesc }];
    } catch {
      return [];
    }
  });
}

const DIFFICULTY_COLOR: Record<PatternDifficulty, string> = {
  beginner: "var(--pq-logical-true)",
  intermediate: "var(--accent)",
  advanced: "#e67e22",
};

const DIFFICULTY_LABEL: Record<PatternDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function Home() {
  const allFunctions = getAllFunctions();
  const recentlyEdited = getRecentlyEdited();
  const allPatterns = getAllPatterns();
  // Show beginner patterns first, then fill with intermediate up to 4 total
  const featuredPatterns = [
    ...allPatterns.filter((p) => p.difficulty === "beginner"),
    ...allPatterns.filter((p) => p.difficulty === "intermediate"),
  ].slice(0, 4);

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
            flex: "1 1 160px",
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
        <Link
          href="/patterns"
          style={{
            flex: "1 1 160px",
            display: "block",
            background: "var(--bg-secondary)",
            border: "2px solid var(--accent)",
            borderRadius: 8,
            padding: "20px 24px",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "var(--accent)" }}>Practical Patterns →</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Real-world M recipes: joins, pagination, fuzzy matching, and more.
          </div>
        </Link>
        <div
          style={{
            flex: "1 1 160px",
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

      {recentlyEdited.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Recently Edited
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
            {recentlyEdited.map((item) => (
              <Link
                key={`${item.type}-${item.slug}`}
                href={`/${item.type}s/${item.slug}`}
                style={{
                  display: "block",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 6,
                  padding: "10px 14px",
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--accent)",
                    fontFamily: item.type === "function" ? "var(--font-mono)" : undefined,
                  }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: "var(--text-muted)", flexShrink: 0, marginLeft: 8 }}>
                    {item.type}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.contentDescription}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, opacity: 0.7 }}>
                  {item.date}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {featuredPatterns.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
              Patterns
            </h2>
            <Link href="/patterns" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none" }}>
              View all {allPatterns.length} →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
            {featuredPatterns.map((pattern) => (
              <Link
                key={pattern.slug}
                href={`/patterns/${pattern.slug}`}
                style={{
                  display: "block",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 6,
                  padding: "12px 14px",
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{pattern.title}</span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: DIFFICULTY_COLOR[pattern.difficulty],
                    flexShrink: 0,
                    marginLeft: 8,
                  }}>
                    {DIFFICULTY_LABEL[pattern.difficulty]}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {pattern.description}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

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
