/**
 * Lightweight inline-markdown parser used in function pages.
 *
 * Handles: **bold**, [link](url), and `code`.
 * M function names inside backticks (e.g. `Table.AddColumn`) are
 * automatically linked to their function page when that page exists.
 */

import { getMNameHref } from "./function-links";

function codeToHtml(inner: string, functionSlugs: ReadonlySet<string>): string {
  const href = getMNameHref(inner, functionSlugs);
  if (href) {
    return `<a href="${href}" class="fn-link"><code>${inner}</code></a>`;
  }
  return `<code>${inner}</code>`;
}

export function parseInlineMarkdown(text: string, functionSlugs: ReadonlySet<string>): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, (_, inner) => codeToHtml(inner, functionSlugs));
}
