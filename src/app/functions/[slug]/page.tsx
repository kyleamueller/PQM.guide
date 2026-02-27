import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getFunctionBySlug, getAllFunctionSlugs, buildSearchIndex } from "@/lib/mdx";
import { PQTableData } from "@/lib/types";
import FunctionHeader from "@/components/function-page/FunctionHeader";
import SyntaxBlock from "@/components/function-page/SyntaxBlock";
import ParametersTable from "@/components/function-page/ParametersTable";
import ExampleSection from "@/components/function-page/ExampleSection";
import RelatedFunctions from "@/components/function-page/RelatedFunctions";
import CompatibilityBadges from "@/components/function-page/CompatibilityBadges";
import SampleTablesBanner from "@/components/function-page/SampleTablesBanner";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllFunctionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getFunctionBySlug(slug);
    return {
      title: frontmatter.title,
      description: frontmatter.description,
    };
  } catch {
    return { title: "Not Found" };
  }
}

function parseExamples(content: string) {
  const examples: Array<{
    title: string;
    description: string;
    code: string;
    inputTableRef?: string;
    outputTable?: PQTableData;
  }> = [];

  const exampleRegex = /### Example \d+:\s*(.+?)(?:\n|\r\n)([\s\S]*?)(?=### Example \d+:|## |$)/g;
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
  const remarksMatch = content.match(/## Remarks\n([\s\S]*?)(?=## Examples|## Related|$)/);
  return remarksMatch ? remarksMatch[1].trim() : null;
}

export default async function FunctionPage({ params }: PageProps) {
  const { slug } = await params;

  let data;
  try {
    data = getFunctionBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = data;
  const examples = parseExamples(content);
  const remarks = parseRemarks(content);
  const allFunctions = buildSearchIndex();

  return (
    <article>
      <FunctionHeader
        title={frontmatter.title}
        category={frontmatter.category}
        description={frontmatter.description}
      />

      <SampleTablesBanner />

      <section>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Syntax</h2>
        <SyntaxBlock code={frontmatter.syntax} />
      </section>

      <ParametersTable parameters={frontmatter.parameters} />

      <section style={{ margin: "24px 0" }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Return Value</h2>
        <p>
          <code>{frontmatter.returnType}</code> &mdash; {frontmatter.returnDescription}
        </p>
      </section>

      {remarks && (
        <section className="remarks-section" style={{ margin: "24px 0" }}>
          <h2>Remarks</h2>
          {remarks.split("\n\n").map((para, i) => (
            <p key={i} dangerouslySetInnerHTML={{
              __html: para.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>').replace(/`([^`]+)`/g, "<code>$1</code>")
            }} />
          ))}
        </section>
      )}

      {examples.length > 0 && (
        <section style={{ margin: "32px 0" }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Examples</h2>
          {examples.map((ex, i) => (
            <ExampleSection
              key={i}
              index={i}
              title={ex.title}
              description={ex.description}
              code={ex.code}
              inputTableRef={ex.inputTableRef}
              outputTable={ex.outputTable}
            />
          ))}
        </section>
      )}

      <RelatedFunctions slugs={frontmatter.relatedFunctions} allFunctions={allFunctions} />
      <CompatibilityBadges compatibility={frontmatter.compatibility} />
    </article>
  );
}
