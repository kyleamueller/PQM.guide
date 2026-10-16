/**
 * Rules that map an M function call to a descriptive Power Query UI-style step
 * name. Each rule has a `fallback` (used when no argument information is
 * available) and an optional `from(args)` that produces a more specific name
 * by inspecting the outermost call's arguments.
 *
 * Design goals:
 *   - Match PQ's own verb-first past-tense convention (Filtered Rows,
 *     Sorted Rows, Added Custom …).
 *   - When the column name / target is a literal in the call, surface it —
 *     `Table.AddColumn(_, "TotalPrice", …)` → "Added TotalPrice", not just
 *     "Added Custom".
 *   - For steps whose RHS contains nested calls, `compound` is set by the
 *     parser. Rules that can meaningfully describe the outer op still do so;
 *     callers who care about the inner ops can surface the compound flag
 *     separately.
 *   - Never invent detail we can't verify from the AST. If a rule can't
 *     extract a literal, it returns null and the fallback is used.
 *
 * Used by:
 *   - `rename_applied_steps` MCP tool in `style: "descriptive"` mode
 *   - `comment_m_code` MCP tool for the whole-query summary line
 */

import type { CallArg } from "@/lib/m-parser";

export type NameRule = {
  /** Used when no arg-based rule matches (e.g. args are all nested calls). */
  fallback: string;
  /** Optional arg-aware override. Return null to fall back. */
  from?: (args: CallArg[]) => string | null;
};

function joinCols(names: string[], verb: string): string {
  if (names.length === 0) return `${verb} Columns`;
  if (names.length === 1) return `${verb} ${names[0]}`;
  if (names.length <= 3) return `${verb} ${names.join(", ")}`;
  return `${verb} ${names[0]} + ${names.length - 1} more`;
}

/** Extract a single column-name string from arg position `idx`. */
function stringAt(args: CallArg[], idx: number): string | null {
  const a = args[idx];
  return a?.kind === "string" ? a.value : null;
}

export const stepNames: Record<string, NameRule> = {
  // ---- Sources ----
  "Excel.Workbook": { fallback: "Source" },
  "Excel.CurrentWorkbook": { fallback: "Source" },
  "File.Contents": { fallback: "Source" },
  "Csv.Document": { fallback: "Source" },
  "Json.Document": { fallback: "Source" },
  "Xml.Tables": { fallback: "Source" },
  "Xml.Document": { fallback: "Source" },
  "Web.Contents": { fallback: "Source" },
  "Web.Page": { fallback: "Source" },
  "Sql.Database": { fallback: "Source" },
  "Sql.Databases": { fallback: "Source" },
  "Folder.Files": { fallback: "Source" },
  "Folder.Contents": { fallback: "Source" },
  "SharePoint.Files": { fallback: "Source" },
  "OData.Feed": { fallback: "Source" },

  // ---- Row operations ----
  "Table.SelectRows": {
    // Filter conditions are lambdas, not literals — no reliable arg extraction.
    // A future improvement could inspect an `each [Col] > x` pattern to say
    // "Filtered by Col", but that pattern-matches an anonymous function which
    // is fragile. Stay honest with the generic label.
    fallback: "Filtered Rows",
  },
  "Table.Sort": {
    fallback: "Sorted Rows",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringFirstPairList" && a.firsts.length > 0) {
        return joinCols(a.firsts, "Sorted by");
      }
      if (a?.kind === "stringPairList" && a.pairs.length > 0) {
        return joinCols(a.pairs.map((p) => p[0]), "Sorted by");
      }
      if (a?.kind === "string") return `Sorted by ${a.value}`;
      return null;
    },
  },
  "Table.Distinct": { fallback: "Removed Duplicates" },
  "Table.RemoveRows": { fallback: "Removed Top Rows" },
  "Table.RemoveLastN": { fallback: "Removed Bottom Rows" },
  "Table.FirstN": { fallback: "Kept First Rows" },
  "Table.LastN": { fallback: "Kept Last Rows" },
  "Table.Range": { fallback: "Kept Range of Rows" },
  "Table.ReverseRows": { fallback: "Reversed Rows" },
  "Table.Skip": { fallback: "Skipped Rows" },
  "Table.RemoveRowsWithErrors": { fallback: "Removed Errors" },
  "Table.SelectRowsWithErrors": { fallback: "Kept Errors" },

  // ---- Column operations ----
  "Table.RemoveColumns": {
    fallback: "Removed Columns",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringList") return joinCols(a.values, "Removed");
      if (a?.kind === "string") return `Removed ${a.value}`;
      return null;
    },
  },
  "Table.SelectColumns": {
    fallback: "Removed Other Columns",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringList" && a.values.length > 0) {
        return joinCols(a.values, "Kept");
      }
      if (a?.kind === "string") return `Kept ${a.value}`;
      return null;
    },
  },
  "Table.RenameColumns": {
    fallback: "Renamed Columns",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringPairList" && a.pairs.length > 0) {
        if (a.pairs.length === 1) {
          return `Renamed ${a.pairs[0][0]} to ${a.pairs[0][1]}`;
        }
        return joinCols(a.pairs.map((p) => p[0]), "Renamed");
      }
      return null;
    },
  },
  "Table.ReorderColumns": {
    fallback: "Reordered Columns",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringList") return joinCols(a.values, "Reordered");
      return null;
    },
  },
  "Table.AddColumn": {
    fallback: "Added Custom",
    from: (args) => {
      const name = stringAt(args, 1);
      return name ? `Added ${name}` : null;
    },
  },
  "Table.AddIndexColumn": {
    fallback: "Added Index",
    from: (args) => {
      const name = stringAt(args, 1);
      return name ? `Added Index ${name}` : null;
    },
  },
  "Table.DuplicateColumn": {
    fallback: "Duplicated Column",
    from: (args) => {
      const source = stringAt(args, 1);
      const target = stringAt(args, 2);
      if (source && target) return `Duplicated ${source} as ${target}`;
      if (source) return `Duplicated ${source}`;
      return null;
    },
  },
  "Table.SplitColumn": {
    fallback: "Split Column by Delimiter",
    from: (args) => {
      const name = stringAt(args, 1);
      return name ? `Split ${name}` : null;
    },
  },
  "Table.CombineColumns": {
    fallback: "Merged Columns",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringList") return joinCols(a.values, "Merged");
      return null;
    },
  },

  // ---- Type / transform ----
  "Table.TransformColumnTypes": {
    fallback: "Changed Type",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringFirstPairList" && a.firsts.length > 0) {
        return joinCols(a.firsts, "Changed Type of");
      }
      if (a?.kind === "stringPairList" && a.pairs.length > 0) {
        return joinCols(a.pairs.map((p) => p[0]), "Changed Type of");
      }
      return null;
    },
  },
  "Table.TransformColumns": {
    fallback: "Transformed Columns",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringFirstPairList" && a.firsts.length > 0) {
        return joinCols(a.firsts, "Transformed");
      }
      if (a?.kind === "stringPairList" && a.pairs.length > 0) {
        return joinCols(a.pairs.map((p) => p[0]), "Transformed");
      }
      return null;
    },
  },
  "Table.TransformColumnNames": { fallback: "Transformed Column Names" },
  "Table.ReplaceValue": {
    fallback: "Replaced Value",
    from: (args) => {
      const oldV = stringAt(args, 1);
      const newV = stringAt(args, 2);
      if (oldV !== null && newV !== null) return `Replaced "${oldV}" with "${newV}"`;
      return null;
    },
  },
  "Table.ReplaceErrorValues": { fallback: "Replaced Errors" },
  "Table.PromoteHeaders": { fallback: "Promoted Headers" },
  "Table.DemoteHeaders": { fallback: "Demoted Headers" },
  "Table.FillDown": {
    fallback: "Filled Down",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringList") return joinCols(a.values, "Filled Down");
      return null;
    },
  },
  "Table.FillUp": {
    fallback: "Filled Up",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringList") return joinCols(a.values, "Filled Up");
      return null;
    },
  },

  // ---- Aggregation / shape ----
  "Table.Group": {
    fallback: "Grouped Rows",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringList" && a.values.length > 0) {
        return joinCols(a.values, "Grouped by");
      }
      if (a?.kind === "string") return `Grouped by ${a.value}`;
      return null;
    },
  },
  "Table.Pivot": {
    fallback: "Pivoted Column",
    from: (args) => {
      const a = args[2];
      if (a?.kind === "string") return `Pivoted ${a.value}`;
      return null;
    },
  },
  "Table.Unpivot": {
    fallback: "Unpivoted Columns",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringList") return joinCols(a.values, "Unpivoted");
      return null;
    },
  },
  "Table.UnpivotOtherColumns": {
    fallback: "Unpivoted Other Columns",
    from: (args) => {
      const a = args[1];
      if (a?.kind === "stringList") return joinCols(a.values, "Unpivoted Other than");
      return null;
    },
  },
  "Table.Transpose": { fallback: "Transposed Table" },

  // ---- Joins / combine ----
  "Table.NestedJoin": { fallback: "Merged Queries" },
  "Table.Join": { fallback: "Joined Tables" },
  "Table.Combine": { fallback: "Appended Query" },
  "Table.ExpandTableColumn": {
    fallback: "Expanded Table Column",
    from: (args) => {
      const name = stringAt(args, 1);
      return name ? `Expanded ${name}` : null;
    },
  },
  "Table.ExpandRecordColumn": {
    fallback: "Expanded Record Column",
    from: (args) => {
      const name = stringAt(args, 1);
      return name ? `Expanded ${name}` : null;
    },
  },
  "Table.ExpandListColumn": {
    fallback: "Expanded List Column",
    from: (args) => {
      const name = stringAt(args, 1);
      return name ? `Expanded ${name}` : null;
    },
  },

  // ---- Navigation ----
  "Table.FromRecords": { fallback: "Converted to Table" },
  "Table.FromList": { fallback: "Converted to Table" },
  "Table.ToRecords": { fallback: "Converted to Records" },

  // ---- Text ----
  "Text.Combine": { fallback: "Combined Text" },
  "Text.Split": { fallback: "Split Text" },
  "Text.Trim": { fallback: "Trimmed Text" },
  "Text.Upper": { fallback: "Uppercased Text" },
  "Text.Lower": { fallback: "Lowercased Text" },
  "Text.Proper": { fallback: "Capitalized Each Word" },
};

/**
 * Resolve the descriptive name for a step whose outermost call is `fn` with
 * `args`. Returns `null` when the function isn't known — callers should
 * preserve the step's existing identifier in that case.
 */
export function resolveStepName(
  fn: string | undefined,
  args: CallArg[] | undefined
): string | null {
  if (!fn) return null;
  const rule = stepNames[fn];
  if (!rule) return null;
  if (rule.from && args) {
    const specific = rule.from(args);
    if (specific !== null) return specific;
  }
  return rule.fallback;
}

/**
 * Assign descriptive step names based on `stepNames`, preserving source order.
 *
 * Rules:
 *   - Existing names that are already the canonical target are kept
 *     (idempotent).
 *   - Steps whose function isn't in the map keep their existing name.
 *   - When multiple steps map to the same canonical name, Power Query's
 *     numbering convention is applied: `Filtered Rows`, `Filtered Rows1`,
 *     `Filtered Rows2` … (no space between name and index).
 *   - The result never reuses a name that already exists on a preceding step
 *     (whether that name came from the map or from the input).
 */
export function assignDescriptiveNames(
  steps: ReadonlyArray<{ identifier: string; callFunction?: string; callArgs?: CallArg[] }>
): Map<string, string> {
  const mapping = new Map<string, string>();
  const used = new Set<string>();

  const proposed = steps.map((s) => {
    const name = resolveStepName(s.callFunction, s.callArgs);
    return name ?? s.identifier;
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
