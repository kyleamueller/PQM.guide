/**
 * Decides which M names in inline code and code blocks become links.
 *
 * Only names with a real page are linked. Anything else that looks like
 * `Name.Name` (an unknown function, a constant, a `CustomerID.1` column)
 * stays plain code instead of linking to a page that doesn't exist.
 */

const M_NAME_PATTERN = /^[A-Z][a-zA-Z]*\.[A-Z0-9][a-zA-Z0-9]*$/;

// Enum values have no page of their own, so link them to the page that explains them.
const ENUM_PAGES: Record<string, string> = {
  JoinKind: "/functions/table-join",
  Order: "/functions/table-sort",
  MissingField: "/concepts/missingfield-handling",
  TraceLevel: "/functions/diagnostics-trace",
};

export function getMNameHref(name: string, functionSlugs: ReadonlySet<string>): string | null {
  if (!M_NAME_PATTERN.test(name)) return null;
  const slug = name.toLowerCase().replace(".", "-");
  if (functionSlugs.has(slug)) return `/functions/${slug}`;
  return ENUM_PAGES[name.split(".")[0]] ?? null;
}

/** Links the builtin tokens in Prism-highlighted code that have a page. */
export function linkHighlightedCode(html: string, functionSlugs: ReadonlySet<string>): string {
  return html.replace(
    /<span class="token builtin">([^<]+)<\/span>/g,
    (span, name: string) => {
      const href = getMNameHref(name, functionSlugs);
      return href
        ? `<a href="${href}" class="token builtin fn-link" title="View ${name}">${name}</a>`
        : span;
    }
  );
}
