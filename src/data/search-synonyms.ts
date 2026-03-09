/**
 * Synonym map for MCP/search keyword augmentation.
 * Maps function slugs to additional terms an LLM or user might search for
 * using Excel, SQL, DAX, or plain-English vocabulary.
 *
 * Keep entries focused on concepts that are genuinely hard to find via
 * M function names/descriptions alone.
 */
export const functionSynonyms: Record<string, string> = {
  // Null / missing value handling
  "table-filldown": "null missing empty fill forward propagate",
  "table-fillup": "null missing empty fill backward",
  "list-removenulls": "null missing empty filter nulls",
  "list-replacevalue": "replace substitute swap null coalesce default",

  // Joins / lookups (Excel VLOOKUP users)
  "table-nestedjoin": "join merge vlookup lookup combine tables sql join",
  "table-join": "join merge vlookup lookup combine tables sql join",
  "table-fuzzyjoin": "fuzzy join approximate match fuzzy lookup fuzzy match",
  "table-fuzzygroupby": "fuzzy group deduplicate fuzzy cluster",
  "list-positionof": "find index of lookup search list indexOf",

  // Aggregation / summarization (Excel PivotTable users)
  "table-group": "group by aggregate summarize pivot sum by subtotal",
  "list-sum": "sum total add aggregate",
  "list-average": "average mean avg",
  "list-count": "count length how many size",
  "list-max": "max maximum largest biggest",
  "list-min": "min minimum smallest",
  "list-accumulate": "accumulate fold reduce running total aggregate window",

  // Text (Excel string function users)
  "text-combine": "concatenate concat join text combine merge strings",
  "text-trim": "trim strip clean whitespace leading trailing spaces",
  "text-split": "split delimiter divide parse text tokenize",
  "text-contains": "contains includes has substring find in text instr",
  "text-startswith": "starts with begins with prefix left starts",
  "text-endswith": "ends with suffix right ends",
  "text-replace": "replace substitute find replace",
  "text-length": "length len character count strlen size",
  "text-upper": "uppercase upper caps toupper",
  "text-lower": "lowercase lower tolower",
  "text-proper": "proper case title case capitalize",
  "text-padstart": "left pad padding pad text",
  "text-padend": "right pad padding",
  "text-removerange": "remove characters delete substring",

  // Date extraction (Excel YEAR/MONTH/DAY users)
  "date-year": "year extract year datepart year",
  "date-month": "month extract month datepart month",
  "date-day": "day extract day datepart day",
  "date-weekday": "weekday day of week",
  "date-from": "parse date convert to date date from text",
  "datetime-localNow": "now current datetime today timestamp",

  // Table filtering / shaping (SQL WHERE/SELECT users)
  "table-selectrows": "filter where select rows filter rows sql where",
  "table-addcolumn": "add column calculated column new column derive column computed",
  "table-removecolumns": "remove drop delete columns",
  "table-selectcolumns": "select columns keep columns project",
  "table-renamecolumns": "rename alias column name",
  "table-reordercolumns": "reorder move column order columns",
  "table-distinct": "distinct unique rows deduplicate remove duplicates",
  "table-rowcount": "count rows row count number of rows nrows len",
  "table-pivot": "pivot crosstab wide format rotate",
  "table-unpivot": "unpivot melt long format normalize stack",
  "table-unpivotothercol": "unpivot melt long format normalize stack",
  "table-transformcolumns": "transform apply function convert column",
  "table-transformcolumntypes": "change type set type data type cast schema",
  "table-sort": "sort order by rank ascending descending",
  "table-buffer": "buffer cache materialize prevent folding memory",

  // List generation / loops (programmers)
  "list-generate": "loop iterate while loop pagination sequence generate",
  "list-transform": "map apply function transform each",
  "list-select": "filter list where list select items",
  "list-distinct": "distinct unique deduplicate list",

  // Data access / connectors (API/web users)
  "web-contents": "web request http rest api fetch url api call endpoint",
  "json-document": "parse json json api response rest deserialize",
  "xml-document": "parse xml xml deserialize",
  "csv-document": "csv comma separated read csv import csv",
  "excel-workbook": "read excel xlsx import excel spreadsheet",

  // Type operations
  "value-is": "type check is type instanceof check type",
  "value-as": "type cast convert type as type coerce",
  "value-replacetype": "replace type change type annotate",

  // Number utilities
  "number-round": "round rounding banker round half up",
  "number-fromtext": "parse number convert to number text to number atoi",
  "number-totext": "format number number to text itoa",
};
