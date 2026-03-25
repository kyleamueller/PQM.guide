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

- [ ] **Search: include concepts** — Upgrade the search functionality to also return results from concept pages, not just functions.
- [ ] **Patterns homepage prominence** — Find a way to make the Patterns section shine more on the home page. *(Alex)*
- [ ] **Sample tables: surface the M code** — The M code on the sample tables page is too hidden; make it more discoverable/visible. *(Alex)*
- [ ] **GitHub contributor attribution** — Similar to MS Docs, show contributors on each page based on git history. Display avatars/usernames of people who have edited that file.

---

## P3 — Valuable features, more design work

- [ ] **Resources: add Dom's book + Alex Powers articles** — Add Dom Petri's Power Query book and Alex Powers' query folding articles to the Resources page. Find other high-quality additions too. *(Kerski)*
- [ ] **Schema/data view toggle** — Inspired by the Power BI Dataflows UI: add a toggle on sample tables (and/or function pages) to switch between a data view and a schema view (column names, types, icons). Makes the site feel more like it's teaching Power Query end-to-end. *(Alex)*

---

## P4 — Strategic / needs a decision first

- [ ] **TMDL script for sample tables** — In addition to the M/Power Query code, provide a TMDL script so users can load sample tables directly via that path. *(Kerski)*
- [ ] **MCP + Skills** — Supplement the MCP server with Skills. Reference: https://medium.com/@dan.avila7/separation-of-responsibilities-mcp-vs-skills-70a0d197f5d3 *(Kerski)*
