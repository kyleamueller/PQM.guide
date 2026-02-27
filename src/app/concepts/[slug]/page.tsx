import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  getConceptBySlug,
  getAllConceptSlugs,
  getAllConcepts,
  buildSearchIndex,
} from "@/lib/mdx";
import SyntaxBlock from "@/components/function-page/SyntaxBlock";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllConceptSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getConceptBySlug(slug);
    return {
      title: frontmatter.title,
      description: frontmatter.description,
    };
  } catch {
    return { title: "Not Found" };
  }
}

function parseInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderConceptBody(content: string) {
  const elements: { type: "p" | "h3" | "code" | "ul"; content: string }[] = [];
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push({ type: "code", content: codeLines.join("\n") });
      continue;
    }

    // Heading
    if (line.startsWith("### ")) {
      elements.push({ type: "h3", content: line.slice(4) });
      i++;
      continue;
    }

    // Unordered list
    if (line.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push({ type: "ul", content: listItems.join("\n") });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push({ type: "ul", content: listItems.join("\n") });
      continue;
    }

    // Paragraph (collect consecutive non-empty lines)
    if (line.trim() !== "") {
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].startsWith("### ") &&
        !lines[i].startsWith("```") &&
        !lines[i].startsWith("- ") &&
        !/^\d+\.\s/.test(lines[i])
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      elements.push({ type: "p", content: paraLines.join(" ") });
      continue;
    }

    i++;
  }

  return elements;
}

export default async function ConceptPage({ params }: PageProps) {
  const { slug } = await params;

  let data;
  try {
    data = getConceptBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = data;
  const bodyElements = renderConceptBody(content);
  const allConcepts = getAllConcepts();
  const allFunctions = buildSearchIndex();

  const conceptTitleMap = new Map(allConcepts.map((c) => [c.slug, c.title]));
  const functionTitleMap = new Map(allFunctions.map((f) => [f.slug, f.title]));

  return (
    <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>
          <Link
            href="/concepts"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Concepts
          </Link>
        </div>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>{frontmatter.title}</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {frontmatter.description}
        </p>
      </div>

      <div className="concept-body">
        {bodyElements.map((el, i) => {
          if (el.type === "h3") {
            return (
              <h3 key={i} style={{ fontSize: 18, marginTop: 28, marginBottom: 12 }}>
                {el.content}
              </h3>
            );
          }
          if (el.type === "code") {
            return (
              <div key={i} style={{ margin: "16px 0" }}>
                <SyntaxBlock code={el.content} />
              </div>
            );
          }
          if (el.type === "ul") {
            return (
              <ul key={i} className="concept-list">
                {el.content.split("\n").map((item, j) => (
                  <li
                    key={j}
                    dangerouslySetInnerHTML={{
                      __html: parseInlineMarkdown(item),
                    }}
                  />
                ))}
              </ul>
            );
          }
          return (
            <p
              key={i}
              style={{ lineHeight: 1.7, marginBottom: 16 }}
              dangerouslySetInnerHTML={{
                __html: parseInlineMarkdown(el.content),
              }}
            />
          );
        })}
      </div>

      {frontmatter.relatedConcepts && frontmatter.relatedConcepts.length > 0 && (
        <div className="related-functions" style={{ marginTop: 32 }}>
          <h2>Related Concepts</h2>
          <ul>
            {frontmatter.relatedConcepts.map((slug) => (
              <li key={slug}>
                <Link href={`/concepts/${slug}`}>
                  {conceptTitleMap.get(slug) ?? slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {frontmatter.relatedFunctions && frontmatter.relatedFunctions.length > 0 && (
        <div className="related-functions">
          <h2>Related Functions</h2>
          <ul>
            {frontmatter.relatedFunctions.map((slug) => (
              <li key={slug}>
                <Link href={`/functions/${slug}`}>
                  <code>{functionTitleMap.get(slug) ?? slug}</code>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
