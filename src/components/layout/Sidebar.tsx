"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";
import { FunctionIndexEntry } from "@/lib/types";
import {
  Table20Filled,
  TextFontSize20Filled,
  NumberSymbol20Filled,
  Calendar20Filled,
  CalendarClock20Filled,
  Earth20Filled,
  Timer20Filled,
  AppsListDetail20Filled,
  Braces20Filled,
  ToggleLeft20Filled,
  Code20Filled,
  DataUsage20Filled,
  Tag20Filled,
  MathFormatProfessional20Filled,
  Database20Filled,
  Merge20Filled,
  ArrowSort20Filled,
  ArrowRepeat120Filled,
  ArrowSplit20Filled,
  TextAlignLeft20Filled,
  Globe20Filled,
  Circle20Regular,
} from "@fluentui/react-icons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryIcons: Record<string, React.ComponentType<any>> = {
  "table":          Table20Filled,
  "text":           TextFontSize20Filled,
  "number":         NumberSymbol20Filled,
  "date":           Calendar20Filled,
  "datetime":       CalendarClock20Filled,
  "datetimezone":   Earth20Filled,
  "duration":       Timer20Filled,
  "list":           AppsListDetail20Filled,
  "record":         Braces20Filled,
  "logical":        ToggleLeft20Filled,
  "binary":         Code20Filled,
  "type":           DataUsage20Filled,
  "value":          Tag20Filled,
  "function":       MathFormatProfessional20Filled,
  "expression":     Code20Filled,
  "accessing-data": Database20Filled,
  "combiner":       Merge20Filled,
  "comparer":       ArrowSort20Filled,
  "replacer":       ArrowRepeat120Filled,
  "splitter":       ArrowSplit20Filled,
  "lines":          TextAlignLeft20Filled,
  "uri":            Globe20Filled,
};

interface SidebarProps {
  functions: FunctionIndexEntry[];
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
}

export default function Sidebar({ functions, isOpen, onClose, onSearchOpen }: SidebarProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["table"]));

  const functionsByCategory = categories.map((cat) => ({
    ...cat,
    functions: functions.filter(
      (f) => f.category.toLowerCase().replace(/\s+/g, "-") === cat.slug
    ),
  }));

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        {/* Logo */}
        <Link href="/" className="sidebar-logo" onClick={onClose}>
          <span className="logo-pq">PQ</span>
          <span className="logo-m">M</span>
          <span className="logo-guide">.guide</span>
        </Link>

        {/* Search */}
        <button className="sidebar-search-trigger" onClick={() => { onSearchOpen(); onClose(); }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span>Search functions...</span>
          <kbd>Ctrl+K</kbd>
        </button>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <Link href="/" className={`sidebar-home ${pathname === "/" ? "active" : ""}`} onClick={onClose}>
              Home
            </Link>
          </div>
          <div className="sidebar-section">
            <Link
              href="/learn"
              className={`sidebar-home ${pathname?.startsWith("/learn") ? "active" : ""}`}
              onClick={onClose}
            >
              Start Here
            </Link>
          </div>
          <div className="sidebar-section">
            <Link
              href="/sample-tables"
              className={`sidebar-home ${pathname === "/sample-tables" ? "active" : ""}`}
              onClick={onClose}
            >
              Sample Tables
            </Link>
          </div>
          <div className="sidebar-section">
            <Link
              href="/resources"
              className={`sidebar-home ${pathname === "/resources" ? "active" : ""}`}
              onClick={onClose}
            >
              Resources
            </Link>
          </div>
          <div className="sidebar-section">
            <Link
              href="/concepts"
              className={`sidebar-home ${pathname?.startsWith("/concepts") ? "active" : ""}`}
              onClick={onClose}
            >
              Concepts
            </Link>
          </div>
          <div className="sidebar-section">
            <Link
              href="/patterns"
              className={`sidebar-home ${pathname?.startsWith("/patterns") ? "active" : ""}`}
              onClick={onClose}
            >
              Patterns
            </Link>
          </div>
          <div className="sidebar-section">
            <Link
              href="/mcp"
              className={`sidebar-home ${pathname?.startsWith("/mcp") ? "active" : ""}`}
              onClick={onClose}
            >
              MCP Server
            </Link>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-title">Functions by Category</div>
            {functionsByCategory.map((cat) => {
              const IconComponent = categoryIcons[cat.slug] ?? Circle20Regular;
              return (
                <div key={cat.slug} className="sidebar-category">
                  <button
                    className={`sidebar-category-btn ${expandedCategories.has(cat.slug) ? "expanded" : ""}`}
                    onClick={() => toggleCategory(cat.slug)}
                  >
                    <IconComponent className="sidebar-category-icon" />
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      className="sidebar-chevron"
                    >
                      <path d="M3 1.5L7 5L3 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>{cat.name}</span>
                    {cat.functions.length > 0 && (
                      <span className="sidebar-count">{cat.functions.length}</span>
                    )}
                  </button>
                  {expandedCategories.has(cat.slug) && cat.functions.length > 0 && (
                    <ul className="sidebar-function-list">
                      {cat.functions.map((fn) => (
                        <li key={fn.slug}>
                          <Link
                            href={`/functions/${fn.slug}`}
                            className={`sidebar-function-link ${pathname === `/functions/${fn.slug}` ? "active" : ""}`}
                            onClick={onClose}
                          >
                            {fn.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

      </aside>
    </>
  );
}
