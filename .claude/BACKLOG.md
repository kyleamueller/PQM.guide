# PQM.guide Backlog

> This file is the canonical backlog for PQM.guide. Claude will check here first at the start of any session.
> Status: `[ ]` = todo · `[~]` = in progress · `[x]` = done

---

## P1 — Fix first (bugs / quick wins)

- [x] **Fix 404 at `/categories`** — Created `/categories/page.tsx` index page listing all 24 categories. *(Alex)*
- [x] **Fuzzy match: markdown table not converting to HTML** — Fixed in function page remarks renderer (`renderRemarks`) and concepts body renderer (`renderConceptBody`). Added `.markdown-table` CSS. *(Kerski)*
- [x] **Standardize input/output wording** — Changed "Result" label to "Output" in `ExampleSection.tsx`. Now consistently uses Input / Output across all function example sections. *(Alex)*
- [x] **Licensing** — MIT for code (`LICENSE`), CC BY 4.0 for content (`LICENSE-CONTENT`). README updated with licensing section.

---

## P2 — High impact, moderate effort

- [x] **Search: include concepts and patterns** — Upgraded search to return results from functions, concepts, and patterns with type badges.
- [x] **Patterns homepage prominence** — Added third action card and spotlight grid of up to 4 featured patterns (beginner-first) with difficulty badges.
- [x] **GitHub contributor attribution** — Shows contributor avatars/usernames on each page based on git history, similar to MS Docs.
- [ ] **GitHub link → direct source file** — The GitHub icon in the bottom-right of each page should link directly to the source MDX file for that page in GitHub (for easy contribution), not just the repo homepage.
- [ ] **Sample tables: surface the M code** — The M code on the sample tables page is too hidden; make it more discoverable/visible. *(Alex)*
- [ ] **Full relatedFunctions reference audit** — Once all 661 functions are documented, tighten the content-integrity test back to only allow references to existing documented slugs (currently allows forward references to official spec slugs). Run a full scan to verify every relatedFunctions entry resolves to a real page.
- [ ] **Internal-only function tagging + concept page** — (1) Add an `internal: true` frontmatter flag to all internal-only function pages and surface it in the UI (e.g., a badge or banner on the function page). (2) Create a concept guide (`src/content/concepts/internal-functions.mdx`) explaining what internal-only functions are, why Microsoft exposes them in the spec without full documentation, why PQM.guide still documents them (completeness, discoverability, preventing confusion when users encounter them), and guidance on when it's safe to ignore them vs. when connector developers may need them.

---

## P3 — Valuable features, more design work

- [ ] **Resources: add Dom's book + Alex Powers articles** — Add Dom Petri's Power Query book and Alex Powers' query folding articles to the Resources page. Find other high-quality additions too. *(Kerski)*
- [ ] **Schema/data view toggle** — Inspired by the Power BI Dataflows UI: add a toggle on sample tables (and/or function pages) to switch between a data view and a schema view (column names, types, icons). Makes the site feel more like it's teaching Power Query end-to-end. *(Alex)*

---

## P4 — Strategic / needs a decision first

- [ ] **TMDL script for sample tables** — In addition to the M/Power Query code, provide a TMDL script so users can load sample tables directly via that path. *(Kerski)*
- [x] **MCP + Skills** — Supplement the MCP server with Skills. Reference: https://medium.com/@dan.avila7/separation-of-responsibilities-mcp-vs-skills-70a0d197f5d3 *(Kerski)*
