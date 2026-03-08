"use client";

import { useState } from "react";

export default function CopyCodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sample-code-pre-wrapper usage-example-block">
      <pre>
        <code>{code}</code>
      </pre>
      <button
        className={`code-copy-btn${copied ? " copied" : ""}`}
        onClick={handleCopy}
        aria-label={copied ? "Copied!" : "Copy code"}
        title={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
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
  );
}
