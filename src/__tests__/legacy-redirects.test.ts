import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
// Next.js's own matcher and destination builder, so rules resolve here exactly as they do on the server
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { prepareDestination } from "next/dist/shared/lib/router/utils/prepare-destination";
import { legacyRedirects } from "@/data/legacy-redirects";
import { categories } from "@/data/categories";
import { getAllFunctionSlugs, getAllConceptSlugs, getAllPatternSlugs } from "@/lib/mdx";

const matchers = legacyRedirects.map((rule) => ({
  rule,
  match: getPathMatch(rule.source, { strict: true, removeUnnamedParams: true }),
}));

// Where Next.js sends the path (first matching rule wins), or null if no rule matches
function resolve(pathname: string): string | null {
  for (const { rule, match } of matchers) {
    const params = match(pathname);
    if (params) {
      return prepareDestination({ appendParamsToQuery: false, destination: rule.destination, params, query: {} })
        .parsedDestination.pathname;
    }
  }
  return null;
}

const APP_DIR = path.join(process.cwd(), "src/app");

// Every page the site serves
const PAGES = new Set([
  "/",
  ...fs
    .readdirSync(APP_DIR)
    .filter((dir) => fs.existsSync(path.join(APP_DIR, dir, "page.tsx")))
    .map((dir) => `/${dir}`),
  ...getAllFunctionSlugs().map((s) => `/functions/${s}`),
  ...getAllConceptSlugs().map((s) => `/concepts/${s}`),
  ...getAllPatternSlugs().map((s) => `/patterns/${s}`),
  ...categories.map((c) => `/categories/${c.slug}`),
]);

// The busiest old addresses in Vercel Web Analytics (Apr 1 - Oct 16 2026, all
// countries), then the busiest of each other address shape
const BUSIEST_LEGACY_PATHS: [legacy: string, destination: string][] = [
  ["/time-functions/time-from.html", "/functions/time-from"],
  ["/duration-functions.html", "/categories/duration"],
  ["/number-functions.html", "/categories/number"],
  ["/table-functions/sharptable.html", "/functions/sharptable"],
  ["/number-functions/number-factorial.html", "/functions/number-factorial"],
  ["/value-functions/sqlexpression-schemafrom.html", "/functions/sqlexpression-schemafrom"],
  ["/number-functions/number-iseven.html", "/functions/number-iseven"],
  ["/number-functions/number-pi.html", "/categories/number"],
  ["/number-functions/number-positiveinfinity.html", "/categories/number"],
  ["/number-functions/number-rounddown.html", "/functions/number-rounddown"],
  ["/number-functions/number-roundup.html", "/functions/number-roundup"],
  ["/number-functions/number-sign.html", "/functions/number-sign"],
  ["/number-functions/number-totext.html", "/functions/number-totext"],
  ["/splitter-functions/splitter-splittextbydelimiter.html", "/functions/splitter-splittextbydelimiter"],
  ["/duration-functions/sharpduration.html", "/functions/sharpduration"],
  ["/number-functions/number-bitwiseor.html", "/functions/number-bitwiseor"],
  ["/number-functions/number-log10.html", "/functions/number-log10"],
  ["/number-functions/number-random.html", "/functions/number-random"],
  ["/number-functions/roundingmode-awayfromzero.html", "/functions/number-round"],
  ["/record-functions/geometry-towellknowntext.html", "/functions/geometry-towellknowntext"],
  ["/splitter-functions/splitter-splittextbyranges.html", "/functions/splitter-splittextbyranges"],
  ["/time-functions.html", "/categories/time"],
  ["/time-functions/time-startofhour.html", "/functions/time-startofhour"],
  ["/number-functions/number-nan.html", "/functions/number-isnan"],
  ["/datetimezone-functions", "/categories/datetimezone"],
  ["/functions/text-functions/text-startswith.html", "/functions/text-startswith"],
  ["/function-values", "/categories/function"],
  ["/index.html", "/"],
  ["/_sources/table-functions/table-distinct.md.txt", "/functions/table-distinct"],
  ["/_sources/record-functions/missingfield-usenull.md.txt", "/concepts/missingfield-handling"],
];

describe("legacy redirects", () => {
  it.each(BUSIEST_LEGACY_PATHS)("%s goes to %s", (legacy, destination) => {
    expect(resolve(legacy)).toBe(destination);
    expect(PAGES.has(destination), `${destination} is not a page`).toBe(true);
  });

  it("sends each function's old address to its page, not to a constant's target", () => {
    for (const slug of getAllFunctionSlugs()) {
      expect(resolve(`/number-functions/${slug}.html`), slug).toBe(`/functions/${slug}`);
    }
  });

  it("points every fixed destination at a page", () => {
    const missing = legacyRedirects
      .map((rule) => rule.destination)
      .filter((destination) => !destination.includes(":") && !PAGES.has(destination));
    expect(missing).toEqual([]);
  });

  // Also rules out chains: every destination is a page, so none redirects again
  it("never redirects a page the site serves", () => {
    const redirected = [...PAGES].filter((page) => resolve(page) !== null);
    expect(redirected).toEqual([]);
  });
});
