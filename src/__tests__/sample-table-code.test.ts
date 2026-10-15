import { describe, it, expect } from "vitest";
import { sampleTables } from "@/data/sample-tables";
import { validateMCode } from "@/lib/formatter";
import {
  formatMValue,
  generateFromRecords,
  generateTmdl,
  generateWebContents,
} from "@/lib/sample-table-code";

const tables = Object.values(sampleTables);

describe("formatMValue", () => {
  it("keeps dates and datetimes exactly as written, whatever the time zone", () => {
    expect(formatMValue("2024-01-15", "date")).toBe("#date(2024, 1, 15)");
    expect(formatMValue("2024-01-15T09:30:00", "datetime")).toBe("#datetime(2024, 1, 15, 9, 30, 0)");
  });

  it("escapes double quotes in text the M way", () => {
    expect(formatMValue('Say "hi"', "text")).toBe('"Say ""hi"""');
  });

  it("writes nulls and logicals as M literals", () => {
    expect(formatMValue(null, "number")).toBe("null");
    expect(formatMValue(true, "logical")).toBe("true");
  });
});

describe("sample table M code", () => {
  it.each(tables.map((t) => [t.id, t] as const))("%s: both M options parse", async (_id, table) => {
    expect((await validateMCode(generateFromRecords(table))).valid).toBe(true);
    expect((await validateMCode(generateWebContents(table))).valid).toBe(true);
  });

  it("loads from the API route by table id", () => {
    expect(generateWebContents(sampleTables.Sales)).toContain('Web.Contents("https://pqm.guide/api/tables/Sales")');
  });
});

describe("sample table TMDL", () => {
  it.each(tables.map((t) => [t.id, t] as const))("%s: defines every column and an M partition", async (_id, table) => {
    const tmdl = generateTmdl(table);
    const lines = tmdl.split("\n");

    expect(lines[0]).toBe("createOrReplace");
    expect(lines).toContain(`\ttable ${table.id}`);
    for (const col of table.data.columns) {
      expect(lines).toContain(`\t\tcolumn ${col.name}`);
      expect(lines).toContain(`\t\t\tsourceColumn: ${col.name}`);
    }
    expect(lines).toContain(`\t\tpartition ${table.id} = m`);
    expect(lines).toContain("\t\t\tmode: import");

    // TMDL indents with tabs; a leading space would make the script fail to apply
    expect(lines.filter((l) => /^ /.test(l))).toEqual([]);

    // The partition's M is the Advanced Editor code, indented under `source =`
    const sourceAt = lines.indexOf("\t\t\tsource =");
    const embedded = lines
      .slice(sourceAt + 1)
      .filter((l) => l.length > 0)
      .map((l) => l.replace(/^\t{5}/, ""))
      .join("\n");
    expect(embedded).toBe(generateFromRecords(table));
    expect((await validateMCode(embedded)).valid).toBe(true);
  });

  it("maps column types to TMDL data types", () => {
    const tmdl = generateTmdl(sampleTables.Products);
    expect(tmdl).toMatch(/column ProductName\n\t\t\tdataType: string/);
    expect(tmdl).toMatch(/column Price\n\t\t\tdataType: double/);
    expect(tmdl).toMatch(/column InStock\n\t\t\tdataType: boolean/);
    expect(generateTmdl(sampleTables.Sales)).toMatch(
      /column OrderDate\n\t\t\tdataType: dateTime\n\t\t\tformatString: Long Date/
    );
  });
});
