export const REPO_URL = "https://github.com/kyleamueller/PQM.guide";

const BLOB_BASE = `${REPO_URL}/blob/main`;

// Routes whose content lives in an MDX file under src/content/<section>/<slug>.mdx
const CONTENT_SECTIONS = new Set(["functions", "concepts", "patterns"]);

// Single-segment routes backed by src/app/<route>/page.tsx
const STATIC_ROUTES = new Set([
  "categories",
  "concepts",
  "format-m",
  "learn",
  "mcp",
  "patterns",
  "resources",
]);

/**
 * Returns the GitHub URL of the file that renders the given page, so the
 * GitHub icon can take contributors straight to it. Falls back to the repo
 * home page for routes we can't map (e.g. 404s).
 */
export function getSourceUrl(pathname: string | null | undefined): string {
  let segments: string[];
  try {
    segments = (pathname ?? "/").split("/").filter(Boolean).map(decodeURIComponent);
  } catch {
    return REPO_URL; // malformed percent-encoding in the URL
  }

  if (segments.length === 0) return `${BLOB_BASE}/src/app/page.tsx`;

  const [section, slug] = segments;
  const validSlug = slug !== undefined && /^[a-z0-9-]+$/.test(slug);

  if (segments.length === 2 && validSlug) {
    if (CONTENT_SECTIONS.has(section)) {
      return `${BLOB_BASE}/src/content/${section}/${slug}.mdx`;
    }
    if (section === "categories") {
      return `${BLOB_BASE}/src/app/categories/%5Bslug%5D/page.tsx`;
    }
  }

  // The sample tables page is generated from this data file, which is what contributors edit
  if (segments.length === 1 && section === "sample-tables") {
    return `${BLOB_BASE}/src/data/sample-tables.ts`;
  }

  if (segments.length === 1 && STATIC_ROUTES.has(section)) {
    return `${BLOB_BASE}/src/app/${section}/page.tsx`;
  }

  return REPO_URL;
}
