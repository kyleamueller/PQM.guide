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
import recentlyEditedData from "@/data/recently-edited.json";
import type { RecentlyEditedEntry } from "@/lib/types";

// All 661 official spec slugs are now documented — relatedFunctions must
// reference existing documented slugs only (no forward-reference fallback).

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

  it("every function relatedFunctions is an array of strings referencing existing documented slugs", () => {
    const allSlugs = new Set(slugs);
    for (const slug of slugs) {
      const { frontmatter } = getFunctionBySlug(slug);
      expect(Array.isArray(frontmatter.relatedFunctions), slug).toBe(true);
      for (const ref of frontmatter.relatedFunctions) {
        expect(typeof ref, `${slug}: relatedFunctions item`).toBe("string");
        expect(
          allSlugs.has(ref),
          `${slug} references unknown slug: "${ref}" (not a documented function)`
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

// ---------------------------------------------------------------------------
// Recently Edited
// ---------------------------------------------------------------------------

describe("Recently Edited data integrity", () => {
  const entries = recentlyEditedData as RecentlyEditedEntry[];

  it("has between 1 and 6 entries", () => {
    expect(entries.length).toBeGreaterThanOrEqual(1);
    expect(entries.length).toBeLessThanOrEqual(6);
  });

  it("every entry has valid schema fields", () => {
    const validTypes = ["function", "concept", "pattern"];
    for (const entry of entries) {
      expect(typeof entry.slug, `slug type for ${entry.slug}`).toBe("string");
      expect(entry.slug.length, `slug empty`).toBeGreaterThan(0);
      expect(validTypes, `invalid type "${entry.type}"`).toContain(entry.type);
      expect(typeof entry.date, `date type for ${entry.slug}`).toBe("string");
      expect(
        /^\d{4}-\d{2}-\d{2}$/.test(entry.date),
        `invalid date format "${entry.date}" for ${entry.slug}`
      ).toBe(true);
      expect(
        isNaN(Date.parse(entry.date)),
        `unparseable date "${entry.date}" for ${entry.slug}`
      ).toBe(false);
      expect(typeof entry.description, `description type for ${entry.slug}`).toBe("string");
      expect(entry.description.length, `empty description for ${entry.slug}`).toBeGreaterThan(0);
    }
  });

  it("every entry slug references an existing content file", () => {
    const functionSlugs = new Set(getAllFunctionSlugs());
    const conceptSlugs = new Set(getAllConceptSlugs());
    const patternSlugs = new Set(getAllPatternSlugs());
    for (const entry of entries) {
      switch (entry.type) {
        case "function":
          expect(functionSlugs.has(entry.slug), `function slug "${entry.slug}" does not exist`).toBe(true);
          break;
        case "concept":
          expect(conceptSlugs.has(entry.slug), `concept slug "${entry.slug}" does not exist`).toBe(true);
          break;
        case "pattern":
          expect(patternSlugs.has(entry.slug), `pattern slug "${entry.slug}" does not exist`).toBe(true);
          break;
      }
    }
  });

  it("has no duplicate slug+type combinations", () => {
    const keys = entries.map((e) => `${e.type}/${e.slug}`);
    expect(new Set(keys).size, "duplicate entries found").toBe(keys.length);
  });

  it("entries are sorted newest-first", () => {
    for (let i = 1; i < entries.length; i++) {
      expect(
        entries[i - 1].date >= entries[i].date,
        `entries[${i - 1}] (${entries[i - 1].date}) should be >= entries[${i}] (${entries[i].date})`
      ).toBe(true);
    }
  });

  it("most recent entry is within the last 45 days", () => {
    const now = new Date();
    const newest = new Date(entries[0].date);
    const diffDays = (now.getTime() - newest.getTime()) / (1000 * 60 * 60 * 24);
    expect(
      diffDays,
      `most recent entry is ${Math.round(diffDays)} days old — update recently-edited.json`
    ).toBeLessThanOrEqual(45);
  });
});
