import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { getSourceUrl, REPO_URL } from "@/lib/source-url";
import { getAllFunctionSlugs, getAllConceptSlugs, getAllPatternSlugs } from "@/lib/mdx";

const BLOB = `${REPO_URL}/blob/main/`;

// Converts a source URL back to a repo-relative path so we can check the file exists
function toRepoPath(url: string): string {
  return decodeURIComponent(url.slice(BLOB.length));
}

describe("getSourceUrl", () => {
  it("maps content pages to their MDX files", () => {
    expect(getSourceUrl("/functions/table-filldown")).toBe(`${BLOB}src/content/functions/table-filldown.mdx`);
    expect(getSourceUrl("/concepts/query-folding")).toBe(`${BLOB}src/content/concepts/query-folding.mdx`);
    expect(getSourceUrl("/patterns/running-total/")).toBe(`${BLOB}src/content/patterns/running-total.mdx`);
  });

  it("maps the home page and static routes to their source files", () => {
    expect(getSourceUrl("/")).toBe(`${BLOB}src/app/page.tsx`);
    expect(getSourceUrl("/sample-tables")).toBe(`${BLOB}src/data/sample-tables.ts`);
    expect(getSourceUrl("/categories/table")).toBe(`${BLOB}src/app/categories/%5Bslug%5D/page.tsx`);
  });

  it("falls back to the repo home page for unknown routes", () => {
    expect(getSourceUrl("/not-a-page")).toBe(REPO_URL);
    expect(getSourceUrl("/functions/../../etc")).toBe(REPO_URL);
    expect(getSourceUrl("/functions/%E0%A4%A")).toBe(REPO_URL);
    expect(getSourceUrl(null)).toBe(`${BLOB}src/app/page.tsx`);
  });

  it("points every content page at a file that exists", () => {
    const routes = [
      ...getAllFunctionSlugs().map((s) => `/functions/${s}`),
      ...getAllConceptSlugs().map((s) => `/concepts/${s}`),
      ...getAllPatternSlugs().map((s) => `/patterns/${s}`),
    ];
    const missing = routes.filter((r) => {
      const url = getSourceUrl(r);
      return url === REPO_URL || !fs.existsSync(path.join(process.cwd(), toRepoPath(url)));
    });
    expect(missing).toEqual([]);
  });

  it("points every static route at a file that exists", () => {
    const routes = ["/", "/categories", "/concepts", "/format-m", "/learn", "/mcp", "/patterns", "/resources", "/sample-tables", "/categories/table"];
    for (const r of routes) {
      const url = getSourceUrl(r);
      expect(url, r).not.toBe(REPO_URL);
      expect(fs.existsSync(path.join(process.cwd(), toRepoPath(url))), r).toBe(true);
    }
  });
});
