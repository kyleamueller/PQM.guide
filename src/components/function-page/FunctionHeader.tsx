interface FunctionHeaderProps {
  title: string;
  category: string;
  description: string;
}

export default function FunctionHeader({ title, category, description }: FunctionHeaderProps) {
  return (
    <div className="function-header">
      <div className="function-header-top">
        <h1>{title}</h1>
        <span className="category-badge">{category}</span>
      </div>
      <p className="function-description">{description}</p>
    </div>
  );
}
