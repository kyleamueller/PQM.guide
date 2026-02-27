"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";
import { FunctionIndexEntry } from "@/lib/types";

interface SidebarProps {
  functions: FunctionIndexEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ functions, isOpen, onClose }: SidebarProps) {
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
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <Link href="/" className="sidebar-home" onClick={onClose}>
              Home
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
            <div className="sidebar-section-title">Functions by Category</div>
            {functionsByCategory.map((cat) => (
              <div key={cat.slug} className="sidebar-category">
                <button
                  className={`sidebar-category-btn ${expandedCategories.has(cat.slug) ? "expanded" : ""}`}
                  onClick={() => toggleCategory(cat.slug)}
                >
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
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
