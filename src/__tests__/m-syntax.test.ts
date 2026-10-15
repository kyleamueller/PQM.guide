import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { validateMCode } from "@/lib/formatter";

const CONTENT_ROOT = path.join(process.cwd(), "src/content");

// Some concept and pattern pages show deliberate fragments rather than whole
// queries: several standalone expressions in one block, a few `Step = ...,`
// lines lifted out of a `let`, or a block of comments only. Those blocks can't
// parse on their own, so each page lists how many it is allowed. Function
// pages get no allowance: every example there should be runnable M.
// If you fix a fragment, lower its count; if you add one on purpose, raise it.
const ALLOWED_FRAGMENTS: Record<string, number> = {
  "concepts/common-errors.mdx": 2,
  "concepts/custom-functions.mdx": 1,
  "concepts/datetime-types.mdx": 4,
  "concepts/each-keyword.mdx": 1,
  "concepts/error-handling.mdx": 1,
  "concepts/getting-started.mdx": 1,
  "concepts/identifiers-and-scoping.mdx": 1,
  "concepts/literal-constructors.mdx": 1,
  "concepts/m-paradigm.mdx": 1,
  "concepts/null-handling.mdx": 3,
  "concepts/power-query-environments.mdx": 1,
  "concepts/sections-and-shared.mdx": 1,
  "concepts/structured-data.mdx": 1,
  "concepts/type-system.mdx": 1,
  "patterns/api-authentication.mdx": 2,
  "patterns/conditional-column-logic.mdx": 1,
  "patterns/custom-function-reuse.mdx": 1,
  "patterns/nested-json-xml.mdx": 1,
  "patterns/null-safe-operations.mdx": 5,
  "patterns/pagination-web-contents.mdx": 1,
  "patterns/parameterized-queries.mdx": 1,
  "patterns/pivot-unpivot.mdx": 1,
  "patterns/query-performance.mdx": 6,
  "patterns/table-joins.mdx": 1,
};

function powerQueryBlocks(file: string): string[] {
  const raw = fs.readFileSync(path.join(CONTENT_ROOT, file), "utf-8").replace(/\r\n/g, "\n");
  return [...raw.matchAll(/```powerquery\n([\s\S]*?)\n```/g)].map((m) => m[1]);
}

function contentFiles(): string[] {
  return ["functions", "concepts", "patterns"].flatMap((dir) =>
    fs
      .readdirSync(path.join(CONTENT_ROOT, dir))
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => `${dir}/${f}`)
  );
}

describe("M code blocks parse", () => {
  it("every ```powerquery block is valid M (outside each page's fragment allowance)", async () => {
    const problems: string[] = [];

    for (const file of contentFiles()) {
      const failures: string[] = [];
      for (const block of powerQueryBlocks(file)) {
        const result = await validateMCode(block);
        if (!result.valid) {
          const err = result.errors[0];
          const firstLine = block.split("\n")[0].slice(0, 60);
          failures.push(`line ${err.line} of block starting "${firstLine}": ${err.message.slice(0, 120)}`);
        }
      }

      const allowed = ALLOWED_FRAGMENTS[file] ?? 0;
      if (failures.length > allowed) {
        problems.push(
          `${file}: ${failures.length} block(s) don't parse, ${allowed} allowed as fragments\n    ` +
            failures.join("\n    ")
        );
      }
    }

    expect(problems, problems.join("\n")).toEqual([]);
  }, 120_000);

  it("fragment allowances only name pages that still have fragments", async () => {
    const stale: string[] = [];
    for (const [file, allowed] of Object.entries(ALLOWED_FRAGMENTS)) {
      if (!fs.existsSync(path.join(CONTENT_ROOT, file))) {
        stale.push(`${file}: file no longer exists`);
        continue;
      }
      let failing = 0;
      for (const block of powerQueryBlocks(file)) {
        if (!(await validateMCode(block)).valid) failing++;
      }
      if (failing < allowed) stale.push(`${file}: allows ${allowed} but only ${failing} fail; lower the count`);
    }
    expect(stale, stale.join("\n")).toEqual([]);
  }, 120_000);
});
