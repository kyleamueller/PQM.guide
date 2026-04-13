import { formatMCode, validateMCode } from "@/lib/formatter";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  let body: { code?: unknown; action?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON." },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const code = typeof body.code === "string" ? body.code : "";
  const action = body.action === "validate" ? "validate" : "format";

  if (action === "validate") {
    const result = await validateMCode(code);
    return Response.json(result, { headers: CORS_HEADERS });
  }

  const result = await formatMCode(code);
  return Response.json(result, { headers: CORS_HEADERS });
}
