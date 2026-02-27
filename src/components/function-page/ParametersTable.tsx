import { FunctionParam } from "@/lib/types";

interface ParametersTableProps {
  parameters: FunctionParam[];
}

export default function ParametersTable({ parameters }: ParametersTableProps) {
  if (!parameters || parameters.length === 0) return null;

  return (
    <div className="parameters-section">
      <h2>Parameters</h2>
      <table className="parameters-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param) => (
            <tr key={param.name}>
              <td><code>{param.name}</code></td>
              <td><code>{param.type}</code></td>
              <td>{param.required ? "Yes" : "No"}</td>
              <td>{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
