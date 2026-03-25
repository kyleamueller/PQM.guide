import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { FunctionFrontmatter, FunctionIndexEntry, ConceptFrontmatter, PatternFrontmatter } from "./types";
import { functionSynonyms } from "@/data/search-synonyms";

const CONTENT_DIR = path.join(process.cwd(), "src/content/functions");
const CONCEPTS_DIR = path.join(process.cwd(), "src/content/concepts");

export function getFunctionBySlug(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as FunctionFrontmatter,
    content,
  };
}

export function getAllFunctionSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

export function getAllFunctions(): (FunctionFrontmatter & { slug: string })[] {
  const slugs = getAllFunctionSlugs();
  return slugs.map((slug) => {
    const { frontmatter } = getFunctionBySlug(slug);
    return { ...frontmatter, slug };
  });
}

export function getFunctionsByCategory(categorySlug: string): FunctionIndexEntry[] {
  const all = getAllFunctions();
  return all
    .filter((f) => f.category.toLowerCase().replace(/\s+/g, "-") === categorySlug)
    .map((f) => ({
      title: f.title,
      slug: f.slug,
      category: f.category,
      description: f.description,
    }));
}

export function buildSearchIndex(): FunctionIndexEntry[] {
  return getAllFunctions().map((f) => ({
    title: f.title,
    slug: f.slug,
    category: f.category,
    description: f.description,
    keywords: functionSynonyms[f.slug],
  }));
}

// Concept utilities

export function getConceptBySlug(slug: string) {
  const filePath = path.join(CONCEPTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as ConceptFrontmatter,
    content,
  };
}

export function getAllConceptSlugs(): string[] {
  if (!fs.existsSync(CONCEPTS_DIR)) return [];
  const files = fs.readdirSync(CONCEPTS_DIR);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

export function getAllConcepts(): (ConceptFrontmatter & { slug: string })[] {
  const slugs = getAllConceptSlugs();
  return slugs.map((slug) => {
    const { frontmatter } = getConceptBySlug(slug);
    return { ...frontmatter, slug };
  });
}

// Pattern utilities

const PATTERNS_DIR = path.join(process.cwd(), "src/content/patterns");

export function getPatternBySlug(slug: string) {
  const filePath = path.join(PATTERNS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as PatternFrontmatter,
    content,
  };
}

export function getAllPatternSlugs(): string[] {
  if (!fs.existsSync(PATTERNS_DIR)) return [];
  return fs
    .readdirSync(PATTERNS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}

export function getAllPatterns(): (PatternFrontmatter & { slug: string })[] {
  return getAllPatternSlugs().map((slug) => {
    const { frontmatter } = getPatternBySlug(slug);
    return { ...frontmatter, slug };
  });
}
