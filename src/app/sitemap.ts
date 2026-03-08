import { MetadataRoute } from "next";
import { getAllFunctionSlugs, getAllConceptSlugs } from "@/lib/mdx";

const BASE_URL = "https://pqm.guide";

export default function sitemap(): MetadataRoute.Sitemap {
  const functionSlugs = getAllFunctionSlugs();
  const conceptSlugs = getAllConceptSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE_URL}/concepts`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/resources`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/sample-tables`, priority: 0.6, changeFrequency: "monthly" },
  ];

  const conceptPages: MetadataRoute.Sitemap = conceptSlugs.map((slug) => ({
    url: `${BASE_URL}/concepts/${slug}`,
    priority: 0.9,
    changeFrequency: "monthly" as const,
  }));

  const functionPages: MetadataRoute.Sitemap = functionSlugs.map((slug) => ({
    url: `${BASE_URL}/functions/${slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...conceptPages, ...functionPages];
}
