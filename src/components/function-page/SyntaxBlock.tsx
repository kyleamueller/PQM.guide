"use client";

import { useState } from "react";
import Prism from "prismjs";
import "@/lib/prism-powerquery";

interface SyntaxBlockProps {
  code: string;
  language?: string;
}

export default function SyntaxBlock({ code, language = "powerquery" }: SyntaxBlockProps) {
  const [copied, setCopied] = useState(false);

  const grammar = Prism.languages[language];
  const rawHtml = grammar ? Prism.highlight(code, grammar, language) : code;
  const html = rawHtml.replace(
    /<span class="token builtin">([^<]+)<\/span>/g,
    (_, funcName: string) => {
      const slug = funcName.toLowerCase().replace(".", "-");
      return `<a href="/functions/${slug}" class="token builtin fn-link" title="View ${funcName}">${funcName}</a>`;
    }
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="syntax-block">
      <button
        className={`copy-btn${copied ? " copied" : ""}`}
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
      <pre className={`language-${language}`} tabIndex={0}>
        <code
          className={`language-${language}`}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );
}
