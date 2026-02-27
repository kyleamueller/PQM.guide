import Link from "next/link";
import type { Metadata } from "next";
import { getAllConcepts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Concepts",
  description:
    "Key Power Query M language concepts — query folding, lazy evaluation, the each keyword, type system, and more.",
};

export default function ConceptsPage() {
  const concepts = getAllConcepts();

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Concepts</h1>
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: 32,
          lineHeight: 1.6,
        }}
      >
        Core ideas and patterns in the Power Query M language. Understanding
        these concepts will help you write faster, more maintainable queries.
      </p>

      <div className="concept-grid">
        {concepts.map((concept) => (
          <Link
            key={concept.slug}
            href={`/concepts/${concept.slug}`}
            className="concept-card"
          >
            <h3 className="concept-card-title">{concept.title}</h3>
            <p className="concept-card-desc">{concept.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
