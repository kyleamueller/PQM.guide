import { getConceptBySlug } from "@/lib/mdx";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = getConceptBySlug(slug);
    return Response.json(
      { ...frontmatter, slug, content },
      { headers: CORS_HEADERS }
    );
  } catch {
    return Response.json({ error: "Concept not found" }, { status: 404, headers: CORS_HEADERS });
  }
}
