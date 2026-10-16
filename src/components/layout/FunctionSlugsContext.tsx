"use client";

import { createContext, useContext } from "react";

// Slugs of every function page, provided by AppShell from the function list
// the layout already sends to the browser. Client components use it to link
// only to function pages that exist.
export const FunctionSlugsContext = createContext<ReadonlySet<string>>(new Set());

export function useFunctionSlugs(): ReadonlySet<string> {
  return useContext(FunctionSlugsContext);
}
