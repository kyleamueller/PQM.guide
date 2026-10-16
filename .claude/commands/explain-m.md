Explain a Power Query M query step by step using pqm.guide as the source of truth.

---

## Steps

### 1. Receive the M code

The user pastes a Power Query M snippet — typically a `let … in …` query, occasionally a bare expression.

If the input is empty or clearly not M, ask for the code and stop.

---

### 2. Annotate first with the MCP tool

Call the `comment_m_code` MCP tool on the query with `style: "brief"`. This produces:
- A `// Query summary: A → B → C` line above `let` that shows the chain of Power Query UI step names.
- A one-line description above every step whose function is documented on pqm.guide.

Show the annotated code back to the user as the starting point of the explanation.

If `comment_m_code` errors out (e.g. the input isn't a `let … in …` block), skip this step and explain the code directly.

---

### 3. Walk through each step

Go through the applied steps in order. For each step:

1. Call `get_function` for the top-level M function it calls (e.g. `Table.SelectRows`, `Table.Sort`). If the step doesn't call a function (record-field access, literal, custom-function reference), skip the lookup — just describe what it does structurally.
2. Explain what the step does in one or two plain-English sentences.
3. Note the shape of the intermediate result (e.g. "a table with the same columns as Sales, but only rows where Amount > 100").
4. If the step references any of the sample tables (`Sales`, `Customers`, `Products`, `Employees`, `OrderLog`), you may call `get_sample_table` for context.

Cite each pqm.guide page you used with a `→ /functions/<slug>` link on the same line as the function name.

---

### 4. Surface relevant concepts and patterns

Skim the steps for higher-level shapes worth calling out:
- Null propagation, `??` usage, `Table.FillDown`/`FillUp` — → `search_concepts` for `null-handling`, `search_patterns` for `null-safe-operations`.
- `try … otherwise …`, `try … catch (e) => …` — → `error-handling` concept, `error-recovery-table` pattern.
- Foldable data-source functions early in the chain — → `query-folding` concept, `query-performance` pattern.
- `Table.NestedJoin` + expand — → `table-joins` pattern.
- `Table.Group` — → the relevant pattern (search first).
- `each` keyword, `_` shorthand — → `each-keyword` concept.

Only mention concepts/patterns that are actually in play — no filler.

---

### 5. Summarize the data flow

End with a short paragraph (2–3 sentences) that reads like a caption for the query as a whole: what goes in, what comes out, and the overall shape of the transformation. This is the "if you only read one thing" version.

---

### 6. Observations, not critique

If you notice a magic number, an unfamiliar function, or something that reads oddly, mention it as an observation with no strong recommendation. Do **not** produce a lint-style report of issues. If the user wants structured critique of their M for anti-patterns, direct them to **PQLint** (John Kerski's Power Query linter) — that's the right tool for the job.

---

## Rules

- Always call `get_function` / `get_concept` / `get_pattern` via MCP before describing a function or concept — never answer from memory.
- Never invent function signatures or parameter names — if you're unsure, look it up.
- Every function you mention should link to its pqm.guide page.
- Keep explanations focused. If the query is 15 steps, don't write 15 paragraphs — group cohesive step runs (e.g. "Steps 4-7 clean the CustomerName column").
- If asked to critique, refactor, or lint the code, decline and point at PQLint instead. This skill explains; it does not critique.
