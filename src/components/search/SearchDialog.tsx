"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { SearchIndexEntry } from "@/lib/types";

interface SearchDialogProps {
  items: SearchIndexEntry[];
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_LABEL: Record<string, string> = {
  concept: "Concept",
  pattern: "Pattern",
};

function itemUrl(item: SearchIndexEntry): string {
  if (item.type === "concept") return `/concepts/${item.slug}`;
  if (item.type === "pattern") return `/patterns/${item.slug}`;
  return `/functions/${item.slug}`;
}

export default function SearchDialog({ items, isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchIndexEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = useRef(
    new Fuse(items, {
      keys: [
        { name: "title", weight: 2 },
        { name: "description", weight: 1 },
        { name: "keywords", weight: 0.8 },
        { name: "category", weight: 0.5 },
      ],
      threshold: 0.3,
      includeScore: true,
    })
  );

  useEffect(() => {
    fuse.current = new Fuse(items, {
      keys: [
        { name: "title", weight: 2 },
        { name: "description", weight: 1 },
        { name: "keywords", weight: 0.8 },
        { name: "category", weight: 0.5 },
      ],
      threshold: 0.3,
      includeScore: true,
    });
  }, [items]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults(items.slice(0, 10));
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, items]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(items.slice(0, 10));
      return;
    }
    const hits = fuse.current.search(query, { limit: 15 });
    setResults(hits.map((h) => h.item));
    setSelectedIndex(0);
  }, [query, items]);

  const navigate = useCallback(
    (item: SearchIndexEntry) => {
      onClose();
      router.push(itemUrl(item));
    },
    [onClose, router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        navigate(results[selectedIndex]);
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [results, selectedIndex, navigate, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-dialog" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="search-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="search-icon">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search functions, concepts, and patterns..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="search-kbd">Esc</kbd>
        </div>
        {results.length > 0 && (
          <ul className="search-results">
            {results.map((item, i) => (
              <li key={`${item.type}:${item.slug}`}>
                <button
                  className={`search-result-item ${i === selectedIndex ? "selected" : ""}`}
                  onClick={() => navigate(item)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <span className="search-result-title">{item.title}</span>
                  <span className="search-result-category">
                    {TYPE_LABEL[item.type] ?? item.category}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {results.length === 0 && query && (
          <div className="search-no-results">No results found for &ldquo;{query}&rdquo;</div>
        )}
      </div>
    </div>
  );
}
