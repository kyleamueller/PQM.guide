"use client";

import { useState } from "react";
import { PQTableData } from "@/lib/types";
import { sampleTables } from "@/data/sample-tables";
import PQTable from "@/components/pq-table/PQTable";
import SyntaxBlock from "./SyntaxBlock";

interface ExampleSectionProps {
  title: string;
  description?: string;
  code: string;
  inputTableRef?: string;
  inputTable?: PQTableData;
  outputTable?: PQTableData;
  index: number;
}

export default function ExampleSection({
  title,
  description,
  code,
  inputTableRef,
  inputTable,
  outputTable,
  index,
}: ExampleSectionProps) {
  const [showInput, setShowInput] = useState(false);

  const resolvedInput = inputTable || (inputTableRef && sampleTables[inputTableRef]?.data) || null;
  const inputLabel = inputTableRef || "Input";

  return (
    <div className="example-section">
      <h3>
        Example {index + 1}: {title}
      </h3>
      {description && <p className="example-description">{description}</p>}

      <div className="example-code">
        <SyntaxBlock code={code} />
      </div>

      {resolvedInput && (
        <div className="example-input">
          <button
            className="toggle-table-btn"
            onClick={() => setShowInput(!showInput)}
            aria-expanded={showInput}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                transform: showInput ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 150ms ease",
              }}
            >
              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Input: {inputLabel}</span>
          </button>
          {showInput && (
            <div className="example-table">
              <PQTable data={resolvedInput} caption={`${inputLabel} (sample data)`} />
            </div>
          )}
        </div>
      )}

      {outputTable && (
        <div className="example-output">
          <div className="result-label">Result</div>
          <div className="example-table">
            <PQTable data={outputTable} />
          </div>
        </div>
      )}
    </div>
  );
}
