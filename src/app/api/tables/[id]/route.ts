import { sampleTables } from "@/data/sample-tables";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface RouteParams {
  params: Promise<{ id: string }>;
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  // Accept any casing and an optional .json suffix (e.g. /api/tables/sales.json)
  const wanted = id.replace(/\.json$/i, "").toLowerCase();
  const table = Object.values(sampleTables).find((t) => t.id.toLowerCase() === wanted);

  if (!table) {
    return Response.json(
      { error: `Table not found: "${id}"`, available: Object.keys(sampleTables) },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  return Response.json(table.data, { headers: CORS_HEADERS });
}
