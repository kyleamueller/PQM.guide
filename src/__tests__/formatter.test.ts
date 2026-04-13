import { describe, it, expect } from "vitest";
import { formatMCode, validateMCode } from "@/lib/formatter";

describe("formatMCode", () => {
  it("formats a well-formed let…in query", async () => {
    const result = await formatMCode("let x=1,y=2 in x+y");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.formatted).toContain("let");
      expect(result.formatted).toContain("in");
      expect(result.formatted).toContain("x = 1");
      expect(result.formatted).toContain("y = 2");
      // Uses Unix newlines, no trailing whitespace
      expect(result.formatted).not.toContain("\r");
      expect(result.formatted).toBe(result.formatted.trimEnd());
    }
  });

  it("formats a bare expression", async () => {
    const result = await formatMCode("{1,2,3}");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.formatted).toBe("{1, 2, 3}");
    }
  });

  it("returns a structured error with line/column for invalid M", async () => {
    const result = await formatMCode("let x = in");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message.length).toBeGreaterThan(0);
      expect(result.error.line).toBeGreaterThanOrEqual(1);
      expect(result.error.column).toBeGreaterThanOrEqual(1);
    }
  });

  it("rejects empty input", async () => {
    const result = await formatMCode("");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toMatch(/no m code/i);
    }
  });

  it("is idempotent — formatting already-formatted output is a no-op", async () => {
    const first = await formatMCode("let x=1,y=2 in x+y");
    expect(first.ok).toBe(true);
    if (first.ok) {
      const second = await formatMCode(first.formatted);
      expect(second.ok).toBe(true);
      if (second.ok) {
        expect(second.formatted).toBe(first.formatted);
      }
    }
  });
});

describe("validateMCode", () => {
  it("returns valid: true for a well-formed query", async () => {
    const result = await validateMCode("let Source = {1, 2, 3} in Source");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns valid: false with positioned errors for invalid M", async () => {
    const result = await validateMCode("let x = in");
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    const err = result.errors[0];
    expect(err.message.length).toBeGreaterThan(0);
    expect(err.line).toBeGreaterThanOrEqual(1);
    expect(err.column).toBeGreaterThanOrEqual(1);
  });

  it("rejects empty input as invalid", async () => {
    const result = await validateMCode("");
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});
