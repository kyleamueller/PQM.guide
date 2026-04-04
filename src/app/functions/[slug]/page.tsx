import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getFunctionBySlug, getAllFunctionSlugs, buildSearchIndex } from "@/lib/mdx";
import { PQTableData, ExampleStep } from "@/lib/types";
import FunctionHeader from "@/components/function-page/FunctionHeader";
import SyntaxBlock from "@/components/function-page/SyntaxBlock";
import ParametersTable from "@/components/function-page/ParametersTable";
import ExampleSection from "@/components/function-page/ExampleSection";
import RelatedFunctions from "@/components/function-page/RelatedFunctions";
import CompatibilityBadges from "@/components/function-page/CompatibilityBadges";
import SampleTablesBanner from "@/components/function-page/SampleTablesBanner";
import ContributorAvatars from "@/components/ContributorAvatars";
import { getContributors } from "@/lib/contributors";

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
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.description,
        url: `/functions/${slug}`,
        type: "article",
      },
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
    steps?: ExampleStep[];
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

    const stepsMatch = body.match(/<!--steps\n([\s\S]*?)-->/);
    let steps: ExampleStep[] | undefined;
    if (stepsMatch) {
      try {
        const parsed = JSON.parse(stepsMatch[1]) as { steps: ExampleStep[] };
        steps = parsed.steps;
      } catch {
        // skip malformed JSON
      }
    }

    if (code) {
      examples.push({ title, description, code, inputTableRef, outputTable, steps });
    }
  }

  return examples;
}

function parseRemarks(content: string): string | null {
  const remarksMatch = content.match(/## Remarks\n([\s\S]*?)(?=## Examples|## Related|$)/);
  return remarksMatch ? remarksMatch[1].trim() : null;
}

function parseInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderRemarks(remarks: string) {
  const elements: React.ReactElement[] = [];
  const lines = remarks.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const nonSep = tableLines.filter((l) => !/^\|[\s\-:|]+\|$/.test(l.trim()));
      const toCell = (l: string) => l.split("|").map((s) => s.trim()).filter(Boolean);
      const headers = toCell(nonSep[0] ?? "");
      const rows = nonSep.slice(1).map(toCell);
      elements.push(
        <table key={key++} className="markdown-table">
          <thead>
            <tr>{headers.map((h, j) => <th key={j} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(h) }} />)}</tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cell) }} />)}</tr>
            ))}
          </tbody>
        </table>
      );
      continue;
    }

    if (line.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="concept-list">
          {listItems.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
          ))}
        </ul>
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("|") &&
      !lines[i].startsWith("- ")
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    elements.push(
      <p key={key++} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(paraLines.join(" ")) }} />
    );
  }

  return elements;
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
  const contributors = getContributors("functions", slug);

  const categorySlug = frontmatter.category.toLowerCase().replace(/\s+/g, "-");

  return (
    <article>
      <nav style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <Link href="/categories" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Functions</Link>
        <span>›</span>
        <Link href={`/categories/${categorySlug}`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>{frontmatter.category}</Link>
        <span>›</span>
        <span style={{ color: "var(--text-secondary)" }}>{frontmatter.title}</span>
      </nav>
      <FunctionHeader
        title={frontmatter.title}
        category={frontmatter.category}
        description={frontmatter.description}
        internal={frontmatter.internal}
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
          {renderRemarks(remarks)}
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
              steps={ex.steps}
            />
          ))}
        </section>
      )}

      <RelatedFunctions slugs={frontmatter.relatedFunctions} allFunctions={allFunctions} />
      <CompatibilityBadges compatibility={frontmatter.compatibility} />
      <ContributorAvatars contributors={contributors} />
    </article>
  );
}
