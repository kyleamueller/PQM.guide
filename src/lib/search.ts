import Fuse from "fuse.js";
import { FunctionIndexEntry } from "./types";

export function createSearchIndex(functions: FunctionIndexEntry[]) {
  return new Fuse(functions, {
    keys: [
      { name: "title", weight: 2 },
      { name: "description", weight: 1 },
      { name: "category", weight: 0.5 },
    ],
    threshold: 0.3,
    includeScore: true,
  });
}
