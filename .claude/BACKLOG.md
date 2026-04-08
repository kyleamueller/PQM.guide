# PQM.guide Backlog

> This file is the canonical backlog for PQM.guide. Claude will check here first at the start of any session.
> Status: `[ ]` = todo · `[~]` = in progress · `[x]` = done

---

## P2 — High impact, moderate effort

- [ ] **GitHub link → direct source file** — The GitHub icon in the bottom-right of each page should link directly to the source MDX file for that page in GitHub (for easy contribution), not just the repo homepage.
- [ ] **Sample tables: surface the M code** — The M code on the sample tables page is too hidden; make it more discoverable/visible. *(Alex)*
- [ ] **Add M formatting to the MCP Server** — Enhance the MCP server to enable it to automatically format M code *(Bernat)*

---

## P3 — Valuable features, more design work

- [ ] **Resources: add Dom's book + Alex Powers articles** — Add Dom's Power Query book and Alex Powers' query folding articles to the Resources page. Find other high-quality additions too. *(Kerski)*
- [ ] **Schema/data view toggle** — Inspired by the Power BI Dataflows UI: add a toggle on sample tables (and/or function pages) to switch between a data view and a schema view (column names, types, icons). Makes the site feel more like it's teaching Power Query end-to-end. *(Alex)*

---

## P4 — Strategic / needs a decision first

- [ ] **TMDL script for sample tables** — In addition to the M/Power Query code, provide a TMDL script so users can load sample tables directly via that path. *(Kerski)*
- [ ] **Autonomous monthly content review** — Replace the current "create a reminder issue" workflow with a Claude Code headless run that automatically researches Microsoft blogs/docs, updates stale content, and opens a PR. Plan saved at `.claude/plans/autonomous-content-review.md`. Requires adding `ANTHROPIC_API_KEY` to GitHub Actions secrets.
