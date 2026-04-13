# PQM.guide Backlog

> This file is the canonical backlog for PQM.guide. Claude will check here first at the start of any session.
> Status: `[ ]` = todo · `[~]` = in progress · `[x]` = done

---

## P2 — High impact, moderate effort

- [ ] **GitHub link → direct source file** — The GitHub icon in the bottom-right of each page should link directly to the source MDX file for that page in GitHub (for easy contribution), not just the repo homepage.
- [ ] **Sample tables: surface the M code** — The M code on the sample tables page is too hidden; make it more discoverable/visible. *(Alex)*
- [x] **Add M formatting to the MCP Server** — Enhance the MCP server to enable it to automatically format M code *(Bernat)*

---

## P3 — Valuable features, more design work

- [ ] **Resources: add Dom's book + Alex Powers articles** — Add Dom's Power Query book and Alex Powers' query folding articles to the Resources page. Find other high-quality additions too. *(Kerski)*
- [ ] **Schema/data view toggle** — Inspired by the Power BI Dataflows UI: add a toggle on sample tables (and/or function pages) to switch between a data view and a schema view (column names, types, icons). Makes the site feel more like it's teaching Power Query end-to-end. *(Alex)*
- [ ] **Revisit `format_m_code` input handling strategy** — v1 relies on `@microsoft/powerquery-formatter` accepting both documents and bare expressions natively. Confirm this holds across real usage; consider an explicit `mode: "document" | "expression"` arg if ambiguity shows up.
- [ ] **Enforce canonical M formatting in CI** — Add a pre-commit / CI check that every ` ```powerquery ` block in `src/content/` round-trips unchanged through `formatMCode`. Natural follow-up to the formatter work.

---

## P4 — Strategic / needs a decision first

- [ ] **TMDL script for sample tables** — In addition to the M/Power Query code, provide a TMDL script so users can load sample tables directly via that path. *(Kerski)*
- [ ] **Autonomous monthly content review** — Replace the current "create a reminder issue" workflow with a Claude Code headless run that automatically researches Microsoft blogs/docs, updates stale content, and opens a PR. Plan saved at `.claude/plans/autonomous-content-review.md`. Requires adding `ANTHROPIC_API_KEY` to GitHub Actions secrets.
- [ ] **Build our own M formatter** — Replace `@microsoft/powerquery-formatter` with a house formatter for full style control (indent size, line-wrap rules, trailing commas, etc.). The current dependency gets us live fast; a custom formatter would let us match site conventions exactly and enable lint-level rules.
- [ ] **Explore additional MCP tools leveraging site context (e.g. M Best Practices Analyzer)** — With the parser now wired up, we have an AST we can walk. Candidate: a BPA-style `analyze_m_code` tool that flags anti-patterns (missing type annotations, non-folding steps, hardcoded file paths, `Table.Buffer` misuse, etc.) and returns rule explanations sourced from pqm.guide concepts/patterns. Tabular Editor's BPA rule-authoring model is a useful reference.
