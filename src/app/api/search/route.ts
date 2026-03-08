import { buildSearchIndex } from "@/lib/mdx";
import { createSearchIndex } from "@/lib/search";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return Response.json(
      { error: "Missing query parameter: ?q=" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const functions = buildSearchIndex();
  const index = createSearchIndex(functions);
  const results = index.search(query, { limit: 10 });

  return Response.json(
    results.map((r) => r.item),
    { headers: CORS_HEADERS }
  );
}
