import Link from "next/link";

export default function SampleTablesBanner() {
  return (
    <div className="sample-tables-banner">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.3" />
        <line x1="6" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.3" />
        <line x1="11" y1="6" x2="11" y2="14" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      <span>
        Examples on this page use shared{" "}
        <Link href="/sample-tables">sample tables</Link>.
        View them to understand the input data before reading the examples below.
      </span>
    </div>
  );
}
