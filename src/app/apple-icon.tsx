import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          borderRadius: 36,
        }}
      >
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>
          <span style={{ color: "#4fc3f7" }}>P</span>
          <span style={{ color: "#ffffff" }}>Q</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
