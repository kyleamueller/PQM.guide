import { describe, it, expect } from "vitest";
import { getFunctionsByCategory, buildSearchIndex } from "@/lib/mdx";

describe("getFunctionsByCategory", () => {
  it("returns results for single-word slug 'list'", () => {
    const results = getFunctionsByCategory("list");
    expect(results.length).toBeGreaterThan(0);
    for (const fn of results) {
      expect(fn.category).toBe("List");
    }
  });

  it("returns results for multi-word slug 'accessing-data'", () => {
    const results = getFunctionsByCategory("accessing-data");
    expect(results.length).toBeGreaterThan(0);
    for (const fn of results) {
      expect(fn.category).toBe("Accessing Data");
    }
  });

  it("returns empty array for unknown category slug", () => {
    expect(getFunctionsByCategory("does-not-exist")).toEqual([]);
  });

  it("each returned entry has title, slug, category, description as strings", () => {
    const results = getFunctionsByCategory("table");
    expect(results.length).toBeGreaterThan(0);
    for (const entry of results) {
      expect(typeof entry.title).toBe("string");
      expect(typeof entry.slug).toBe("string");
      expect(typeof entry.category).toBe("string");
      expect(typeof entry.description).toBe("string");
    }
  });
});

describe("buildSearchIndex", () => {
  it("returns at least 100 entries", () => {
    expect(buildSearchIndex().length).toBeGreaterThanOrEqual(100);
  });

  it("contains no duplicate slugs", () => {
    const slugs = buildSearchIndex().map((e) => e.slug);
    expect(slugs.length).toBe(new Set(slugs).size);
  });

  it("every entry has required string fields", () => {
    for (const entry of buildSearchIndex()) {
      expect(typeof entry.title).toBe("string");
      expect(typeof entry.slug).toBe("string");
      expect(typeof entry.category).toBe("string");
      expect(typeof entry.description).toBe("string");
    }
  });
});
