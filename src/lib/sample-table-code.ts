/**
 * Generates copy-paste code that recreates a sample table in the user's own
 * tools: M for the Advanced Editor, M that loads the table from the site's
 * API, and a TMDL script for Power BI Desktop's TMDL view.
 */

import { PQColumnType, SampleTable } from "@/lib/types";

const M_TYPES: Record<PQColumnType, string> = {
  text: "type text",
  number: "type number",
  date: "type date",
  datetime: "type datetime",
  datetimezone: "type datetimezone",
  time: "type time",
  duration: "type duration",
  logical: "type logical",
  any: "type any",
};

// Reads the parts straight from the ISO string ("2024-01-15" or
// "2024-01-15T09:30:00") rather than through Date, which would shift the
// value into the viewer's time zone.
function isoParts(value: string): number[] {
  return (value.match(/\d+/g) ?? []).map(Number);
}

export function formatMValue(value: unknown, type: string): string {
  if (value === null || value === undefined) return "null";
  switch (type) {
    case "text":
      return `"${String(value).replace(/"/g, '""')}"`;
    case "date": {
      const [y, m, d] = isoParts(String(value));
      return `#date(${y}, ${m}, ${d})`;
    }
    case "datetime": {
      const [y, m, d, hh = 0, mm = 0, ss = 0] = isoParts(String(value));
      return `#datetime(${y}, ${m}, ${d}, ${hh}, ${mm}, ${ss})`;
    }
    case "logical":
      return value ? "true" : "false";
    default:
      return String(value);
  }
}

/** M that builds the table inline with Table.FromRecords, ready for the Advanced Editor. */
export function generateFromRecords(table: SampleTable): string {
  const { columns, rows } = table.data;
  const records = rows.map((row) => {
    const fields = columns.map((col) => `${col.name} = ${formatMValue(row[col.name], col.type)}`);
    return `        [${fields.join(", ")}]`;
  });

  const typeTransforms = columns.map(
    (col) => `{"${col.name}", ${M_TYPES[col.type] ?? "type any"}}`
  );

  return `let
    Source = Table.FromRecords({
${records.join(",\n")}
    }),
    Typed = Table.TransformColumnTypes(Source, {${typeTransforms.join(", ")}})
in
    Typed`;
}

/** M that loads the table from the pqm.guide API. */
export function generateWebContents(table: SampleTable): string {
  const typeTransforms = table.data.columns.map(
    (col) => `{"${col.name}", ${M_TYPES[col.type] ?? "type any"}}`
  );
  return `let
    Source = Json.Document(
        Web.Contents("https://pqm.guide/api/tables/${table.id}")
    ),
    AsTable = Table.FromRecords(Source[rows]),
    Typed = Table.TransformColumnTypes(AsTable, {${typeTransforms.join(", ")}})
in
    Typed`;
}

// TMDL data types for each M column type, as Power BI Desktop writes them
const TMDL_TYPES: Partial<Record<PQColumnType, string>> = {
  text: "string",
  number: "double",
  date: "dateTime",
  datetime: "dateTime",
  datetimezone: "dateTime",
  logical: "boolean",
};

/**
 * A TMDL script for Power BI Desktop's TMDL view. Applying it creates (or
 * replaces) an import table whose partition runs the same M as
 * generateFromRecords, so the data refreshes with no external source.
 */
export function generateTmdl(table: SampleTable): string {
  const tab = "\t";
  const lines: string[] = ["createOrReplace", "", `${tab}table ${table.id}`, ""];

  for (const col of table.data.columns) {
    const isNumeric = col.type === "number";
    const isId = /id$/i.test(col.name);
    lines.push(`${tab.repeat(2)}column ${col.name}`);
    lines.push(`${tab.repeat(3)}dataType: ${TMDL_TYPES[col.type] ?? "string"}`);
    if (col.type === "date") lines.push(`${tab.repeat(3)}formatString: Long Date`);
    if (col.type === "datetime") lines.push(`${tab.repeat(3)}formatString: General Date`);
    lines.push(`${tab.repeat(3)}summarizeBy: ${isNumeric && !isId ? "sum" : "none"}`);
    lines.push(`${tab.repeat(3)}sourceColumn: ${col.name}`);
    if (col.type === "date") {
      lines.push("");
      lines.push(`${tab.repeat(3)}annotation UnderlyingDateTimeDataType = Date`);
    }
    lines.push("");
  }

  lines.push(`${tab.repeat(2)}partition ${table.id} = m`);
  lines.push(`${tab.repeat(3)}mode: import`);
  lines.push(`${tab.repeat(3)}source =`);
  for (const mLine of generateFromRecords(table).split("\n")) {
    lines.push(`${tab.repeat(5)}${mLine}`);
  }

  return lines.join("\n") + "\n";
}
