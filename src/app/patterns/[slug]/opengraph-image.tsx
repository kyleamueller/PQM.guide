import { ImageResponse } from "next/og";
import { getPatternBySlug, getAllPatternSlugs } from "@/lib/mdx";

export const alt = "PQM.guide Pattern";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: "#81c784",
  intermediate: "#4fc3f7",
  advanced: "#e67e22",
};

export function generateStaticParams() {
  return getAllPatternSlugs().map((slug) => ({ slug }));
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { frontmatter } = getPatternBySlug(slug);
  const diffColor = DIFFICULTY_COLOR[frontmatter.difficulty] ?? "#78909c";

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
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#ffffff",
              display: "flex",
            }}
          >
            <span style={{ color: "#4fc3f7" }}>PQ</span>
            <span>M.guide</span>
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: diffColor,
              background: `${diffColor}20`,
              borderRadius: 8,
              padding: "4px 12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {frontmatter.difficulty}
          </div>
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 24,
            lineHeight: 1.2,
          }}
        >
          {frontmatter.title}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#b0bec5",
            lineHeight: 1.5,
            maxWidth: 900,
          }}
        >
          {frontmatter.description.length > 140
            ? frontmatter.description.slice(0, 137) + "..."
            : frontmatter.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
