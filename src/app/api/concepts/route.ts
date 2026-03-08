import { getAllConcepts } from "@/lib/mdx";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function GET() {
  const concepts = getAllConcepts();
  return Response.json(concepts, { headers: CORS_HEADERS });
}
