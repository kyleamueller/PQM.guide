import Link from "next/link";
import { categories } from "@/data/categories";
import { getAllFunctions } from "@/lib/mdx";

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
