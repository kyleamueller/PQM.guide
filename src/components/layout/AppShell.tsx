"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import SearchDialog from "@/components/search/SearchDialog";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { FunctionIndexEntry, SearchIndexEntry } from "@/lib/types";
import { hasConsentBeenGiven } from "@/lib/consent";

interface AppShellProps {
  functions: FunctionIndexEntry[];
  searchItems: SearchIndexEntry[];
  children: React.ReactNode;
}

export default function AppShell({ functions, searchItems, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showCookieBtn, setShowCookieBtn] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setShowCookieBtn(hasConsentBeenGiven());
  }, []);

  return (
    <>
      <div className="app-body">
        <Sidebar
          functions={functions}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSearchOpen={() => setSearchOpen(true)}
        />
        <main className="main-content">
          <button
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {children}
        </main>
      </div>
      <SearchDialog
        items={searchItems}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
      <div className="page-utility-bar">
        {showCookieBtn && (
          <button
            className="utility-bar-link"
            onClick={() => {
              window.dispatchEvent(new Event("pqm:reset-consent"));
              setShowCookieBtn(false);
            }}
            aria-label="Cookie settings"
            title="Cookie settings"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 1a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm0 16.5A7.5 7.5 0 1 1 17.5 10 7.508 7.508 0 0 1 10 17.5ZM8.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm2 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm4-1a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-3 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          </button>
        )}
        <ThemeToggle />
        <a
          href="https://github.com/kyleamueller/PQM.guide"
          className="utility-bar-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="View on GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>
    </>
  );
}
