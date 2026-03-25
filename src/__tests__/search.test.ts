import { describe, it, expect } from "vitest";
import { createSearchIndex } from "@/lib/search";
import type { SearchIndexEntry } from "@/lib/types";

const DATA: SearchIndexEntry[] = [
  { type: "function", title: "List.Accumulate", slug: "list-accumulate", category: "List", description: "Fold over a list with a seed value." },
  { type: "function", title: "Table.AddColumn", slug: "table-addcolumn", category: "Table", description: "Add a computed column to a table." },
  { type: "function", title: "List.Sum", slug: "list-sum", category: "List", description: "Sum all numeric values in a list." },
  { type: "function", title: "Number.Round", slug: "number-round", category: "Number", description: "Round a number to a given precision." },
  { type: "function", title: "Text.Length", slug: "text-length", category: "Text", description: "Returns the number of characters in a text value." },
];

const MIXED_DATA: SearchIndexEntry[] = [
  ...DATA,
  { type: "concept", title: "Query Folding", slug: "query-folding", description: "How Power Query pushes transformations back to the data source." },
  { type: "concept", title: "Error Handling", slug: "error-handling", description: "Techniques for catching and recovering from M errors." },
  { type: "pattern", title: "Conditional Column", slug: "conditional-column", description: "Add a column whose value depends on another column.", difficulty: "beginner" },
];

describe("createSearchIndex", () => {
  it("returns a Fuse instance with a .search method", () => {
    const index = createSearchIndex(DATA);
    expect(typeof index.search).toBe("function");
  });

  it("exact title match returns the correct result first", () => {
    const results = createSearchIndex(DATA).search("List.Accumulate");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.slug).toBe("list-accumulate");
  });

  it("partial title match works (fuzzy search)", () => {
    const results = createSearchIndex(DATA).search("Accumulate");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.slug).toBe("list-accumulate");
  });

  it("returns empty array for a query with no possible match", () => {
    const results = createSearchIndex(DATA).search("xyznonexistentquery");
    expect(results).toEqual([]);
  });

  it("results include a score (includeScore: true is configured)", () => {
    const results = createSearchIndex(DATA).search("AddColumn");
    expect(results.length).toBeGreaterThan(0);
    expect(typeof results[0].score).toBe("number");
  });

  it("respects the limit option", () => {
    const large: SearchIndexEntry[] = Array.from({ length: 50 }, (_, i) => ({
      type: "function" as const,
      title: `List.Function${i}`,
      slug: `list-function-${i}`,
      category: "List",
      description: `Does thing number ${i}.`,
    }));
    const results = createSearchIndex(large).search("List", { limit: 10 });
    expect(results.length).toBeLessThanOrEqual(10);
  });

  it("category search returns multiple matches", () => {
    const results = createSearchIndex(DATA).search("List");
    const slugs = results.map((r) => r.item.slug);
    expect(slugs).toContain("list-accumulate");
    expect(slugs).toContain("list-sum");
  });

  it("keyword synonyms surface results for non-M vocabulary", () => {
    const withKeywords: SearchIndexEntry[] = [
      ...DATA,
      {
        type: "function",
        title: "Table.SelectRows",
        slug: "table-selectrows",
        category: "Table",
        description: "Filters rows using a condition.",
        keywords: "filter where sql where clause",
      },
    ];
    const results = createSearchIndex(withKeywords).search("sql where");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.slug).toBe("table-selectrows");
  });

  it("concepts appear in mixed search results", () => {
    const results = createSearchIndex(MIXED_DATA).search("query folding");
    const slugs = results.map((r) => r.item.slug);
    expect(slugs).toContain("query-folding");
  });

  it("patterns appear in mixed search results", () => {
    const results = createSearchIndex(MIXED_DATA).search("conditional column");
    const slugs = results.map((r) => r.item.slug);
    expect(slugs).toContain("conditional-column");
  });

  it("result items carry their type field", () => {
    const results = createSearchIndex(MIXED_DATA).search("error");
    const types = results.map((r) => r.item.type);
    expect(types).toContain("concept");
  });
});
