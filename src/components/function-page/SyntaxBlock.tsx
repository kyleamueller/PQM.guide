import Prism from "prismjs";
import "@/lib/prism-powerquery";

interface SyntaxBlockProps {
  code: string;
  language?: string;
}

export default function SyntaxBlock({ code, language = "powerquery" }: SyntaxBlockProps) {
  const grammar = Prism.languages[language];
  const html = grammar ? Prism.highlight(code, grammar, language) : code;

  return (
    <div className="syntax-block">
      <pre className={`language-${language}`} tabIndex={0}>
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );
}
