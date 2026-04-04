import { MetadataRoute } from "next";
import { getAllFunctionSlugs, getAllConceptSlugs, getAllPatternSlugs } from "@/lib/mdx";
import { categories } from "@/data/categories";

const BASE_URL = "https://pqm.guide";

export default function sitemap(): MetadataRoute.Sitemap {
  const functionSlugs = getAllFunctionSlugs();
  const conceptSlugs = getAllConceptSlugs();
  const patternSlugs = getAllPatternSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/learn`, priority: 0.95, changeFrequency: "monthly" },
    { url: `${BASE_URL}/concepts`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/patterns`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/categories`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/mcp`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/resources`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/sample-tables`, priority: 0.6, changeFrequency: "monthly" },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/categories/${cat.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const conceptPages: MetadataRoute.Sitemap = conceptSlugs.map((slug) => ({
    url: `${BASE_URL}/concepts/${slug}`,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  }));

  const patternPages: MetadataRoute.Sitemap = patternSlugs.map((slug) => ({
    url: `${BASE_URL}/patterns/${slug}`,
    priority: 0.85,
    changeFrequency: "monthly" as const,
  }));

  const functionPages: MetadataRoute.Sitemap = functionSlugs.map((slug) => ({
    url: `${BASE_URL}/functions/${slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...categoryPages, ...conceptPages, ...patternPages, ...functionPages];
}
