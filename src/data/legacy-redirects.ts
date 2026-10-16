/**
 * Permanent redirects for the documentation site that used to live on this
 * domain. It was a Sphinx build with addresses like
 * /number-functions/number-abs.html, and search engines still send people to
 * them. next.config.ts serves these rules; they live here so they can be tested.
 *
 * Built from the old addresses seen in Vercel Web Analytics, April to October
 * 2026. Next.js uses the first rule that matches, so the constant rules come
 * before the generic function page rules.
 */

export interface LegacyRedirect {
  source: string;
  destination: string;
  permanent: true;
}

// The old site's folders, and the page that replaced each folder's index page
const LEGACY_FOLDERS: Record<string, string> = {
  "accessing-data-functions": "/categories/accessing-data",
  "binary-functions": "/categories/binary",
  "combiner-functions": "/categories/combiner",
  "comparer-functions": "/categories/comparer",
  "date-functions": "/categories/date",
  "datetime-functions": "/categories/datetime",
  "datetimezone-functions": "/categories/datetimezone",
  "duration-functions": "/categories/duration",
  "error-handling": "/concepts/error-handling",
  "expression-functions": "/categories/expression",
  "function-values": "/categories/function",
  "lines-functions": "/categories/lines",
  "list-functions": "/categories/list",
  "logical-functions": "/categories/logical",
  "number-functions": "/categories/number",
  "record-functions": "/categories/record",
  "replacer-functions": "/categories/replacer",
  "splitter-functions": "/categories/splitter",
  "table-functions": "/categories/table",
  "text-functions": "/categories/text",
  "time-functions": "/categories/time",
  "type-functions": "/categories/type",
  "uri-functions": "/categories/uri",
  "value-functions": "/categories/value",
};

// Old pages for constants and enum values, which have no page of their own
// here. Each goes to the page that explains it, or else to its category.
// A trailing * covers every value of the enum.
const LEGACY_CONSTANTS: Record<string, string> = {
  "number-pi": "/categories/number",
  "number-e": "/functions/number-exp",
  "number-epsilon": "/categories/number",
  "number-nan": "/functions/number-isnan",
  "number-positiveinfinity": "/categories/number",
  "number-negativeinfinity": "/categories/number",
  "roundingmode-*": "/functions/number-round",
  "precision-*": "/functions/value-add",
  "culture-current": "/functions/comparer-fromculture",
  "day-*": "/functions/date-dayofweek",
  "relativeposition-*": "/functions/text-afterdelimiter",
  "textencoding-*": "/functions/text-frombinary",
  "quotestyle-*": "/functions/splitter-splittextbydelimiter",
  "csvstyle-*": "/functions/csv-document",
  "percentilemode-*": "/functions/list-percentile",
  "missingfield-*": "/concepts/missingfield-handling",
  "joinkind-*": "/functions/table-join",
  "joinalgorithm-*": "/functions/table-join",
  "joinside-*": "/categories/table",
  "compression-*": "/functions/binary-decompress",
  "binaryoccurrence-*": "/functions/binaryformat-group",
  "occurrence-required": "/functions/binaryformat-group",
  "accesscontrolkind-*": "/categories/accessing-data",
  "saphanarangeoperator-*": "/functions/saphana-database",
};

const LEGACY_SITE_PAGES: Record<string, string> = {
  "/index.html": "/",
  "/search.html": "/",
  "/_sources/index.rst.txt": "/",
  "/functions": "/categories", // there is no /functions index page
};

const FOLDER = `:folder(${Object.keys(LEGACY_FOLDERS).join("|")})`;

// The three addresses an old function page had: the page, the same page
// under /functions/, and its Markdown source
function functionPageSources(name: string): string[] {
  return [
    `/${FOLDER}/${name}.html`,
    `/functions/${FOLDER}/${name}.html`,
    `/_sources/${FOLDER}/${name}.md.txt`,
  ];
}

function redirectsTo(destination: string, sources: string[]): LegacyRedirect[] {
  return sources.map((source) => ({ source, destination, permanent: true }));
}

// One pattern per destination, e.g. :name(number-pi|number-epsilon|...)
const constantNamesByDestination = new Map<string, string[]>();
for (const [name, destination] of Object.entries(LEGACY_CONSTANTS)) {
  const names = constantNamesByDestination.get(destination) ?? [];
  names.push(name.replace("*", "[^/]+"));
  constantNamesByDestination.set(destination, names);
}

export const legacyRedirects: LegacyRedirect[] = [
  ...Object.entries(LEGACY_SITE_PAGES).flatMap(([source, destination]) =>
    redirectsTo(destination, [source]),
  ),
  ...[...constantNamesByDestination].flatMap(([destination, names]) =>
    redirectsTo(destination, functionPageSources(`:name(${names.join("|")})`)),
  ),
  ...redirectsTo("/functions/:name", functionPageSources(":name")),
  ...Object.entries(LEGACY_FOLDERS).flatMap(([folder, destination]) =>
    redirectsTo(destination, [`/${folder}`, `/${folder}.html`, `/_sources/${folder}.rst.txt`]),
  ),
];
