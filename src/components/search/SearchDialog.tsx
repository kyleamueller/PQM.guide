"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { FunctionIndexEntry } from "@/lib/types";

interface SearchDialogProps {
  functions: FunctionIndexEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDialog({ functions, isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FunctionIndexEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = useRef(
    new Fuse(functions, {
      keys: [
        { name: "title", weight: 2 },
        { name: "description", weight: 1 },
        { name: "category", weight: 0.5 },
      ],
      threshold: 0.3,
      includeScore: true,
    })
  );

  useEffect(() => {
    fuse.current = new Fuse(functions, {
      keys: [
        { name: "title", weight: 2 },
        { name: "description", weight: 1 },
        { name: "category", weight: 0.5 },
      ],
      threshold: 0.3,
      includeScore: true,
    });
  }, [functions]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults(functions.slice(0, 10));
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, functions]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(functions.slice(0, 10));
      return;
    }
    const hits = fuse.current.search(query, { limit: 15 });
    setResults(hits.map((h) => h.item));
    setSelectedIndex(0);
  }, [query, functions]);

  const navigate = useCallback(
    (slug: string) => {
      onClose();
      router.push(`/functions/${slug}`);
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
        navigate(results[selectedIndex].slug);
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
            placeholder="Search functions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="search-kbd">Esc</kbd>
        </div>
        {results.length > 0 && (
          <ul className="search-results">
            {results.map((fn, i) => (
              <li key={fn.slug}>
                <button
                  className={`search-result-item ${i === selectedIndex ? "selected" : ""}`}
                  onClick={() => navigate(fn.slug)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <span className="search-result-title">{fn.title}</span>
                  <span className="search-result-category">{fn.category}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {results.length === 0 && query && (
          <div className="search-no-results">No functions found for &ldquo;{query}&rdquo;</div>
        )}
      </div>
    </div>
  );
}
