import { describe, it, expect } from "vitest";
import {
  getAllFunctionSlugs,
  getFunctionBySlug,
  getAllConceptSlugs,
  getConceptBySlug,
  getAllPatternSlugs,
  getPatternBySlug,
} from "@/lib/mdx";
import officialSpecSlugs from "./fixtures/official-spec-slugs.json";

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

describe("Function MDX integrity", () => {
  const slugs = getAllFunctionSlugs();

  it("loads at least 100 function slugs", () => {
    expect(slugs.length).toBeGreaterThanOrEqual(100);
  });

  it("every function has required string frontmatter fields", () => {
    for (const slug of slugs) {
      const { frontmatter } = getFunctionBySlug(slug);
      expect(frontmatter.title, slug).toBeTruthy();
      expect(typeof frontmatter.title, slug).toBe("string");
      expect(frontmatter.description, slug).toBeTruthy();
      expect(typeof frontmatter.description, slug).toBe("string");
      expect(frontmatter.category, slug).toBeTruthy();
      expect(typeof frontmatter.category, slug).toBe("string");
      expect(frontmatter.syntax, slug).toBeTruthy();
      expect(typeof frontmatter.syntax, slug).toBe("string");
      expect(frontmatter.returnType, slug).toBeTruthy();
      expect(typeof frontmatter.returnType, slug).toBe("string");
    }
  });

  it("every function slug matches its filename", () => {
    for (const slug of slugs) {
      const { frontmatter } = getFunctionBySlug(slug);
      expect(frontmatter.slug, `${slug}: frontmatter.slug mismatch`).toBe(slug);
    }
  });

  it("every function parameters field is an array", () => {
    for (const slug of slugs) {
      const { frontmatter } = getFunctionBySlug(slug);
      expect(Array.isArray(frontmatter.parameters), slug).toBe(true);
    }
  });

  it("every function has a valid compatibility object with all 6 boolean keys", () => {
    const KEYS = [
      "pbiDesktop",
      "pbiService",
      "excelDesktop",
      "excelOnline",
      "dataflows",
      "fabricNotebooks",
    ] as const;
    for (const slug of slugs) {
      const { frontmatter } = getFunctionBySlug(slug);
      for (const key of KEYS) {
        expect(
          typeof frontmatter.compatibility[key],
          `${slug}.compatibility.${key}`
        ).toBe("boolean");
      }
    }
  });

  it("every function relatedFunctions is an array of strings referencing existing or spec slugs", () => {
    const allSlugs = new Set(slugs);
    const specSlugs = new Set(officialSpecSlugs as string[]);
    for (const slug of slugs) {
      const { frontmatter } = getFunctionBySlug(slug);
      expect(Array.isArray(frontmatter.relatedFunctions), slug).toBe(true);
      for (const ref of frontmatter.relatedFunctions) {
        expect(typeof ref, `${slug}: relatedFunctions item`).toBe("string");
        expect(
          allSlugs.has(ref) || specSlugs.has(ref),
          `${slug} references unknown slug: "${ref}" (not documented and not in official spec)`
        ).toBe(true);
      }
    }
  });

  it("every function content is non-empty and contains ## Examples", () => {
    for (const slug of slugs) {
      const { content } = getFunctionBySlug(slug);
      expect(typeof content, slug).toBe("string");
      expect(content.trim().length, `${slug}: empty content`).toBeGreaterThan(0);
      expect(content, `${slug}: missing ## Examples`).toContain("## Examples");
    }
  });

  it("every function slug exists in the official Power Query M spec", () => {
    const specSet = new Set(officialSpecSlugs);
    for (const slug of slugs) {
      expect(
        specSet.has(slug),
        `"${slug}" is not in the official Power Query M spec`
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Concepts
// ---------------------------------------------------------------------------

describe("Concept MDX integrity", () => {
  const slugs = getAllConceptSlugs();

  it("loads at least 10 concept slugs", () => {
    expect(slugs.length).toBeGreaterThanOrEqual(10);
  });

  it("every concept has title, description, and slug matching filename", () => {
    for (const slug of slugs) {
      const { frontmatter } = getConceptBySlug(slug);
      expect(frontmatter.title, `${slug}: title`).toBeTruthy();
      expect(typeof frontmatter.title, slug).toBe("string");
      expect(frontmatter.description, `${slug}: description`).toBeTruthy();
      expect(typeof frontmatter.description, slug).toBe("string");
      expect(frontmatter.slug, `${slug}: slug mismatch`).toBe(slug);
    }
  });
});

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------

describe("Pattern MDX integrity", () => {
  const slugs = getAllPatternSlugs();

  it("loads at least 5 pattern slugs", () => {
    expect(slugs.length).toBeGreaterThanOrEqual(5);
  });

  it("every pattern has valid difficulty and slug matching filename", () => {
    const VALID_DIFFICULTIES = ["beginner", "intermediate", "advanced"];
    for (const slug of slugs) {
      const { frontmatter } = getPatternBySlug(slug);
      expect(
        VALID_DIFFICULTIES,
        `${slug}: invalid difficulty "${frontmatter.difficulty}"`
      ).toContain(frontmatter.difficulty);
      expect(frontmatter.slug, `${slug}: slug mismatch`).toBe(slug);
    }
  });

  it("every pattern has non-empty title and description", () => {
    for (const slug of slugs) {
      const { frontmatter } = getPatternBySlug(slug);
      expect(frontmatter.title, `${slug}: title`).toBeTruthy();
      expect(frontmatter.description, `${slug}: description`).toBeTruthy();
    }
  });
});
