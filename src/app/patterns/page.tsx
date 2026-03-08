import Link from "next/link";
import { Metadata } from "next";
import { getAllPatterns } from "@/lib/mdx";
import { PatternDifficulty } from "@/lib/types";

export const metadata: Metadata = {
  title: "Patterns",
  description: "Practical Power Query M recipes — real-world solutions to common problems.",
  openGraph: {
    title: "Patterns | PQM.guide",
    description: "Practical Power Query M recipes — real-world solutions to common problems.",
    url: "/patterns",
    type: "website",
  },
};

const DIFFICULTY_ORDER: PatternDifficulty[] = ["beginner", "intermediate", "advanced"];

const DIFFICULTY_LABELS: Record<PatternDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function PatternsPage() {
  const patterns = getAllPatterns();

  const grouped = DIFFICULTY_ORDER.reduce<Record<PatternDifficulty, typeof patterns>>(
    (acc, d) => {
      acc[d] = patterns.filter((p) => p.difficulty === d);
      return acc;
    },
    { beginner: [], intermediate: [], advanced: [] }
  );

  return (
    <div>
      <div className="home-hero" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Patterns</h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: 560 }}>
          Practical M recipes — real-world solutions to common problems, going beyond what function
          docs alone can teach.
        </p>
      </div>

      {DIFFICULTY_ORDER.map((difficulty) => {
        const group = grouped[difficulty];
        if (group.length === 0) return null;
        return (
          <section key={difficulty} style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-muted)",
                marginBottom: 12,
              }}
            >
              {DIFFICULTY_LABELS[difficulty]}
            </h2>
            <div className="category-grid">
              {group.map((pattern) => (
                <Link
                  key={pattern.slug}
                  href={`/patterns/${pattern.slug}`}
                  className="category-card"
                >
                  <div className="category-card-name">{pattern.title}</div>
                  <div className="category-card-desc">{pattern.description}</div>
                  <div className="category-card-count">{DIFFICULTY_LABELS[pattern.difficulty]}</div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
