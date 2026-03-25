import Fuse from "fuse.js";
import { SearchIndexEntry } from "./types";

export function createSearchIndex(items: SearchIndexEntry[]) {
  return new Fuse(items, {
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
