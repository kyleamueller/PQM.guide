import { describe, it, expect } from "vitest";
import { parseLet, renameSteps } from "@/lib/m-parser";
import { assignDescriptiveNames, resolveStepName } from "@/data/step-names";
import { POST } from "@/app/api/mcp/route";

// ---------------------------------------------------------------------------
// parseLet
// ---------------------------------------------------------------------------

describe("parseLet", () => {
  it("returns a single-step LetExpression with basic fields", async () => {
    const result = await parseLet("let Source = 1 in Source");
    expect(result).not.toBeNull();
    if (result === null) return;
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].identifier).toBe("Source");
    expect(result.steps[0].rawName).toBe("Source");
    expect(result.inTargetIdentifier).toBe("Source");
  });

  it("unwraps quoted identifiers on both LHS and `in`", async () => {
    const code = `let #"Filtered Rows" = 1 in #"Filtered Rows"`;
    const result = await parseLet(code);
    expect(result).not.toBeNull();
    if (result === null) return;
    expect(result.steps[0].identifier).toBe("Filtered Rows");
    expect(result.steps[0].rawName).toBe('#"Filtered Rows"');
    expect(result.inTargetIdentifier).toBe("Filtered Rows");
  });

  it("detects the top-level function call for steps whose RHS is an invocation", async () => {
    const code = `let
    Source = Excel.Workbook(File.Contents("x.xlsx")),
    Sheet1 = Source{[Item="Sheet1"]}[Data],
    Filtered = Table.SelectRows(Sheet1, each [Amount] > 100)
in
    Filtered`;
    const result = await parseLet(code);
    expect(result).not.toBeNull();
    if (result === null) return;
    expect(result.steps[0].callFunction).toBe("Excel.Workbook");
    expect(result.steps[1].callFunction).toBeUndefined();
    expect(result.steps[2].callFunction).toBe("Table.SelectRows");
  });

  it("captures RHS text including multi-line `each` bodies", async () => {
    const code = `let
    Source = Sales,
    Added = Table.AddColumn(Source, "Doubled", each [Amount] * 2)
in
    Added`;
    const result = await parseLet(code);
    expect(result).not.toBeNull();
    if (result === null) return;
    expect(result.steps[1].rhsText).toContain("Table.AddColumn");
    expect(result.steps[1].rhsText).toContain("each [Amount] * 2");
  });

  it("returns null for a bare expression", async () => {
    const result = await parseLet("{1, 2, 3}");
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// renameSteps
// ---------------------------------------------------------------------------

describe("renameSteps", () => {
  it("rewrites declaration LHS, references, and the `in` target", async () => {
    const code = `let
    Source = Sales,
    Step1 = Table.SelectRows(Source, each [Amount] > 100),
    Step2 = Table.Sort(Step1, {{"OrderDate", Order.Descending}})
in
    Step2`;
    const mapping = new Map([
      ["Step1", "Filtered Rows"],
      ["Step2", "Sorted Rows"],
    ]);
    const out = await renameSteps(code, mapping);
    expect(out).toContain('#"Filtered Rows" = Table.SelectRows(Source');
    expect(out).toContain('#"Sorted Rows" = Table.Sort(#"Filtered Rows"');
    expect(out.trimEnd()).toMatch(/#"Sorted Rows"$/);
  });

  it("accepts mapping keys given in #\"…\" form", async () => {
    const code = `let #"Old Name" = 1 in #"Old Name"`;
    const mapping = new Map([['#"Old Name"', "NewName"]]);
    const out = await renameSteps(code, mapping);
    expect(out).toContain("NewName = 1");
    expect(out).toMatch(/in\s+NewName/);
  });

  it("emits an unquoted identifier when the target is a valid M identifier", async () => {
    const code = `let #"Old Step" = 1 in #"Old Step"`;
    const out = await renameSteps(code, new Map([["Old Step", "NewStep"]]));
    expect(out).not.toContain('#"NewStep"');
    expect(out).toContain("NewStep = 1");
  });

  it("wraps in #\"…\" when the target contains invalid identifier characters", async () => {
    const code = `let Source = 1 in Source`;
    const out = await renameSteps(code, new Map([["Source", "Has Space"]]));
    expect(out).toContain('#"Has Space" = 1');
  });

  it("throws on rename collisions", async () => {
    const code = `let A = 1, B = 2 in B`;
    await expect(
      renameSteps(code, new Map([["A", "X"], ["B", "X"]]))
    ).rejects.toThrow(/collide/i);
  });
});

// ---------------------------------------------------------------------------
// assignDescriptiveNames (data helper — pure)
// ---------------------------------------------------------------------------

describe("assignDescriptiveNames", () => {
  it("assigns canonical PQ UI names based on the function called", () => {
    const mapping = assignDescriptiveNames([
      { identifier: "Source", callFunction: "Excel.Workbook" },
      { identifier: "Step1", callFunction: "Table.SelectRows" },
      { identifier: "Step2", callFunction: "Table.Sort" },
    ]);
    expect(mapping.get("Step1")).toBe("Filtered Rows");
    expect(mapping.get("Step2")).toBe("Sorted Rows");
    expect(mapping.has("Source")).toBe(false); // already canonical
  });

  it("keeps steps unchanged when the function isn't in the map", () => {
    const mapping = assignDescriptiveNames([
      { identifier: "MyStep", callFunction: "MyCustom.Function" },
    ]);
    expect(mapping.has("MyStep")).toBe(false);
  });

  it("appends PQ-style numeric suffixes on collisions in source order", () => {
    const mapping = assignDescriptiveNames([
      { identifier: "A", callFunction: "Table.SelectRows" },
      { identifier: "B", callFunction: "Table.SelectRows" },
      { identifier: "C", callFunction: "Table.SelectRows" },
    ]);
    expect(mapping.get("A")).toBe("Filtered Rows");
    expect(mapping.get("B")).toBe("Filtered Rows1");
    expect(mapping.get("C")).toBe("Filtered Rows2");
  });
});

// ---------------------------------------------------------------------------
// resolveStepName — argument-aware descriptive naming
// ---------------------------------------------------------------------------

describe("resolveStepName", () => {
  it("Table.AddColumn surfaces the new column name", () => {
    expect(
      resolveStepName("Table.AddColumn", [
        { kind: "other" },
        { kind: "string", value: "TotalPrice" },
        { kind: "other" },
      ])
    ).toBe("Added TotalPrice");
  });

  it("Table.AddColumn falls back to 'Added Custom' when the name is non-literal", () => {
    expect(
      resolveStepName("Table.AddColumn", [
        { kind: "other" },
        { kind: "other" },
        { kind: "other" },
      ])
    ).toBe("Added Custom");
  });

  it("Table.RemoveColumns surfaces a single removed column", () => {
    expect(
      resolveStepName("Table.RemoveColumns", [
        { kind: "other" },
        { kind: "stringList", values: ["GUID"] },
      ])
    ).toBe("Removed GUID");
  });

  it("Table.RemoveColumns joins up to 3 column names", () => {
    expect(
      resolveStepName("Table.RemoveColumns", [
        { kind: "other" },
        { kind: "stringList", values: ["A", "B", "C"] },
      ])
    ).toBe("Removed A, B, C");
  });

  it("Table.RemoveColumns compacts a long list with a `+ N more` suffix", () => {
    expect(
      resolveStepName("Table.RemoveColumns", [
        { kind: "other" },
        { kind: "stringList", values: ["A", "B", "C", "D", "E"] },
      ])
    ).toBe("Removed A + 4 more");
  });

  it("Table.RenameColumns spells out a single rename", () => {
    expect(
      resolveStepName("Table.RenameColumns", [
        { kind: "other" },
        { kind: "stringPairList", pairs: [["OldName", "NewName"]] },
      ])
    ).toBe("Renamed OldName to NewName");
  });

  it("Table.RenameColumns joins multiple renamed columns by source name", () => {
    expect(
      resolveStepName("Table.RenameColumns", [
        { kind: "other" },
        { kind: "stringPairList", pairs: [["A", "X"], ["B", "Y"]] },
      ])
    ).toBe("Renamed A, B");
  });

  it("Table.Sort surfaces the sort key from a pair list", () => {
    expect(
      resolveStepName("Table.Sort", [
        { kind: "other" },
        { kind: "stringFirstPairList", firsts: ["OrderDate"] },
      ])
    ).toBe("Sorted by OrderDate");
  });

  it("Table.TransformColumnTypes surfaces the type-changed columns", () => {
    expect(
      resolveStepName("Table.TransformColumnTypes", [
        { kind: "other" },
        { kind: "stringFirstPairList", firsts: ["Amount", "OrderDate"] },
      ])
    ).toBe("Changed Type of Amount, OrderDate");
  });

  it("Table.Group surfaces the grouping key", () => {
    expect(
      resolveStepName("Table.Group", [
        { kind: "other" },
        { kind: "stringList", values: ["Region"] },
        { kind: "other" },
      ])
    ).toBe("Grouped by Region");
  });

  it("Table.ExpandTableColumn surfaces the expanded column name", () => {
    expect(
      resolveStepName("Table.ExpandTableColumn", [
        { kind: "other" },
        { kind: "string", value: "Orders" },
        { kind: "other" },
        { kind: "other" },
      ])
    ).toBe("Expanded Orders");
  });

  it("Table.SelectColumns surfaces the kept columns", () => {
    expect(
      resolveStepName("Table.SelectColumns", [
        { kind: "other" },
        { kind: "stringList", values: ["Date", "Product", "Units"] },
      ])
    ).toBe("Kept Date, Product, Units");
  });

  it("Table.SelectColumns falls back to 'Removed Other Columns' with non-literal cols", () => {
    expect(
      resolveStepName("Table.SelectColumns", [
        { kind: "other" },
        { kind: "other" },
      ])
    ).toBe("Removed Other Columns");
  });

  it("returns null for functions not in the map", () => {
    expect(resolveStepName("MyCustom.Function", [])).toBeNull();
    expect(resolveStepName(undefined, undefined)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// parseLet — argument extraction from the outermost call
// ---------------------------------------------------------------------------

describe("parseLet argument extraction", () => {
  it("extracts a string literal from Table.AddColumn's column-name arg", async () => {
    const code = `let
    Source = Sales,
    Added = Table.AddColumn(Source, "TotalPrice", each [Quantity] * [UnitPrice])
in
    Added`;
    const result = await parseLet(code);
    expect(result).not.toBeNull();
    const step = result!.steps[1];
    expect(step.callFunction).toBe("Table.AddColumn");
    expect(step.callArgs?.[1]).toEqual({ kind: "string", value: "TotalPrice" });
    // First arg is a step reference — not a literal
    expect(step.callArgs?.[0]).toEqual({ kind: "other" });
    // Third arg is a lambda — not a literal
    expect(step.callArgs?.[2]).toEqual({ kind: "other" });
  });

  it("extracts a stringList from Table.RemoveColumns", async () => {
    const code = `let
    Source = Sales,
    Removed = Table.RemoveColumns(Source, {"A", "B", "C"})
in
    Removed`;
    const result = await parseLet(code);
    expect(result!.steps[1].callArgs?.[1]).toEqual({
      kind: "stringList",
      values: ["A", "B", "C"],
    });
  });

  it("extracts a stringPairList from Table.RenameColumns", async () => {
    const code = `let
    Source = Sales,
    Renamed = Table.RenameColumns(Source, {{"Old", "New"}, {"Foo", "Bar"}})
in
    Renamed`;
    const result = await parseLet(code);
    expect(result!.steps[1].callArgs?.[1]).toEqual({
      kind: "stringPairList",
      pairs: [
        ["Old", "New"],
        ["Foo", "Bar"],
      ],
    });
  });

  it("extracts a stringFirstPairList from Table.Sort with sort orders", async () => {
    const code = `let
    Source = Sales,
    Sorted = Table.Sort(Source, {{"OrderDate", Order.Descending}, {"Amount", Order.Ascending}})
in
    Sorted`;
    const result = await parseLet(code);
    expect(result!.steps[1].callArgs?.[1]).toEqual({
      kind: "stringFirstPairList",
      firsts: ["OrderDate", "Amount"],
    });
  });

  it("marks a step as compound when its outer call has a nested invocation", async () => {
    const code = `let
    Source = Sales,
    Both = Table.SelectRows(Table.AddColumn(Source, "X", each [Amount]), each [X] > 0)
in
    Both`;
    const result = await parseLet(code);
    expect(result!.steps[1].callFunction).toBe("Table.SelectRows");
    expect(result!.steps[1].compound).toBe(true);
  });

  it("does not mark a plain single-op step as compound", async () => {
    const code = `let
    Source = Sales,
    Added = Table.AddColumn(Source, "X", each [Amount])
in
    Added`;
    const result = await parseLet(code);
    expect(result!.steps[1].compound).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// End-to-end MCP tool tests — call the JSON-RPC POST handler directly
// ---------------------------------------------------------------------------

async function callMcpTool(name: string, args: Record<string, unknown>) {
  const req = new Request("http://localhost/api/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name, arguments: args },
      id: 1,
    }),
  });
  const res = await POST(req);
  const body = (await res.json()) as {
    result?: { content: Array<{ type: "text"; text: string }> };
    error?: { message: string };
  };
  if (body.error) throw new Error(body.error.message);
  return body.result!.content[0].text;
}

describe("MCP: comment_m_code", () => {
  const query = `let
    Source = Excel.Workbook(File.Contents("data.xlsx")),
    Sheet1 = Source{[Item="Sheet1"]}[Data],
    Filtered = Table.SelectRows(Sheet1, each [Amount] > 100)
in
    Filtered`;

  it("prepends a Query summary line above `let`", async () => {
    const out = await callMcpTool("comment_m_code", { code: query });
    expect(out).toMatch(/\/\/ Query summary: Source → Sheet1 → Filtered Rows/);
    expect(out).toMatch(/^```powerquery\n\/\/ Query summary:/);
  });

  it("adds a per-step comment for steps that call a documented function", async () => {
    const out = await callMcpTool("comment_m_code", { code: query });
    // Table.SelectRows is documented on pqm.guide.
    expect(out).toMatch(/\/\/[^\n]+\n\s+Filtered = Table\.SelectRows/);
  });

  it("does not add a per-step comment for a step whose RHS is not a function call", async () => {
    const out = await callMcpTool("comment_m_code", { code: query });
    // Sheet1 is record-field access; no `//` comment should sit directly above it.
    expect(out).not.toMatch(/\/\/[^\n]+\n\s+Sheet1 = Source/);
  });

  it("is idempotent when run twice", async () => {
    const once = await callMcpTool("comment_m_code", { code: query });
    const codeBlock = once.match(/```powerquery\n([\s\S]*?)\n```/)?.[1] ?? "";
    const twice = await callMcpTool("comment_m_code", { code: codeBlock });
    expect(twice).toBe(once);
  });

  it("errors cleanly on non-let input", async () => {
    const out = await callMcpTool("comment_m_code", { code: "{1, 2, 3}" });
    expect(out).toMatch(/only 'let/i);
  });

  it("propagates the formatter's line/column error on invalid input", async () => {
    const out = await callMcpTool("comment_m_code", { code: "let x = in" });
    expect(out).toMatch(/could not format/i);
  });
});

describe("MCP: rename_applied_steps", () => {
  const query = `let
    Source = Excel.Workbook(File.Contents("data.xlsx")),
    Step1 = Source{[Item="Sheet1"]}[Data],
    Step2 = Table.SelectRows(Step1, each [Amount] > 100),
    Step3 = Table.Sort(Step2, {{"OrderDate", Order.Descending}})
in
    Step3`;

  it("applies argument-aware descriptive names under style: descriptive", async () => {
    const out = await callMcpTool("rename_applied_steps", { code: query, style: "descriptive" });
    // Table.SelectRows has no arg-extractable label — falls back to "Filtered Rows"
    expect(out).toContain('#"Filtered Rows" = Table.SelectRows');
    // Table.Sort surfaces the sort key from its arg
    expect(out).toContain('#"Sorted by OrderDate" = Table.Sort');
    expect(out.trimEnd()).toMatch(/#"Sorted by OrderDate"\n```/);
  });

  it("keeps steps whose function isn't in the map (Step1)", async () => {
    const out = await callMcpTool("rename_applied_steps", { code: query, style: "descriptive" });
    expect(out).toContain("Step1 = Source");
  });

  it("suffixes collisions in descriptive mode", async () => {
    const code = `let
    A = Table.SelectRows(Sales, each [X] > 0),
    B = Table.SelectRows(A, each [Y] > 0)
in
    B`;
    const out = await callMcpTool("rename_applied_steps", { code, style: "descriptive" });
    expect(out).toContain('#"Filtered Rows" = Table.SelectRows(Sales');
    expect(out).toContain('#"Filtered Rows1" = Table.SelectRows(#"Filtered Rows"');
  });

  it("applies an explicit mapping", async () => {
    const out = await callMcpTool("rename_applied_steps", {
      code: query,
      mapping: { Step1: "Sheet", Step2: "MainFilter", Step3: "Final" },
    });
    expect(out).toContain("Sheet = Source");
    expect(out).toContain("MainFilter = Table.SelectRows(Sheet");
    expect(out).toContain("Final = Table.Sort(MainFilter");
    expect(out.trimEnd()).toMatch(/Final\n```/);
  });

  it("rejects an explicit mapping whose keys don't exist", async () => {
    const out = await callMcpTool("rename_applied_steps", {
      code: query,
      mapping: { NotAStep: "X" },
    });
    expect(out).toMatch(/does not match any step/i);
  });

  it("rejects an explicit mapping with a collision", async () => {
    const out = await callMcpTool("rename_applied_steps", {
      code: query,
      mapping: { Step1: "Same", Step2: "Same" },
    });
    expect(out).toMatch(/collide/i);
  });

  it("rejects if both mapping and style are provided", async () => {
    const out = await callMcpTool("rename_applied_steps", {
      code: query,
      mapping: { Step1: "X" },
      style: "descriptive",
    });
    expect(out).toMatch(/exactly one/i);
  });

  it("rejects if neither mapping nor style is provided", async () => {
    const out = await callMcpTool("rename_applied_steps", { code: query });
    expect(out).toMatch(/exactly one/i);
  });
});
