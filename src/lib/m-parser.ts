/**
 * Thin wrapper over @microsoft/powerquery-parser for the `comment_m_code` and
 * `rename_applied_steps` MCP tools. Callers are expected to run input through
 * `formatMCode` first; parse errors here are treated as a "shouldn't happen".
 *
 * No parser types leak past this module — the public surface is plain data.
 */
import {
  DefaultSettings,
  TaskUtils,
  Language,
  ResultKind,
} from "@microsoft/powerquery-parser";

type Ast = Language.Ast.TNode;
type Identifier = Language.Ast.Identifier;

const IDENTIFIER_QUOTE_RE = /^#"(.*)"$/;
const VALID_UNQUOTED_IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

function unwrap(literal: string): string {
  const m = literal.match(IDENTIFIER_QUOTE_RE);
  return m ? m[1] : literal;
}

function toRawName(identifier: string): string {
  return VALID_UNQUOTED_IDENTIFIER_RE.test(identifier)
    ? identifier
    : `#"${identifier}"`;
}

/**
 * Simplified view of the argument passed to the outermost function call on a
 * step's RHS. Only shapes that PQ UI-style step naming actually cares about
 * are modeled — everything else collapses to `{ kind: "other" }`.
 *
 *   "TotalPrice"                    → { kind: "string",         value }
 *   {"A", "B"}                      → { kind: "stringList",     values }
 *   {{"Old","New"}, {"X","Y"}}      → { kind: "stringPairList", pairs }
 *   {{"Col", type text}}            → { kind: "stringFirstPairList", firsts }
 *   {{"Col", Order.Ascending}}      → { kind: "stringFirstPairList", firsts }
 *   anything else (nested calls,
 *   record literals, lambdas)       → { kind: "other" }
 */
export type CallArg =
  | { kind: "string"; value: string }
  | { kind: "stringList"; values: string[] }
  | { kind: "stringPairList"; pairs: [string, string][] }
  | { kind: "stringFirstPairList"; firsts: string[] }
  | { kind: "other" };

export type MStep = {
  rawName: string;
  identifier: string;
  indent: string;
  lineIndex: number;
  rhsText: string;
  callFunction?: string;
  callArgs?: CallArg[];
  /** True when the outermost call's arguments contain a nested function
   * invocation. Callers can use this to flag "compound" steps that do more
   * than the outermost function name suggests. */
  compound?: boolean;
};

export type LetExpression = {
  steps: MStep[];
  inTargetIdentifier: string;
};

async function parseAst(code: string): Promise<Ast> {
  const task = await TaskUtils.tryLexParse(DefaultSettings, code);
  if (task.resultKind !== ResultKind.Ok) {
    const err = (task as { error?: { message?: string } }).error;
    const msg = err?.message ?? "Unknown parse error.";
    throw new Error(`Failed to parse M code: ${msg}`);
  }
  return task.ast;
}

function extractIndent(code: string, codeUnit: number): string {
  let start = codeUnit;
  while (start > 0 && code[start - 1] !== "\n") start--;
  const line = code.slice(start, codeUnit);
  const m = line.match(/^(\s*)/);
  return m ? m[1] : "";
}

function extractCallFunction(
  value: Language.Ast.TNode
): string | undefined {
  if (
    value.kind === Language.Ast.NodeKind.RecursivePrimaryExpression &&
    value.head.kind === Language.Ast.NodeKind.IdentifierExpression &&
    value.recursiveExpressions.elements.length > 0 &&
    value.recursiveExpressions.elements[0].kind ===
      Language.Ast.NodeKind.InvokeExpression
  ) {
    return value.head.identifier.literal;
  }
  return undefined;
}

function isTextLiteral(
  node: Language.Ast.TNode
): node is Language.Ast.LiteralExpression {
  return (
    node.kind === Language.Ast.NodeKind.LiteralExpression &&
    node.literalKind === Language.Ast.LiteralKind.Text
  );
}

function unwrapTextLiteral(node: Language.Ast.LiteralExpression): string {
  // The literal keeps its surrounding quotes: `"foo"`. Strip them.
  const raw = node.literal;
  return raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
}

function classifyArg(node: Language.Ast.TNode): CallArg {
  if (isTextLiteral(node)) {
    return { kind: "string", value: unwrapTextLiteral(node) };
  }
  if (node.kind === Language.Ast.NodeKind.ListExpression) {
    const items = node.content.elements.map((csv) => csv.node);
    if (items.length === 0) return { kind: "stringList", values: [] };

    // Uniform list of text literals — {"A", "B"}
    if (items.every(isTextLiteral)) {
      return {
        kind: "stringList",
        values: items.map((n) => unwrapTextLiteral(n as Language.Ast.LiteralExpression)),
      };
    }

    // List of 2-element lists where each element's first item is a string —
    // handles {{"Old","New"},…}, {{"Col", type text},…}, {{"Col", Order.Ascending},…}
    const innerLists = items.every(
      (n) => n.kind === Language.Ast.NodeKind.ListExpression
    )
      ? (items as Language.Ast.ListExpression[])
      : null;
    if (innerLists) {
      const pairs: [string, string][] = [];
      const firsts: string[] = [];
      let allPairsAreStrings = true;
      let allFirstsAreStrings = true;
      for (const inner of innerLists) {
        const els = inner.content.elements.map((c) => c.node);
        if (els.length !== 2) {
          allPairsAreStrings = false;
          allFirstsAreStrings = false;
          break;
        }
        if (!isTextLiteral(els[0])) {
          allFirstsAreStrings = false;
          allPairsAreStrings = false;
          break;
        }
        const first = unwrapTextLiteral(els[0] as Language.Ast.LiteralExpression);
        firsts.push(first);
        if (isTextLiteral(els[1])) {
          pairs.push([first, unwrapTextLiteral(els[1] as Language.Ast.LiteralExpression)]);
        } else {
          allPairsAreStrings = false;
        }
      }
      if (allPairsAreStrings) return { kind: "stringPairList", pairs };
      if (allFirstsAreStrings) return { kind: "stringFirstPairList", firsts };
    }
  }
  return { kind: "other" };
}

function containsNestedCall(node: Language.Ast.TNode): boolean {
  const k = Language.Ast.NodeKind;
  if (
    node.kind === k.RecursivePrimaryExpression &&
    node.recursiveExpressions.elements.some((e) => e.kind === k.InvokeExpression)
  ) {
    return true;
  }
  // Recurse into common expression shapes so nested calls inside lists,
  // records, if/each, etc. are still caught.
  switch (node.kind) {
    case k.ListExpression:
      return node.content.elements.some((c) => containsNestedCall(c.node));
    case k.RecordExpression:
      return node.content.elements.some((c) => containsNestedCall(c.node.value));
    case k.ParenthesizedExpression:
      return containsNestedCall(node.content);
    case k.IfExpression:
      return (
        containsNestedCall(node.condition) ||
        containsNestedCall(node.trueExpression) ||
        containsNestedCall(node.falseExpression)
      );
    case k.EachExpression:
      return containsNestedCall(node.paired);
    case k.ArithmeticExpression:
    case k.EqualityExpression:
    case k.LogicalExpression:
    case k.RelationalExpression:
    case k.NullCoalescingExpression:
      return containsNestedCall(node.left) || containsNestedCall(node.right);
    default:
      return false;
  }
}

function extractCallInfo(
  value: Language.Ast.TNode
): { fn: string; args: CallArg[]; compound: boolean } | null {
  if (
    value.kind !== Language.Ast.NodeKind.RecursivePrimaryExpression ||
    value.head.kind !== Language.Ast.NodeKind.IdentifierExpression ||
    value.recursiveExpressions.elements.length === 0 ||
    value.recursiveExpressions.elements[0].kind !==
      Language.Ast.NodeKind.InvokeExpression
  ) {
    return null;
  }
  const invoke = value.recursiveExpressions.elements[0];
  const argNodes = invoke.content.elements.map((c) => c.node);
  const args = argNodes.map(classifyArg);
  // "Compound" if any argument contains a nested function call. Simple
  // identifier references (the common case for arg 0) don't count — only
  // actual invocations do. This lets callers flag steps that do more than
  // the outermost function name suggests.
  const compound = argNodes.some(containsNestedCall);
  return { fn: value.head.identifier.literal, args, compound };
}

/**
 * Parse an M document. Returns null when the root isn't a `let … in …`
 * expression (bare expression, section document, etc). Throws if the parser
 * itself fails — callers should have normalized via `formatMCode` first.
 */
export async function parseLet(code: string): Promise<LetExpression | null> {
  const ast = await parseAst(code);
  if (ast.kind !== Language.Ast.NodeKind.LetExpression) return null;

  const steps: MStep[] = ast.variableList.elements.map((csv) => {
    const kv = csv.node;
    const rawName = kv.key.literal;
    const identifier = unwrap(rawName);
    const keyStart = kv.key.tokenRange.positionStart;
    const valueStart = kv.value.tokenRange.positionStart.codeUnit;
    const valueEnd = kv.value.tokenRange.positionEnd.codeUnit;
    const rhsText = code.slice(valueStart, valueEnd);
    const callInfo = extractCallInfo(kv.value);
    return {
      rawName,
      identifier,
      indent: extractIndent(code, keyStart.codeUnit),
      lineIndex: keyStart.lineNumber,
      rhsText,
      callFunction: callInfo?.fn ?? extractCallFunction(kv.value),
      callArgs: callInfo?.args,
      compound: callInfo?.compound,
    };
  });

  let inTargetIdentifier = "";
  if (ast.expression.kind === Language.Ast.NodeKind.IdentifierExpression) {
    inTargetIdentifier = unwrap(ast.expression.identifier.literal);
  }

  return { steps, inTargetIdentifier };
}

type IdentifierEdit = {
  start: number;
  end: number;
  replacement: string;
};

function collectIdentifierEdits(
  node: Language.Ast.TNode,
  mapping: Map<string, string>,
  edits: IdentifierEdit[]
): void {
  const k = Language.Ast.NodeKind;
  switch (node.kind) {
    case k.LetExpression: {
      for (const csv of node.variableList.elements) {
        collectFromIdentifier(csv.node.key, mapping, edits);
        collectIdentifierEdits(csv.node.value, mapping, edits);
      }
      collectIdentifierEdits(node.expression, mapping, edits);
      return;
    }
    case k.IdentifierExpression: {
      collectFromIdentifier(node.identifier, mapping, edits);
      return;
    }
    case k.RecursivePrimaryExpression: {
      collectIdentifierEdits(node.head, mapping, edits);
      for (const el of node.recursiveExpressions.elements) {
        collectIdentifierEdits(el, mapping, edits);
      }
      return;
    }
    case k.InvokeExpression: {
      for (const csv of node.content.elements) {
        collectIdentifierEdits(csv.node, mapping, edits);
      }
      return;
    }
    case k.ItemAccessExpression: {
      // `T{idx}` — `idx` can legitimately be a step reference. Descend.
      collectIdentifierEdits(node.content, mapping, edits);
      return;
    }
    case k.FieldSelector:
    case k.FieldProjection:
      // `T[FieldName]` / `T[[A],[B]]` — inner identifiers are field names on
      // the record, never step references. Skip.
      return;
    case k.EachExpression:
      collectIdentifierEdits(node.paired, mapping, edits);
      return;
    case k.FunctionExpression:
      collectIdentifierEdits(node.expression, mapping, edits);
      return;
    case k.IfExpression: {
      collectIdentifierEdits(node.condition, mapping, edits);
      collectIdentifierEdits(node.trueExpression, mapping, edits);
      collectIdentifierEdits(node.falseExpression, mapping, edits);
      return;
    }
    case k.ListExpression: {
      for (const csv of node.content.elements) {
        collectIdentifierEdits(csv.node, mapping, edits);
      }
      return;
    }
    case k.RecordExpression: {
      for (const csv of node.content.elements) {
        collectIdentifierEdits(csv.node.value, mapping, edits);
      }
      return;
    }
    case k.ParenthesizedExpression:
      collectIdentifierEdits(node.content, mapping, edits);
      return;
    case k.ArithmeticExpression:
    case k.EqualityExpression:
    case k.LogicalExpression:
    case k.RelationalExpression:
    case k.NullCoalescingExpression:
    case k.MetadataExpression:
    case k.AsExpression:
    case k.IsExpression: {
      collectIdentifierEdits(node.left, mapping, edits);
      collectIdentifierEdits(node.right, mapping, edits);
      return;
    }
    case k.UnaryExpression:
      collectIdentifierEdits(node.typeExpression, mapping, edits);
      return;
    case k.ErrorRaisingExpression:
      collectIdentifierEdits(node.paired, mapping, edits);
      return;
    case k.ErrorHandlingExpression: {
      collectIdentifierEdits(node.protectedExpression, mapping, edits);
      if (node.handler) {
        // `.handler` is either an OtherwiseExpression (IPairedConstant with
        // .paired: TExpression) or a CatchExpression (IPairedConstant with
        // .paired: FunctionExpression). Both have `.paired`.
        collectIdentifierEdits(node.handler.paired, mapping, edits);
      }
      return;
    }
    default:
      // Literals, constants, primitive types etc. hold no step references.
      return;
  }
}

function collectFromIdentifier(
  identifier: Identifier,
  mapping: Map<string, string>,
  edits: IdentifierEdit[]
): void {
  const unwrapped = unwrap(identifier.literal);
  const target = mapping.get(unwrapped);
  if (target === undefined) return;
  edits.push({
    start: identifier.tokenRange.positionStart.codeUnit,
    end: identifier.tokenRange.positionEnd.codeUnit,
    replacement: toRawName(target),
  });
}

/**
 * Rewrite step declarations and every RHS reference so that identifiers whose
 * unwrapped literal matches a mapping key are replaced with the mapped value.
 * Emits the new name unquoted when it's a valid M identifier; otherwise
 * `#"…"`. Throws if the mapping would cause two steps to end up with the same
 * final name.
 */
export async function renameSteps(
  code: string,
  mapping: Map<string, string>
): Promise<string> {
  const parsed = await parseLet(code);
  if (parsed === null) {
    throw new Error("Only 'let … in …' queries support rename.");
  }

  // Normalize mapping keys: unwrap `#"…"` so callers can pass either form.
  const normalized = new Map<string, string>();
  for (const [key, value] of mapping) normalized.set(unwrap(key), value);

  // Collision check — after applying the mapping, do any two step identifiers
  // collide?
  const finalNames = parsed.steps.map((s) => normalized.get(s.identifier) ?? s.identifier);
  const seen = new Map<string, number>();
  for (let i = 0; i < finalNames.length; i++) {
    const name = finalNames[i];
    if (seen.has(name)) {
      const first = parsed.steps[seen.get(name)!].identifier;
      const second = parsed.steps[i].identifier;
      throw new Error(
        `Rename would collide: both "${first}" and "${second}" map to "${name}".`
      );
    }
    seen.set(name, i);
  }

  const ast = await parseAst(code);
  const edits: IdentifierEdit[] = [];
  collectIdentifierEdits(ast, normalized, edits);

  edits.sort((a, b) => b.start - a.start);
  let result = code;
  for (const edit of edits) {
    result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
  }
  return result;
}
