import { getFunctionBySlug } from "@/lib/mdx";
import { PQTableData } from "@/lib/types";

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

function parseExamples(content: string) {
  const examples: Array<{
    title: string;
    description: string;
    code: string;
    inputTableRef?: string;
    outputTable?: PQTableData;
  }> = [];

  const exampleRegex =
    /### Example \d+:\s*(.+?)(?:\n|\r\n)([\s\S]*?)(?=### Example \d+:|## |$)/g;
  let match;

  while ((match = exampleRegex.exec(content)) !== null) {
    const title = match[1].trim();
    const body = match[2];

    const descMatch = body.match(/^(.+?)(?:\n|\r\n)/);
    const description = descMatch ? descMatch[1].trim() : "";

    const codeMatch = body.match(/```powerquery\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : "";

    const inputRefMatch = body.match(/Input:\s*`(\w+)`/);
    const inputTableRef = inputRefMatch ? inputRefMatch[1] : undefined;

    const outputMatch = body.match(/<!--output\n([\s\S]*?)-->/);
    let outputTable: PQTableData | undefined;
    if (outputMatch) {
      try {
        outputTable = JSON.parse(outputMatch[1]) as PQTableData;
      } catch {
        // skip malformed JSON
      }
    }

    if (code) {
      examples.push({ title, description, code, inputTableRef, outputTable });
    }
  }

  return examples;
}

function parseRemarks(content: string): string | null {
  const match = content.match(/## Remarks\n([\s\S]*?)(?=## Examples|## Related|$)/);
  return match ? match[1].trim() : null;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = getFunctionBySlug(slug);
    const examples = parseExamples(content);
    const remarks = parseRemarks(content);

    return Response.json(
      { ...frontmatter, slug, remarks, examples },
      { headers: CORS_HEADERS }
    );
  } catch {
    return Response.json({ error: "Function not found" }, { status: 404, headers: CORS_HEADERS });
  }
}
