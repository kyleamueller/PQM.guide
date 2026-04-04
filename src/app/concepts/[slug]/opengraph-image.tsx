import { ImageResponse } from "next/og";
import { getConceptBySlug, getAllConceptSlugs } from "@/lib/mdx";

export const alt = "PQM.guide Concept Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllConceptSlugs().map((slug) => ({ slug }));
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { frontmatter } = getConceptBySlug(slug);

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
              color: "#81c784",
              background: "#81c78420",
              borderRadius: 8,
              padding: "4px 12px",
            }}
          >
            Concept
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
