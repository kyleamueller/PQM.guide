import { describe, it, expect } from "vitest";
import { parseExamples, parseRemarks } from "@/app/api/functions/[slug]/route";

// ---------------------------------------------------------------------------
// parseRemarks
// ---------------------------------------------------------------------------

describe("parseRemarks", () => {
  it("extracts text between ## Remarks and ## Examples", () => {
    const content = "## Remarks\nThis is the remark.\n\n## Examples\n### Example 1: Foo";
    expect(parseRemarks(content)).toBe("This is the remark.");
  });

  it("extracts text between ## Remarks and ## Related", () => {
    const content = "## Remarks\nAnother remark.\n## Related\n- something";
    expect(parseRemarks(content)).toBe("Another remark.");
  });

  it("extracts text when ## Remarks is at end of content", () => {
    const content = "## Remarks\nFinal remark.";
    expect(parseRemarks(content)).toBe("Final remark.");
  });

  it("returns null when no ## Remarks section exists", () => {
    const content = "## Examples\n### Example 1: Foo\n```powerquery\nlet x = 1\n```";
    expect(parseRemarks(content)).toBeNull();
  });

  it("trims leading and trailing whitespace from extracted text", () => {
    const content = "## Remarks\n\n  Padded remark.  \n\n## Examples";
    expect(parseRemarks(content)).toBe("Padded remark.");
  });
});

// ---------------------------------------------------------------------------
// parseExamples
// ---------------------------------------------------------------------------

const SINGLE_EXAMPLE = `## Examples

### Example 1: Sum values

Calculate total quantity.

\`\`\`powerquery
let
    Total = List.Sum({1, 2, 3})
in
    Total
\`\`\`
`;

describe("parseExamples", () => {
  it("parses a single example with title and code", () => {
    const results = parseExamples(SINGLE_EXAMPLE);
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Sum values");
    expect(results[0].code).toContain("List.Sum");
  });

  it("trims whitespace from the code block", () => {
    const [ex] = parseExamples(SINGLE_EXAMPLE);
    expect(ex.code).not.toMatch(/^\s/);
    expect(ex.code).not.toMatch(/\s$/);
  });

  it("parses description from the first line after the heading", () => {
    const [ex] = parseExamples(SINGLE_EXAMPLE);
    expect(ex.description).toBe("Calculate total quantity.");
  });

  it("parses outputTable from HTML comment JSON block", () => {
    const content = `### Example 1: With output\n\nDescription here.\n\n\`\`\`powerquery\nlet x = 1 in x\n\`\`\`\n\n<!--output\n{"columns":[{"name":"Result","type":"number"}],"rows":[{"Result":1}]}\n-->\n`;
    const [ex] = parseExamples(content);
    expect(ex.outputTable).toBeDefined();
    expect(ex.outputTable?.columns[0].name).toBe("Result");
    expect(ex.outputTable?.rows[0]).toEqual({ Result: 1 });
  });

  it("parses inputTableRef from 'Input: `TableName`' syntax", () => {
    const content = `### Example 1: With input ref\n\nDesc.\n\nInput: \`Sales\`\n\n\`\`\`powerquery\nlet x = Sales in x\n\`\`\`\n`;
    const [ex] = parseExamples(content);
    expect(ex.inputTableRef).toBe("Sales");
  });

  it("parses multiple examples in sequence with correct titles", () => {
    const content = `### Example 1: First\n\nFirst desc.\n\n\`\`\`powerquery\nlet a = 1 in a\n\`\`\`\n\n### Example 2: Second\n\nSecond desc.\n\n\`\`\`powerquery\nlet b = 2 in b\n\`\`\`\n`;
    const results = parseExamples(content);
    expect(results).toHaveLength(2);
    expect(results[0].title).toBe("First");
    expect(results[1].title).toBe("Second");
  });

  it("returns empty array when no examples exist", () => {
    expect(parseExamples("## Remarks\nSome remark.\n")).toEqual([]);
  });

  it("skips examples that have no powerquery code block", () => {
    const content = "### Example 1: No code\n\nDescription only, no code block.\n";
    expect(parseExamples(content)).toEqual([]);
  });

  it("silently skips malformed JSON in output comment — no error thrown, outputTable undefined", () => {
    const content = `### Example 1: Bad JSON\n\nDesc.\n\n\`\`\`powerquery\nlet x = 1 in x\n\`\`\`\n\n<!--output\nNOT_VALID_JSON\n-->\n`;
    const results = parseExamples(content);
    expect(results).toHaveLength(1);
    expect(results[0].outputTable).toBeUndefined();
  });
});
