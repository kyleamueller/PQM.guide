import Link from "next/link";
import { FunctionIndexEntry } from "@/lib/types";

interface RelatedFunctionsProps {
  slugs: string[];
  allFunctions?: FunctionIndexEntry[];
}

export default function RelatedFunctions({ slugs, allFunctions }: RelatedFunctionsProps) {
  if (!slugs || slugs.length === 0) return null;

  const titleMap = new Map(allFunctions?.map((f) => [f.slug, f.title]) ?? []);

  return (
    <div className="related-functions">
      <h2>Related Functions</h2>
      <ul>
        {slugs.map((slug) => (
          <li key={slug}>
            <Link href={`/functions/${slug}`}>
              <code>{titleMap.get(slug) ?? slug}</code>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
