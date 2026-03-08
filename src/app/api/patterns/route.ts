import { getAllPatterns } from "@/lib/mdx";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function GET() {
  const patterns = getAllPatterns();
  return Response.json(patterns, { headers: CORS_HEADERS });
}
