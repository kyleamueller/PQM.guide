import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Start Here",
  description:
    "A curated learning path for Power Query M — starting from the Advanced Editor and building up through the core language. Designed for Power BI users making the transition from the UI to writing M code.",
  openGraph: {
    title: "Start Here | PQM.guide",
    description:
      "A curated learning path for Power Query M — starting from the Advanced Editor and building up through the core language.",
    url: "/learn",
    type: "website",
  },
};

const STEPS = [
  {
    step: 1,
    href: "/concepts/getting-started",
    title: "Getting Started with M Code",
    description:
      "Find the M code that Power Query has been generating behind the UI all along. Learn to open the Advanced Editor, read a generated query, and make your first hand edit.",
    time: "8 min",
  },
  {
    step: 2,
    href: "/concepts/ui-to-m-bridge",
    title: "From the UI to M Code",
    description:
      "A translation guide: the ten most common Power Query UI operations — filter rows, add column, merge queries, group by — and the exact M code each one generates.",
    time: "12 min",
  },
  {
    step: 3,
    href: "/concepts/m-paradigm",
    title: "The M Paradigm",
    description:
      "Now that you've seen M code in the wild, understand what kind of language it is. M is functional, immutable, and lazy — three properties that explain most of its surprising behaviors.",
    time: "10 min",
  },
  {
    step: 4,
    href: "/concepts/let-in-expressions",
    title: "let/in Expressions",
    description:
      "The let/in block is M's fundamental building block. Every query you write is a let expression. Learn how named steps compose into a pipeline and why step order isn't execution order.",
    time: "8 min",
  },
  {
    step: 5,
    href: "/concepts/structured-data",
    title: "Records, Lists & Tables",
    description:
      "M has three container types: records (rows), lists (columns), and tables (grids). Understanding how they relate to each other is the key to reading and writing most M code.",
    time: "10 min",
  },
  {
    step: 6,
    href: "/concepts/each-keyword",
    title: "The each Keyword",
    description:
      "each is shorthand for a single-argument function. It appears in every Table.AddColumn, Table.SelectRows, and List.Transform call. Understanding it unlocks the whole standard library.",
    time: "8 min",
  },
  {
    step: 7,
    href: "/concepts/type-system",
    title: "The Type System",
    description:
      "M is strongly typed. Learn the primitive types, how nullable types work, and why type annotations on Table.AddColumn matter for performance.",
    time: "10 min",
  },
  {
    step: 8,
    href: "/concepts/null-handling",
    title: "Null Handling",
    description:
      "Null propagates silently through M expressions. Learn how null flows through comparisons, arithmetic, and function calls — and how to defend against it with the ?? operator.",
    time: "8 min",
  },
  {
    step: 9,
    href: "/concepts/control-structures",
    title: "Control Structures",
    description:
      "if/then/else, logical operators, and how conditional logic works in a language where everything is an expression. The building block for conditional columns and branching transformations.",
    time: "8 min",
  },
  {
    step: 10,
    href: "/concepts/error-handling",
    title: "Error Handling",
    description:
      "Errors in M are values, not exceptions. Learn try/otherwise, how to catch errors cell-by-cell in a table, and when to let errors propagate versus recover from them.",
    time: "10 min",
  },
];

const NEXT_STEPS = [
  {
    href: "/concepts/custom-functions",
    title: "Custom Functions",
    description: "Define reusable functions, pass them as arguments, and compose them to eliminate repetition across queries.",
  },
  {
    href: "/concepts/query-folding",
    title: "Query Folding",
    description: "M's most important performance concept — when the engine pushes work back to the data source, and how to keep your queries fold-able.",
  },
  {
    href: "/concepts/lazy-evaluation",
    title: "Lazy Evaluation",
    description: "How M only computes values when they're actually needed, and what this means for side effects and performance.",
  },
  {
    href: "/concepts/datetime-types",
    title: "Date, Time & Duration Types",
    description: "The five temporal types in M, how to convert between them, and the pitfalls that trip up even experienced M developers.",
  },
  {
    href: "/concepts/identifiers-and-scoping",
    title: "Identifiers & Scoping",
    description: "How M names are scoped inside let blocks, the @ self-reference operator, and why recursive functions need special syntax.",
  },
  {
    href: "/concepts/common-errors",
    title: "Common M Errors",
    description: "The most frequent error messages beginners encounter — what causes them and how to fix them.",
  },
  {
    href: "/patterns",
    title: "Practical Patterns",
    description: "Ready-to-use recipes: date dimension tables, recursive list flattening, parameterized queries, and more.",
  },
];

export default function LearnPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Start Here</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 16 }}>
          A curated path for Power BI users making the transition from the UI to writing M directly. Work through these in order — each one builds on the last.
        </p>
      </div>

      {/* Learning path */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {STEPS.map((step, i) => (
            <div key={step.href} style={{ display: "flex", gap: 20, position: "relative" }}>
              {/* Step number + connector line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                >
                  {step.step}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 20,
                      background: "var(--border-color)",
                      margin: "4px 0",
                    }}
                  />
                )}
              </div>

              {/* Card */}
              <Link
                href={step.href}
                style={{
                  display: "block",
                  flex: 1,
                  marginBottom: i < STEPS.length - 1 ? 8 : 0,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 8,
                  padding: "16px 20px",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color 0.15s",
                }}
                className="learn-card"
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6, gap: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{step.title}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>{step.time}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* What's next */}
      <section>
        <h2 style={{ fontSize: 20, marginBottom: 6 }}>What&apos;s Next</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
          Once you&apos;re comfortable with the core path, explore these topics in any order.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {NEXT_STEPS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "block",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: 8,
                padding: "14px 18px",
                textDecoration: "none",
                color: "inherit",
              }}
              className="learn-card"
            >
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
