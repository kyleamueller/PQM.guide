import { getAllFunctions } from "@/lib/mdx";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function GET() {
  const functions = getAllFunctions();
  return Response.json(functions, { headers: CORS_HEADERS });
}
