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
  const table = sampleTables[id];

  if (!table) {
    return Response.json(
      { error: `Table not found: "${id}"`, available: Object.keys(sampleTables) },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  return Response.json(table.data, { headers: CORS_HEADERS });
}
