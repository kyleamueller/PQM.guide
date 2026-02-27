import { Compatibility } from "@/lib/types";

interface CompatibilityBadgesProps {
  compatibility: Compatibility;
}

const labels: Record<keyof Compatibility, string> = {
  pbiDesktop: "Power BI Desktop",
  pbiService: "Power BI Service",
  excelDesktop: "Excel Desktop",
  excelOnline: "Excel Online",
  dataflows: "Dataflows",
  fabricNotebooks: "Fabric Notebooks",
};

export default function CompatibilityBadges({ compatibility }: CompatibilityBadgesProps) {
  if (!compatibility) return null;

  return (
    <div className="compatibility-section">
      <h2>Compatibility</h2>
      <div className="compatibility-badges">
        {(Object.keys(labels) as (keyof Compatibility)[]).map((key) => (
          <span
            key={key}
            className={`compat-badge ${compatibility[key] ? "compat-yes" : "compat-no"}`}
          >
            {compatibility[key] ? "\u2713" : "\u2717"} {labels[key]}
          </span>
        ))}
      </div>
    </div>
  );
}
