import { Metadata } from "next";
import { sampleTables } from "@/data/sample-tables";
import PQTable from "@/components/pq-table/PQTable";
import SampleTableCode from "@/components/sample-tables/SampleTableCode";

export const metadata: Metadata = {
  title: "Sample Tables - PQM.guide",
  description:
    "Shared sample tables used throughout PQM.guide examples. These tables serve as the starting point for all function demonstrations.",
};

export default function SampleTablesPage() {
  const tables = Object.values(sampleTables);

  return (
    <div className="sample-tables-page">
      <div className="sample-tables-hero">
        <h1>Sample Tables</h1>
        <p>
          Every example on this site transforms one of the tables below.
          Instead of building a throwaway table with{" "}
          <code>Table.FromRecords</code> each time, we reference these shared
          datasets by name &mdash; just like you would with a real data source
          in Power Query.
        </p>
      </div>

      <div className="sample-tables-list">
        {tables.map((table) => (
          <section key={table.id} id={table.id.toLowerCase()} className="sample-table-card">
            <div className="sample-table-card-header">
              <h2>{table.displayName}</h2>
              <span className="sample-table-meta">
                {table.data.columns.length} columns &middot;{" "}
                {table.data.rows.length} rows
              </span>
            </div>
            <p className="sample-table-desc">{table.description}</p>
            <div className="sample-table-schema">
              <h3>Schema</h3>
              <div className="schema-chips">
                {table.data.columns.map((col) => (
                  <span key={col.name} className="schema-chip">
                    <span className="schema-chip-name">{col.name}</span>
                    <span className="schema-chip-type">{col.type}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="sample-table-preview">
              <PQTable data={table.data} />
            </div>
            <SampleTableCode table={table} />
          </section>
        ))}
      </div>

      <section className="sample-tables-usage">
        <h2>How examples reference these tables</h2>
        <p>
          When you see a code example like the one below, <code>Sales</code>{" "}
          refers to the Sales table shown above. Every example starts from one
          of these shared tables so you can focus on what the function does,
          rather than deciphering a <code>Table.FromRecords</code> wall of
          text.
        </p>
        <div className="usage-example-block">
          <pre>
            <code>Table.SelectRows(Sales, each [Region] = &quot;East&quot;)</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
