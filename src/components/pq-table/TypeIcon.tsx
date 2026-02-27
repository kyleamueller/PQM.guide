import { PQColumnType } from "@/lib/types";

interface TypeIconProps {
  type: PQColumnType;
  className?: string;
}

export default function TypeIcon({ type, className }: TypeIconProps) {
  const size = 16;
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    className: className,
    "aria-hidden": true as const,
  };

  switch (type) {
    case "text":
      return (
        <svg {...common} fill="none">
          <text x="1" y="12" fontSize="10" fontWeight="700" fontFamily="Segoe UI, sans-serif" fill="currentColor">
            ABC
          </text>
        </svg>
      );
    case "number":
      return (
        <svg {...common} fill="none">
          <text x="0" y="12" fontSize="10" fontWeight="700" fontFamily="Segoe UI, sans-serif" fill="currentColor">
            123
          </text>
        </svg>
      );
    case "date":
    case "datetime":
    case "datetimezone":
      return (
        <svg {...common} fill="none">
          <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1" y1="5.5" x2="15" y2="5.5" stroke="currentColor" strokeWidth="1" />
          <line x1="5" y1="2" x2="5" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="10" y1="2" x2="10" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        </svg>
      );
    case "time":
    case "duration":
      return (
        <svg {...common} fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="8" y1="4" x2="8" y2="8" stroke="currentColor" strokeWidth="1.2" />
          <line x1="8" y1="8" x2="11" y2="10" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "logical":
      return (
        <svg {...common} fill="none">
          <rect x="2" y="4" width="12" height="8" rx="4" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="10" cy="8" r="2.5" fill="currentColor" />
        </svg>
      );
    case "any":
    default:
      return (
        <svg {...common} fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
          <text x="5.5" y="11" fontSize="8" fontWeight="700" fontFamily="Segoe UI, sans-serif" fill="currentColor">
            ?
          </text>
        </svg>
      );
  }
}
