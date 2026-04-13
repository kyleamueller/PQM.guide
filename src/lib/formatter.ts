/**
 * M-code formatting and validation for pqm.guide.
 *
 * Backed by Microsoft's official Power Query libraries (MIT-licensed):
 *   - @microsoft/powerquery-formatter — https://github.com/microsoft/powerquery-formatter
 *   - @microsoft/powerquery-parser    — https://github.com/microsoft/powerquery-parser
 *
 * This module must run on the Node runtime — the parser uses APIs that are
 * not available on the Vercel/Next.js Edge runtime.
 */

import {
  DefaultSettings,
  NewlineLiteral,
  tryFormat,
  type FormatSettings,
  type TFormatError,
} from "@microsoft/powerquery-formatter";

// The formatter accepts both full `let … in …` documents and bare expressions
// natively, so no pre-parsing or cascading fallback is needed for v1.
// See backlog (P3) for the follow-up to revisit input handling.

export type FormatStyle = "long" | "short";

// "long" is the Power Query editor default — keeps each step on a single
// long line until it exceeds ~120 chars. "short" lowers the wrap budget so
// function calls with several arguments break each parameter onto its own
// line (similar to what you'd write by hand for readability), without going
// so far as to break apart simple expressions like `each [x] > 1`.
const MAX_WIDTH_LONG = 120;
const MAX_WIDTH_SHORT = 60;

function settingsFor(style: FormatStyle): FormatSettings {
  return {
    ...DefaultSettings,
    newlineLiteral: NewlineLiteral.Unix,
    maxWidth: style === "short" ? MAX_WIDTH_SHORT : MAX_WIDTH_LONG,
  };
}

export interface FormatErrorInfo {
  message: string;
  line?: number;
  column?: number;
}

export type FormatResult =
  | { ok: true; formatted: string }
  | { ok: false; error: FormatErrorInfo };

export interface ValidationError {
  message: string;
  line: number;
  column: number;
}

export interface ValidateResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Extract user-facing line/column info from a formatter error. Handles both
 * parse errors (token-based positions) and lex errors (grapheme positions).
 * Returns 1-indexed line and column for human display; falls back to
 * undefined when the error shape doesn't expose a position.
 */
function extractPosition(err: TFormatError): { line?: number; column?: number } {
  // Walk into .innerError (ParseError / LexError both wrap an inner error).
  const inner = (err as { innerError?: unknown }).innerError ?? err;

  // Parse-error shapes with a `foundToken: { token, columnNumber }`
  const foundToken = (inner as { foundToken?: { token?: { positionStart?: { lineNumber?: number; lineCodeUnit?: number } }; columnNumber?: number } }).foundToken;
  if (foundToken?.token?.positionStart) {
    const pos = foundToken.token.positionStart;
    return {
      line: (pos.lineNumber ?? 0) + 1,
      column: (foundToken.columnNumber ?? pos.lineCodeUnit ?? 0) + 1,
    };
  }

  // Errors with a `positionStart: GraphemePosition` (has columnNumber, 0-indexed)
  const positionStart = (inner as { positionStart?: { lineNumber?: number; columnNumber?: number; lineCodeUnit?: number } }).positionStart;
  if (positionStart) {
    return {
      line: (positionStart.lineNumber ?? 0) + 1,
      column: (positionStart.columnNumber ?? positionStart.lineCodeUnit ?? 0) + 1,
    };
  }

  // Errors with a `graphemePosition: GraphemePosition`
  const graphemePosition = (inner as { graphemePosition?: { lineNumber?: number; columnNumber?: number } }).graphemePosition;
  if (graphemePosition) {
    return {
      line: (graphemePosition.lineNumber ?? 0) + 1,
      column: (graphemePosition.columnNumber ?? 0) + 1,
    };
  }

  return {};
}

/**
 * Format a Power Query M snippet. Accepts either a full `let … in …` document
 * or a bare expression. On success returns the formatted source (no trailing
 * newline). On failure returns a structured error with line/column when
 * available.
 */
export async function formatMCode(
  code: string,
  style: FormatStyle = "long"
): Promise<FormatResult> {
  if (typeof code !== "string" || code.trim().length === 0) {
    return { ok: false, error: { message: "No M code provided." } };
  }

  try {
    const result = await tryFormat(settingsFor(style), code);
    if (result.kind === "Ok") {
      return { ok: true, formatted: result.value.replace(/\r\n/g, "\n").replace(/\s+$/, "") };
    }
    const pos = extractPosition(result.error);
    return {
      ok: false,
      error: {
        message: result.error.message ?? "Unknown formatter error.",
        ...pos,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: { message } };
  }
}

/**
 * Validate a Power Query M snippet by attempting to parse it. Returns
 * `valid: true` with an empty `errors` array on success, or `valid: false`
 * with one populated error on failure. The formatter exits at the first
 * syntax error, so `errors` currently contains at most one entry.
 */
export async function validateMCode(code: string): Promise<ValidateResult> {
  if (typeof code !== "string" || code.trim().length === 0) {
    return {
      valid: false,
      errors: [{ message: "No M code provided.", line: 1, column: 1 }],
    };
  }

  try {
    // Style doesn't affect parse-check success/failure — use "long" defaults.
    const result = await tryFormat(settingsFor("long"), code);
    if (result.kind === "Ok") {
      return { valid: true, errors: [] };
    }
    const pos = extractPosition(result.error);
    return {
      valid: false,
      errors: [
        {
          message: result.error.message ?? "Unknown parse error.",
          line: pos.line ?? 1,
          column: pos.column ?? 1,
        },
      ],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      valid: false,
      errors: [{ message, line: 1, column: 1 }],
    };
  }
}
