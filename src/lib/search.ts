import Fuse from "fuse.js";
import { FunctionIndexEntry } from "./types";

export function createSearchIndex(functions: FunctionIndexEntry[]) {
  return new Fuse(functions, {
    keys: [
      { name: "title", weight: 2 },
      { name: "description", weight: 1 },
      { name: "keywords", weight: 0.8 },
      { name: "category", weight: 0.5 },
    ],
    threshold: 0.3,
    includeScore: true,
  });
}
