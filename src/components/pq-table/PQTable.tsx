import { PQTableData, PQColumnType } from "@/lib/types";
import TypeIcon from "./TypeIcon";
import styles from "./pq-table.module.css";

interface PQTableProps {
  data: PQTableData;
  caption?: string;
  maxRows?: number;
}

function formatCellValue(value: unknown, type: PQColumnType): { text: string; className: string } {
  if (value === null || value === undefined || value === "") {
    return { text: "null", className: styles.cellNull };
  }

  switch (type) {
    case "number": {
      const num = typeof value === "number" ? value : Number(value);
      if (isNaN(num)) return { text: String(value), className: styles.cell };
      const formatted = num % 1 === 0 ? num.toLocaleString() : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return { text: formatted, className: `${styles.cell} ${styles.cellNumber}` };
    }
    case "date": {
      const d = new Date(String(value));
      if (isNaN(d.getTime())) return { text: String(value), className: styles.cell };
      return {
        text: `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`,
        className: `${styles.cell} ${styles.cellDate}`,
      };
    }
    case "datetime":
    case "datetimezone": {
      const dt = new Date(String(value));
      if (isNaN(dt.getTime())) return { text: String(value), className: styles.cell };
      return {
        text: `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()} ${dt.toLocaleTimeString()}`,
        className: `${styles.cell} ${styles.cellDate}`,
      };
    }
    case "logical": {
      const bool = typeof value === "boolean" ? value : String(value).toLowerCase() === "true";
      return {
        text: bool ? "TRUE" : "FALSE",
        className: `${styles.cell} ${bool ? styles.cellLogicalTrue : styles.cellLogicalFalse}`,
      };
    }
    default:
      return { text: String(value), className: styles.cell };
  }
}

export default function PQTable({ data, caption, maxRows }: PQTableProps) {
  const { columns, rows } = data;
  const displayRows = maxRows ? rows.slice(0, maxRows) : rows;

  return (
    <div className={styles.tableWrapper}>
      {caption && <div className={styles.caption}>{caption}</div>}
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.rowNumberHeader} aria-label="Row number" />
            {columns.map((col) => (
              <th key={col.name} className={styles.headerCell}>
                <div className={styles.headerContent}>
                  <TypeIcon type={col.type} className={styles.typeIcon} />
                  <span className={styles.columnName}>{col.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, rowIdx) => (
            <tr key={rowIdx} className={rowIdx % 2 === 0 ? styles.row : styles.rowAlt}>
              <td className={styles.rowNumberCell}>{rowIdx + 1}</td>
              {columns.map((col) => {
                const { text, className } = formatCellValue(row[col.name], col.type);
                return (
                  <td key={col.name} className={className || styles.cell}>
                    {text}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {maxRows && rows.length > maxRows && (
        <div className={styles.caption} style={{ borderTop: "1px solid var(--pq-border)", borderBottom: "none" }}>
          Showing {maxRows} of {rows.length} rows
        </div>
      )}
    </div>
  );
}
