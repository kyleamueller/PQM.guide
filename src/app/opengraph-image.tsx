import { ImageResponse } from "next/og";
import { getAllFunctionSlugs, getAllConceptSlugs, getAllPatternSlugs } from "@/lib/mdx";

export const alt = "PQM.guide — Power Query M Function Reference";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const functionCount = getAllFunctionSlugs().length;
  const conceptCount = getAllConceptSlugs().length;
  const patternCount = getAllPatternSlugs().length;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 16,
            display: "flex",
          }}
        >
          <span style={{ color: "#4fc3f7" }}>PQ</span>
          <span>M.guide</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#b0bec5",
            marginBottom: 48,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Community-driven Power Query M language reference
        </div>
        <div
          style={{
            display: "flex",
            gap: 48,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: "#4fc3f7" }}>
              {functionCount}
            </span>
            <span style={{ fontSize: 18, color: "#78909c" }}>Functions</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: "#4fc3f7" }}>
              {conceptCount}
            </span>
            <span style={{ fontSize: 18, color: "#78909c" }}>Concepts</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 40, fontWeight: 700, color: "#4fc3f7" }}>
              {patternCount}
            </span>
            <span style={{ fontSize: 18, color: "#78909c" }}>Patterns</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
