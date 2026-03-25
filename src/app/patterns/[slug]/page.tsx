import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  getPatternBySlug,
  getAllPatternSlugs,
  getAllConcepts,
  buildSearchIndex,
} from "@/lib/mdx";
import SyntaxBlock from "@/components/function-page/SyntaxBlock";
import ContributorAvatars from "@/components/ContributorAvatars";
import { getContributors } from "@/lib/contributors";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPatternSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getPatternBySlug(slug);
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.description,
        url: `/patterns/${slug}`,
        type: "article",
      },
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

function renderBody(content: string) {
  const elements: { type: "p" | "h3" | "code" | "ul" | "ol"; content: string; lang?: string }[] = [];
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "powerquery";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push({ type: "code", content: codeLines.join("\n"), lang });
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push({ type: "h3", content: line.slice(4) });
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push({ type: "ul", content: items.join("\n") });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push({ type: "ol", content: items.join("\n") });
      continue;
    }

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

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: "var(--pq-logical-true)",
  intermediate: "var(--accent)",
  advanced: "#e67e22",
};

export default async function PatternPage({ params }: PageProps) {
  const { slug } = await params;

  let data;
  try {
    data = getPatternBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = data;
  const bodyElements = renderBody(content);
  const allConcepts = getAllConcepts();
  const allFunctions = buildSearchIndex();
  const contributors = getContributors("patterns", slug);

  const conceptTitleMap = new Map(allConcepts.map((c) => [c.slug, c.title]));
  const functionTitleMap = new Map(allFunctions.map((f) => [f.slug, f.title]));

  return (
    <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>
          <Link href="/patterns" style={{ color: "var(--accent)", textDecoration: "none", fontSize: 14 }}>
            Patterns
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontSize: 28, margin: 0 }}>{frontmatter.title}</h1>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: DIFFICULTY_COLOR[frontmatter.difficulty] ?? "var(--text-muted)",
              border: `1px solid ${DIFFICULTY_COLOR[frontmatter.difficulty] ?? "var(--border-color)"}`,
              borderRadius: 4,
              padding: "2px 8px",
              flexShrink: 0,
            }}
          >
            {DIFFICULTY_LABEL[frontmatter.difficulty] ?? frontmatter.difficulty}
          </span>
        </div>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>{frontmatter.description}</p>
      </div>

      <div className="concept-body">
        {bodyElements.map((el, i) => {
          if (el.type === "h3") {
            return <h3 key={i} style={{ fontSize: 18, marginTop: 28, marginBottom: 12 }}>{el.content}</h3>;
          }
          if (el.type === "code") {
            return (
              <div key={i} style={{ margin: "16px 0" }}>
                <SyntaxBlock code={el.content} language={el.lang} />
              </div>
            );
          }
          if (el.type === "ul") {
            return (
              <ul key={i} className="concept-list">
                {el.content.split("\n").map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
                ))}
              </ul>
            );
          }
          if (el.type === "ol") {
            return (
              <ol key={i} className="concept-list">
                {el.content.split("\n").map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
                ))}
              </ol>
            );
          }
          return (
            <p
              key={i}
              style={{ lineHeight: 1.7, marginBottom: 16 }}
              dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(el.content) }}
            />
          );
        })}
      </div>

      {frontmatter.relatedConcepts?.length > 0 && (
        <div className="related-functions" style={{ marginTop: 32 }}>
          <h2>Related Concepts</h2>
          <ul>
            {frontmatter.relatedConcepts.map((s) => (
              <li key={s}>
                <Link href={`/concepts/${s}`}>{conceptTitleMap.get(s) ?? s}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {frontmatter.relatedFunctions?.length > 0 && (
        <div className="related-functions">
          <h2>Related Functions</h2>
          <ul>
            {frontmatter.relatedFunctions.map((s) => (
              <li key={s}>
                <Link href={`/functions/${s}`}>
                  <code>{functionTitleMap.get(s) ?? s}</code>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ContributorAvatars contributors={contributors} />
    </article>
  );
}
