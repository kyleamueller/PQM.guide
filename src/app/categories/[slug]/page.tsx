import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getFunctionsByCategory } from "@/lib/mdx";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Not Found" };
  return {
    title: `${category.name} Functions`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const functions = getFunctionsByCategory(slug);

  return (
    <div className="category-page">
      <h1>{category.name} Functions</h1>
      <p className="category-page-desc">{category.description}</p>

      {functions.length > 0 ? (
        <ul className="function-list">
          {functions.map((fn) => (
            <li key={fn.slug} className="function-list-item">
              <Link href={`/functions/${fn.slug}`}>
                <div className="function-list-item-title">{fn.title}</div>
                <div className="function-list-item-desc">{fn.description}</div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "var(--text-muted)" }}>
          No functions documented in this category yet. Contributions welcome!
        </p>
      )}
    </div>
  );
}
