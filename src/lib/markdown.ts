/**
 * Lightweight inline-markdown parser used in function pages.
 *
 * Handles: **bold**, [link](url), and `code`.
 * M function names inside backticks (e.g. `Table.AddColumn`) are
 * automatically linked to their function page.
 */

const M_FUNCTION_PATTERN = /^[A-Z][a-zA-Z]*\.[A-Z0-9][a-zA-Z0-9]*$/;

function codeToHtml(inner: string): string {
  if (M_FUNCTION_PATTERN.test(inner)) {
    const slug = inner.toLowerCase().replace(/\./g, "-");
    return `<a href="/functions/${slug}" class="fn-link"><code>${inner}</code></a>`;
  }
  return `<code>${inner}</code>`;
}

export function parseInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, (_, inner) => codeToHtml(inner));
}
