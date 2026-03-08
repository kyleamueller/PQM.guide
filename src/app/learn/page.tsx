import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Start Here",
  description:
    "A curated learning path for Power Query M — from the core paradigm to advanced patterns. Start here if you're new to M or want to fill in the gaps.",
  openGraph: {
    title: "Start Here | PQM.guide",
    description:
      "A curated learning path for Power Query M — from the core paradigm to advanced patterns.",
    url: "/learn",
    type: "website",
  },
};

const STEPS = [
  {
    step: 1,
    href: "/concepts/m-paradigm",
    title: "The M Paradigm",
    description:
      "Before writing any M code, understand what kind of language you're working with. M is functional, immutable, and lazy. These three properties explain most of its surprising behaviors.",
    time: "10 min",
  },
  {
    step: 2,
    href: "/concepts/let-in-expressions",
    title: "Let/In Expressions",
    description:
      "The let/in block is M's fundamental building block. Every query you write is a let expression. Learn how named steps compose into a pipeline.",
    time: "8 min",
  },
  {
    step: 3,
    href: "/concepts/type-system",
    title: "The Type System",
    description:
      "M is strongly typed. Learn the primitive types, how nullable types work, and why type annotations on Table.AddColumn columns matter for performance.",
    time: "10 min",
  },
  {
    step: 4,
    href: "/concepts/null-handling",
    title: "Null Handling",
    description:
      "Null propagates silently through M expressions. Learn how null flows through comparisons, arithmetic, and function calls — and how to defend against it with the ?? operator.",
    time: "8 min",
  },
  {
    step: 5,
    href: "/concepts/each-keyword",
    title: "The each Keyword",
    description:
      "each is shorthand for a single-argument function. It appears everywhere — in Table.AddColumn, List.Select, List.Transform, and more. Understanding it unlocks the whole standard library.",
    time: "8 min",
  },
  {
    step: 6,
    href: "/concepts/custom-functions",
    title: "Custom Functions",
    description:
      "M functions are first-class values. Learn how to define reusable functions, pass them as arguments, and compose them to eliminate repetition in your queries.",
    time: "12 min",
  },
  {
    step: 7,
    href: "/concepts/error-handling",
    title: "Error Handling",
    description:
      "Errors in M are values, not exceptions. Learn try/otherwise, how to catch errors cell-by-cell in a table, and when to let errors propagate versus recover from them.",
    time: "10 min",
  },
  {
    step: 8,
    href: "/concepts/query-folding",
    title: "Query Folding",
    description:
      "Query folding is M's most important performance concept. Understand when M pushes work back to the data source, when it can't, and how to keep your queries fold-able.",
    time: "12 min",
  },
];

const NEXT_STEPS = [
  {
    href: "/concepts/lazy-evaluation",
    title: "Lazy Evaluation",
    description: "How M only computes values when they're actually needed, and what this means for side effects and performance.",
  },
  {
    href: "/concepts/structured-data",
    title: "Structured Data",
    description: "Working with nested tables, lists, and records — expanding, combining, and transforming hierarchical data.",
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
          A curated path through the concepts that matter most for writing real M code. Work through these in order — each one builds on the last.
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
