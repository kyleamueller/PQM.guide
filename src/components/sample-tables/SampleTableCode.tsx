"use client";

import { useState } from "react";
import { SampleTable } from "@/lib/types";
import { generateFromRecords, generateTmdl, generateWebContents } from "@/lib/sample-table-code";

export default function SampleTableCode({ table }: { table: SampleTable }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const fromRecordsCode = generateFromRecords(table);
  const webContentsCode = generateWebContents(table);
  const tmdlCode = generateTmdl(table);

  const handleCopy = async (code: string, label: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="sample-table-code">
      <button
        className="toggle-table-btn"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 150ms ease",
          }}
        >
          <path
            d="M4 2L8 6L4 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span>Create this table in Power Query</span>
      </button>

      {expanded && (
        <div className="sample-code-blocks">
          <div className="sample-code-block">
            <div className="sample-code-header">
              <h4>Option 1: Paste into Advanced Editor</h4>
            </div>
            <div className="sample-code-pre-wrapper">
              <pre>
                <code>{fromRecordsCode}</code>
              </pre>
              <button
                className={`code-copy-btn${copied === "records" ? " copied" : ""}`}
                onClick={() => handleCopy(fromRecordsCode, "records")}
                aria-label={copied === "records" ? "Copied!" : "Copy code"}
                title={copied === "records" ? "Copied!" : "Copy code"}
              >
                {copied === "records" ? (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2 7.5L6 11.5L13 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M10 5V3.5A1.5 1.5 0 008.5 2h-6A1.5 1.5 0 001 3.5v6A1.5 1.5 0 002.5 11H4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="sample-code-block">
            <div className="sample-code-header">
              <h4>Option 2: Load from URL</h4>
            </div>
            <div className="sample-code-pre-wrapper">
              <pre>
                <code>{webContentsCode}</code>
              </pre>
              <button
                className={`code-copy-btn${copied === "web" ? " copied" : ""}`}
                onClick={() => handleCopy(webContentsCode, "web")}
                aria-label={copied === "web" ? "Copied!" : "Copy code"}
                title={copied === "web" ? "Copied!" : "Copy code"}
              >
                {copied === "web" ? (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2 7.5L6 11.5L13 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M10 5V3.5A1.5 1.5 0 008.5 2h-6A1.5 1.5 0 001 3.5v6A1.5 1.5 0 002.5 11H4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
            <p className="sample-code-note">
              Requires web access from Power Query.
            </p>
          </div>

          <div className="sample-code-block">
            <div className="sample-code-header">
              <h4>Option 3: TMDL view (Power BI Desktop)</h4>
            </div>
            <div className="sample-code-pre-wrapper">
              <pre>
                <code>{tmdlCode}</code>
              </pre>
              <button
                className={`code-copy-btn${copied === "tmdl" ? " copied" : ""}`}
                onClick={() => handleCopy(tmdlCode, "tmdl")}
                aria-label={copied === "tmdl" ? "Copied!" : "Copy code"}
                title={copied === "tmdl" ? "Copied!" : "Copy code"}
              >
                {copied === "tmdl" ? (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2 7.5L6 11.5L13 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M10 5V3.5A1.5 1.5 0 008.5 2h-6A1.5 1.5 0 001 3.5v6A1.5 1.5 0 002.5 11H4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
            <p className="sample-code-note">
              In Power BI Desktop, open TMDL view, paste this script into a new tab, and select Apply. It adds the table to your semantic model with the same data and column types.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
