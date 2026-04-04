interface FunctionHeaderProps {
  title: string;
  category: string;
  description: string;
  internal?: boolean;
}

export default function FunctionHeader({ title, category, description, internal }: FunctionHeaderProps) {
  return (
    <div className="function-header">
      <div className="function-header-top">
        <h1>{title}</h1>
        <span className="category-badge">{category}</span>
        {internal && <span className="internal-badge">Internal</span>}
      </div>
      <p className="function-description">{description}</p>
    </div>
  );
}
