import { describe, it, expect } from "vitest";
import {
  getAllFunctionSlugs,
  getFunctionBySlug,
  getAllConceptSlugs,
  getConceptBySlug,
  getAllPatternSlugs,
  getPatternBySlug,
} from "@/lib/mdx";
import officialSpecSlugs from "./fixtures/official-spec-slugs.json";
import recentlyEditedData from "@/data/recently-edited.json";
import type { RecentlyEditedEntry } from "@/lib/types";

// All 661 official spec slugs are now documented — relatedFunctions must
// reference existing documented slugs only (no forward-reference fallback).

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

describe("Function MDX integrity", () => {
  const slugs = getAllFunctionSlugs();

  it("loads at least 100 function slugs", () => {
    expect(slugs.length).toBeGreaterThanOrEqual(100);
  });

  it("every function has required string frontmatter fields", () => {
    for (const slug of slugs) {
      const { frontmatter } = getFunctionBySlug(slug);
      expect(frontmatter.title, slug).toBeTruthy();
      expect(typeof frontmatter.title, slug).toBe("string");
      expect(frontmatter.description, slug).toBeTruthy();
      expect(typeof frontmatter.description, slug).toBe("string");
      expect(frontmatter.category, slug).toBeTruthy();
      expect(typeof frontmatter.category, slug).toBe("string");
      expect(frontmatter.syntax, slug).toBeTruthy();
      expect(typeof frontmatter.syntax, slug).toBe("string");
      expect(frontmatter.returnType, slug).toBeTruthy();
      expect(typeof frontmatter.returnType, slug).toBe("string");
    }
  });

  it("every function slug matches its filename", () => {
    for (const slug of slugs) {
      const { frontmatter } = getFunctionBySlug(slug);
      expect(frontmatter.slug, `${slug}: frontmatter.slug mismatch`).toBe(slug);
    }
  });

  it("every function parameters field is an array", () => {
    for (const slug of slugs) {
      const { frontmatter } = getFunctionBySlug(slug);
      expect(Array.isArray(frontmatter.parameters), slug).toBe(true);
    }
  });

  it("every function has a valid compatibility object with all 6 boolean keys", () => {
    const KEYS = [
      "pbiDesktop",
      "pbiService",
      "excelDesktop",
      "excelOnline",
      "dataflows",
      "fabricNotebooks",
    ] as const;
    for (const slug of slugs) {
      const { frontmatter } = getFunctionBySlug(slug);
      for (const key of KEYS) {
        expect(
          typeof frontmatter.compatibility[key],
          `${slug}.compatibility.${key}`
        ).toBe("boolean");
      }
    }
  });

  it("every function relatedFunctions is an array of strings referencing existing documented slugs", () => {
    const allSlugs = new Set(slugs);
    for (const slug of slugs) {
      const { frontmatter } = getFunctionBySlug(slug);
      expect(Array.isArray(frontmatter.relatedFunctions), slug).toBe(true);
      for (const ref of frontmatter.relatedFunctions) {
        expect(typeof ref, `${slug}: relatedFunctions item`).toBe("string");
        expect(
          allSlugs.has(ref),
          `${slug} references unknown slug: "${ref}" (not a documented function)`
        ).toBe(true);
      }
    }
  });

  it("every function content is non-empty and contains ## Examples", () => {
    for (const slug of slugs) {
      const { content } = getFunctionBySlug(slug);
      expect(typeof content, slug).toBe("string");
      expect(content.trim().length, `${slug}: empty content`).toBeGreaterThan(0);
      expect(content, `${slug}: missing ## Examples`).toContain("## Examples");
    }
  });

  it("every function slug exists in the official Power Query M spec", () => {
    const specSet = new Set(officialSpecSlugs);
    for (const slug of slugs) {
      expect(
        specSet.has(slug),
        `"${slug}" is not in the official Power Query M spec`
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Concepts
// ---------------------------------------------------------------------------

describe("Function example step chips", () => {
  const slugs = getAllFunctionSlugs();
  const exampleRegex = /### Example \d+:\s*(.+?)\n([\s\S]*?)(?=### Example \d+:|## |$)/g;
  const stepNameRegex = /^ {4}(#"[^"]+"|[A-Za-z_][\w.]*)\s*=(?![=>])/;

  // Top-level step names of an outer `let ... in` block, plus whether the
  // `in` clause is an expression rather than a bare step name.
  function parseLetSteps(code: string) {
    const lines = code.split("\n");
    if (lines[0]?.trim() !== "let") return null;
    const inIndex = lines.findIndex((l) => l.trim() === "in" && !l.startsWith(" "));
    if (inIndex < 0) return null;
    const names = lines
      .slice(1, inIndex)
      .map((l) => l.match(stepNameRegex)?.[1])
      .filter((n): n is string => !!n)
      .map((n) => (n.startsWith("#") ? n.slice(2, -1) : n));
    const inExpr = lines.slice(inIndex + 1).join(" ").trim().replace(/^#"(.*)"$/, "$1");
    return { names, inIsExpression: !names.includes(inExpr) };
  }

  function examplesOf(slug: string) {
    const { content } = getFunctionBySlug(slug);
    return [...content.matchAll(exampleRegex)].map((m) => {
      const body = m[2];
      return {
        id: `${slug} / ${m[1].trim()}`,
        code: body.match(/```powerquery\n([\s\S]*?)```/)?.[1].trim() ?? "",
        output: body.match(/<!--output\n([\s\S]*?)-->/)?.[1],
        steps: body.match(/<!--steps\n([\s\S]*?)-->/)?.[1],
      };
    });
  }

  it("every steps block is valid JSON with a unique name and output per step", () => {
    for (const slug of slugs) {
      for (const ex of examplesOf(slug)) {
        if (!ex.steps) continue;
        const parsed = JSON.parse(ex.steps) as { steps: { name: string; output: unknown }[] };
        expect(Array.isArray(parsed.steps), ex.id).toBe(true);
        const names = parsed.steps.map((s) => s.name);
        // Chip names are React keys in ExampleSection, so they must be unique.
        expect(new Set(names).size, `${ex.id} has duplicate chip names`).toBe(names.length);
        for (const step of parsed.steps) {
          expect(step.name, ex.id).toBeTruthy();
          expect(step.output, `${ex.id} / ${step.name}`).toBeTruthy();
        }
      }
    }
  });

  it("every multi-step example with an output table has step chips matching its let steps", () => {
    for (const slug of slugs) {
      for (const ex of examplesOf(slug)) {
        const let_ = parseLetSteps(ex.code);
        if (!let_ || !ex.output) continue;
        const stepCount = let_.names.length + (let_.inIsExpression ? 1 : 0);
        if (stepCount < 2) continue;
        expect(ex.steps, `${ex.id} is multi-step but has no <!--steps--> block`).toBeTruthy();
        const chips = (JSON.parse(ex.steps!) as { steps: { name: string; output: unknown }[] }).steps;
        const chipNames = chips.map((c) => c.name);
        for (const name of let_.names) {
          expect(chipNames, `${ex.id} has no chip for step "${name}"`).toContain(name);
        }
        expect(chips[chips.length - 1].output, `${ex.id} last chip should match the output table`).toEqual(
          JSON.parse(ex.output)
        );
      }
    }
  });
});

describe("Concept MDX integrity", () => {
  const slugs = getAllConceptSlugs();

  it("loads at least 10 concept slugs", () => {
    expect(slugs.length).toBeGreaterThanOrEqual(10);
  });

  it("every concept has title, description, and slug matching filename", () => {
    for (const slug of slugs) {
      const { frontmatter } = getConceptBySlug(slug);
      expect(frontmatter.title, `${slug}: title`).toBeTruthy();
      expect(typeof frontmatter.title, slug).toBe("string");
      expect(frontmatter.description, `${slug}: description`).toBeTruthy();
      expect(typeof frontmatter.description, slug).toBe("string");
      expect(frontmatter.slug, `${slug}: slug mismatch`).toBe(slug);
    }
  });
});

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------

describe("Pattern MDX integrity", () => {
  const slugs = getAllPatternSlugs();

  it("loads at least 5 pattern slugs", () => {
    expect(slugs.length).toBeGreaterThanOrEqual(5);
  });

  it("every pattern has valid difficulty and slug matching filename", () => {
    const VALID_DIFFICULTIES = ["beginner", "intermediate", "advanced"];
    for (const slug of slugs) {
      const { frontmatter } = getPatternBySlug(slug);
      expect(
        VALID_DIFFICULTIES,
        `${slug}: invalid difficulty "${frontmatter.difficulty}"`
      ).toContain(frontmatter.difficulty);
      expect(frontmatter.slug, `${slug}: slug mismatch`).toBe(slug);
    }
  });

  it("every pattern has non-empty title and description", () => {
    for (const slug of slugs) {
      const { frontmatter } = getPatternBySlug(slug);
      expect(frontmatter.title, `${slug}: title`).toBeTruthy();
      expect(frontmatter.description, `${slug}: description`).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// Recently Edited
// ---------------------------------------------------------------------------

describe("Recently Edited data integrity", () => {
  const entries = recentlyEditedData as RecentlyEditedEntry[];

  it("has between 1 and 6 entries", () => {
    expect(entries.length).toBeGreaterThanOrEqual(1);
    expect(entries.length).toBeLessThanOrEqual(6);
  });

  it("every entry has valid schema fields", () => {
    const validTypes = ["function", "concept", "pattern"];
    for (const entry of entries) {
      expect(typeof entry.slug, `slug type for ${entry.slug}`).toBe("string");
      expect(entry.slug.length, `slug empty`).toBeGreaterThan(0);
      expect(validTypes, `invalid type "${entry.type}"`).toContain(entry.type);
      expect(typeof entry.date, `date type for ${entry.slug}`).toBe("string");
      expect(
        /^\d{4}-\d{2}-\d{2}$/.test(entry.date),
        `invalid date format "${entry.date}" for ${entry.slug}`
      ).toBe(true);
      expect(
        isNaN(Date.parse(entry.date)),
        `unparseable date "${entry.date}" for ${entry.slug}`
      ).toBe(false);
      expect(typeof entry.description, `description type for ${entry.slug}`).toBe("string");
      expect(entry.description.length, `empty description for ${entry.slug}`).toBeGreaterThan(0);
    }
  });

  it("every entry slug references an existing content file", () => {
    const functionSlugs = new Set(getAllFunctionSlugs());
    const conceptSlugs = new Set(getAllConceptSlugs());
    const patternSlugs = new Set(getAllPatternSlugs());
    for (const entry of entries) {
      switch (entry.type) {
        case "function":
          expect(functionSlugs.has(entry.slug), `function slug "${entry.slug}" does not exist`).toBe(true);
          break;
        case "concept":
          expect(conceptSlugs.has(entry.slug), `concept slug "${entry.slug}" does not exist`).toBe(true);
          break;
        case "pattern":
          expect(patternSlugs.has(entry.slug), `pattern slug "${entry.slug}" does not exist`).toBe(true);
          break;
      }
    }
  });

  it("has no duplicate slug+type combinations", () => {
    const keys = entries.map((e) => `${e.type}/${e.slug}`);
    expect(new Set(keys).size, "duplicate entries found").toBe(keys.length);
  });

  it("entries are sorted newest-first", () => {
    for (let i = 1; i < entries.length; i++) {
      expect(
        entries[i - 1].date >= entries[i].date,
        `entries[${i - 1}] (${entries[i - 1].date}) should be >= entries[${i}] (${entries[i].date})`
      ).toBe(true);
    }
  });

  it("most recent entry is within the last 45 days", () => {
    const now = new Date();
    const newest = new Date(entries[0].date);
    const diffDays = (now.getTime() - newest.getTime()) / (1000 * 60 * 60 * 24);
    expect(
      diffDays,
      `most recent entry is ${Math.round(diffDays)} days old — update recently-edited.json`
    ).toBeLessThanOrEqual(45);
  });
});
