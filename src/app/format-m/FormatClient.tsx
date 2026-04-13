"use client";

import { useState } from "react";
import SyntaxBlock from "@/components/function-page/SyntaxBlock";

type ValidationError = { message: string; line: number; column: number };

type FormatResponse =
  | { ok: true; formatted: string }
  | { ok: false; error: { message: string; line?: number; column?: number } };

type ValidateResponse = { valid: boolean; errors: ValidationError[] };

const EXAMPLE = `let
  Source = Csv.Document(File.Contents("C:\\data\\sales.csv"),[Delimiter=",",Columns=10,Encoding=65001]),
  Promoted = Table.PromoteHeaders(Source,[PromoteAllScalars=true]),
  Typed = Table.TransformColumnTypes(Promoted,{{"OrderID",Int64.Type},{"Date",type date},{"Amount",type number}}),
  Filtered = Table.SelectRows(Typed, each [Amount]>100)
in Filtered`;

type FormatStyle = "long" | "short";

export default function FormatClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [style, setStyle] = useState<FormatStyle>("long");
  const [output, setOutput] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<{ message: string; line?: number; column?: number } | null>(null);
  const [validation, setValidation] = useState<ValidateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function runAction(action: "format" | "validate") {
    setLoading(true);
    setOutput(null);
    setErrorInfo(null);
    setValidation(null);
    try {
      const res = await fetch("/api/format-m", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: input, action, style }),
      });
      const data = await res.json();
      if (action === "format") {
        const r = data as FormatResponse;
        if (r.ok) setOutput(r.formatted);
        else setErrorInfo(r.error);
      } else {
        setValidation(data as ValidateResponse);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorInfo({ message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label
          htmlFor="m-input"
          style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}
        >
          M code
        </label>
        <textarea
          id="m-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          style={{
            width: "100%",
            minHeight: 200,
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 13,
            lineHeight: 1.5,
            padding: "12px 14px",
            background: "var(--code-bg)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
            borderRadius: 6,
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div
          role="radiogroup"
          aria-label="Formatting style"
          style={{ display: "inline-flex", border: "1px solid var(--border-color)", borderRadius: 6, overflow: "hidden" }}
        >
          {(["long", "short"] as const).map((option) => {
            const active = style === option;
            return (
              <button
                key={option}
                role="radio"
                aria-checked={active}
                onClick={() => setStyle(option)}
                title={
                  option === "long"
                    ? "Long lines: Power Query editor style — each step on one line up to ~120 chars."
                    : "Short lines: spreads parameters of complex function calls onto their own lines."
                }
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  background: active ? "var(--accent)" : "var(--bg-secondary)",
                  color: active ? "#fff" : "var(--text-primary)",
                  border: "none",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {option} lines
              </button>
            );
          })}
        </div>
        <button
          onClick={() => runAction("format")}
          disabled={loading || input.trim().length === 0}
          style={{
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 600,
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "wait" : "pointer",
            opacity: loading || input.trim().length === 0 ? 0.6 : 1,
          }}
        >
          {loading ? "Working…" : "Format"}
        </button>
        <button
          onClick={() => runAction("validate")}
          disabled={loading || input.trim().length === 0}
          style={{
            padding: "8px 16px",
            fontSize: 14,
            fontWeight: 600,
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
            borderRadius: 6,
            cursor: loading ? "wait" : "pointer",
            opacity: loading || input.trim().length === 0 ? 0.6 : 1,
          }}
        >
          Validate
        </button>
      </div>

      {output !== null && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            Formatted
          </div>
          <SyntaxBlock code={output} />
        </div>
      )}

      {errorInfo && (
        <div
          role="alert"
          style={{
            padding: "12px 16px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--error-color, #d33)",
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          <strong>Could not format M code</strong>
          {errorInfo.line !== undefined && errorInfo.column !== undefined && (
            <span style={{ color: "var(--text-secondary)" }}>
              {" "}
              (line {errorInfo.line}, col {errorInfo.column})
            </span>
          )}
          <div style={{ marginTop: 6, color: "var(--text-secondary)" }}>
            {errorInfo.message}
          </div>
        </div>
      )}

      {validation && (
        <div
          role="status"
          style={{
            padding: "12px 16px",
            background: "var(--bg-secondary)",
            border: `1px solid ${validation.valid ? "var(--success-color, #2a9d55)" : "var(--error-color, #d33)"}`,
            borderRadius: 6,
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {validation.valid ? (
            <strong>Valid M code.</strong>
          ) : (
            <>
              <strong>
                Invalid M code — {validation.errors.length}{" "}
                {validation.errors.length === 1 ? "error" : "errors"}
              </strong>
              <ul style={{ margin: "8px 0 0 20px", color: "var(--text-secondary)" }}>
                {validation.errors.map((e, i) => (
                  <li key={i}>
                    Line {e.line}, col {e.column}: {e.message}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
