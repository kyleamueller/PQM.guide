"use client";

import { useState } from "react";
import { PQTableData, ExampleStep } from "@/lib/types";
import { sampleTables } from "@/data/sample-tables";
import { parseInlineMarkdown } from "@/lib/markdown";
import PQTable from "@/components/pq-table/PQTable";
import SyntaxBlock from "./SyntaxBlock";

interface ExampleSectionProps {
  title: string;
  description?: string;
  code: string;
  inputTableRef?: string;
  inputTable?: PQTableData;
  outputTable?: PQTableData;
  steps?: ExampleStep[];
  index: number;
}

export default function ExampleSection({
  title,
  description,
  code,
  inputTableRef,
  inputTable,
  outputTable,
  steps,
  index,
}: ExampleSectionProps) {
  const [showInput, setShowInput] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(() =>
    steps ? steps.length - 1 : 0
  );

  const resolvedInput = inputTable || (inputTableRef && sampleTables[inputTableRef]?.data) || null;
  const inputLabel = inputTableRef || "Input";

  const currentStep = steps ? steps[activeStep] : null;

  return (
    <div className="example-section">
      <h3>
        Example {index + 1}: {title}
      </h3>
      {description && <p className="example-description" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(description) }} />}

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

      {steps && steps.length > 0 ? (
        <div className="example-steps">
          <div className="steps-label">Applied Steps</div>
          <div className="steps-nav" role="tablist" aria-label="Query steps">
            {steps.map((step, i) => (
              <button
                key={step.name}
                role="tab"
                aria-selected={i === activeStep}
                className={`step-btn${i === activeStep ? " step-btn--active" : ""}`}
                onClick={() => setActiveStep(i)}
              >
                {step.name}
              </button>
            ))}
          </div>
          {currentStep && (
            <div className="step-output">
              {currentStep.description && (
                <p className="step-description" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(currentStep.description) }} />
              )}
              <div className="example-table">
                <PQTable data={currentStep.output} />
              </div>
            </div>
          )}
        </div>
      ) : outputTable ? (
        <div className="example-output">
          <div className="result-label">Output</div>
          <div className="example-table">
            <PQTable data={outputTable} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
