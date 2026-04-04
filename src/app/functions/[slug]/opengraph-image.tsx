import { ImageResponse } from "next/og";
import { getFunctionBySlug, getAllFunctionSlugs } from "@/lib/mdx";

export const alt = "PQM.guide Function Reference";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllFunctionSlugs().map((slug) => ({ slug }));
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { frontmatter } = getFunctionBySlug(slug);

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
              color: "#4fc3f7",
              background: "#4fc3f720",
              borderRadius: 8,
              padding: "4px 12px",
            }}
          >
            {frontmatter.category}
          </div>
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          {frontmatter.title}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#b0bec5",
            marginBottom: 32,
            lineHeight: 1.5,
            maxWidth: 900,
          }}
        >
          {frontmatter.description.length > 120
            ? frontmatter.description.slice(0, 117) + "..."
            : frontmatter.description}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 18,
            color: "#78909c",
            fontFamily: "monospace",
          }}
        >
          {`Returns: ${frontmatter.returnType}`}
        </div>
      </div>
    ),
    { ...size }
  );
}
