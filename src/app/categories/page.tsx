import Link from "next/link";
import { Metadata } from "next";
import { categories } from "@/data/categories";
import { getAllFunctions } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Function Categories — PQM.guide",
  description: "Browse all Power Query M function categories.",
};

export default function CategoriesPage() {
  const allFunctions = getAllFunctions();

  const categoryCounts = categories.map((cat) => ({
    ...cat,
    count: allFunctions.filter(
      (f) => f.category.toLowerCase().replace(/\s+/g, "-") === cat.slug
    ).length,
  }));

  return (
    <div className="category-page">
      <h1>Function Categories</h1>
      <p className="category-page-desc">
        Browse all {categories.length} Power Query M function categories.
      </p>
      <div className="category-grid">
        {categoryCounts.map((cat) => (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="category-card">
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
