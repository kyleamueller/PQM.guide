/**
 * Curated map from M function name to the canonical Power Query UI step name
 * that the ribbon/editor assigns when the user performs the equivalent action.
 * Used by:
 *   - `rename_applied_steps` MCP tool in `style: "descriptive"` mode
 *   - `comment_m_code` MCP tool for the whole-query summary line
 *
 * Names deliberately match Power Query Editor conventions so they align with
 * user muscle memory (`Filtered Rows`, `Sorted Rows`, `Added Custom`, etc.).
 * Not derived from MDX frontmatter — the UI convention is a distinct fact
 * from the function's description.
 */
export const stepNames: Record<string, string> = {
  // Sources
  "Excel.Workbook": "Source",
  "Excel.CurrentWorkbook": "Source",
  "File.Contents": "Source",
  "Csv.Document": "Source",
  "Json.Document": "Source",
  "Xml.Tables": "Source",
  "Xml.Document": "Source",
  "Web.Contents": "Source",
  "Web.Page": "Source",
  "Sql.Database": "Source",
  "Sql.Databases": "Source",
  "Folder.Files": "Source",
  "Folder.Contents": "Source",
  "SharePoint.Files": "Source",
  "OData.Feed": "Source",

  // Row operations
  "Table.SelectRows": "Filtered Rows",
  "Table.Sort": "Sorted Rows",
  "Table.Distinct": "Removed Duplicates",
  "Table.RemoveRows": "Removed Top Rows",
  "Table.RemoveLastN": "Removed Bottom Rows",
  "Table.FirstN": "Kept First Rows",
  "Table.LastN": "Kept Last Rows",
  "Table.Range": "Kept Range of Rows",
  "Table.ReverseRows": "Reversed Rows",
  "Table.Skip": "Skipped Rows",
  "Table.RemoveRowsWithErrors": "Removed Errors",
  "Table.SelectRowsWithErrors": "Kept Errors",

  // Column operations
  "Table.RemoveColumns": "Removed Columns",
  "Table.SelectColumns": "Other Removed Columns",
  "Table.RenameColumns": "Renamed Columns",
  "Table.ReorderColumns": "Reordered Columns",
  "Table.AddColumn": "Added Custom",
  "Table.AddIndexColumn": "Added Index",
  "Table.DuplicateColumn": "Duplicated Column",
  "Table.SplitColumn": "Split Column by Delimiter",
  "Table.CombineColumns": "Merged Columns",

  // Type / transform
  "Table.TransformColumnTypes": "Changed Type",
  "Table.TransformColumns": "Transformed Columns",
  "Table.TransformColumnNames": "Transformed Column Names",
  "Table.ReplaceValue": "Replaced Value",
  "Table.ReplaceErrorValues": "Replaced Errors",
  "Table.PromoteHeaders": "Promoted Headers",
  "Table.DemoteHeaders": "Demoted Headers",
  "Table.FillDown": "Filled Down",
  "Table.FillUp": "Filled Up",

  // Aggregation / shape
  "Table.Group": "Grouped Rows",
  "Table.Pivot": "Pivoted Column",
  "Table.Unpivot": "Unpivoted Columns",
  "Table.UnpivotOtherColumns": "Unpivoted Other Columns",
  "Table.Transpose": "Transposed Table",

  // Joins / combine
  "Table.NestedJoin": "Merged Queries",
  "Table.Join": "Joined Tables",
  "Table.Combine": "Appended Query",
  "Table.ExpandTableColumn": "Expanded Table Column",
  "Table.ExpandRecordColumn": "Expanded Record Column",
  "Table.ExpandListColumn": "Expanded List Column",

  // Navigation into a Source (rarely descriptively renamed; kept for the
  // whole-query summary chain)
  "Table.FromRecords": "Converted to Table",
  "Table.FromList": "Converted to Table",
  "Table.ToRecords": "Converted to Records",

  // Text (used inside Table.TransformColumns; still shows up when a query is
  // just a text pipeline)
  "Text.Combine": "Combined Text",
  "Text.Split": "Split Text",
  "Text.Trim": "Trimmed Text",
  "Text.Upper": "Uppercased Text",
  "Text.Lower": "Lowercased Text",
  "Text.Proper": "Capitalized Each Word",
};

/**
 * Assign descriptive step names based on `stepNames`, preserving source order.
 *
 * Rules:
 *   - Existing names that are already the canonical target are kept (idempotent).
 *   - Steps whose function isn't in the map keep their existing name.
 *   - When multiple steps map to the same canonical name, Power Query's
 *     numbering convention is applied: `Filtered Rows`, `Filtered Rows1`,
 *     `Filtered Rows2` … (no space between name and index).
 *   - The result never reuses a name that already exists on a preceding step
 *     (whether that name came from the map or from the input).
 */
export function assignDescriptiveNames(
  steps: ReadonlyArray<{ identifier: string; callFunction?: string }>
): Map<string, string> {
  const mapping = new Map<string, string>();
  const used = new Set<string>();

  const proposed = steps.map((s) => {
    const canonical = s.callFunction ? stepNames[s.callFunction] : undefined;
    return canonical ?? s.identifier;
  });

  // First pass: reserve names that are already unique-as-is so we don't
  // clobber an input where the user already had good names.
  proposed.forEach((name, i) => {
    if (proposed.indexOf(name) === i && proposed.lastIndexOf(name) === i) {
      used.add(name);
      if (name !== steps[i].identifier) mapping.set(steps[i].identifier, name);
    }
  });

  // Second pass: handle collisions with PQ-style numeric suffixes.
  proposed.forEach((name, i) => {
    if (used.has(name) && mapping.get(steps[i].identifier) === name) return;
    if (used.has(name) && steps[i].identifier === name) return;

    let candidate = name;
    let suffix = 1;
    while (used.has(candidate)) {
      candidate = `${name}${suffix}`;
      suffix++;
    }
    used.add(candidate);
    if (candidate !== steps[i].identifier) mapping.set(steps[i].identifier, candidate);
  });

  return mapping;
}
