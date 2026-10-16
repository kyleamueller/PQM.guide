Rename applied steps in a Power Query M query with descriptive, whole-step-aware names — including compound steps where a single step performs multiple operations that the outer function name alone doesn't convey.

This skill complements the `rename_applied_steps` MCP tool. That tool's `style: "descriptive"` mode gives good deterministic names for single-op steps (`Table.AddColumn(_, "TotalPrice", …)` → `Added TotalPrice`), but it names compound steps after only their outermost function. This skill fills that gap.

---

## Steps

### 1. Receive the M code

The user pastes a `let … in …` block. If input is empty or clearly not M, ask for the code and stop.

---

### 2. Analyze each step end-to-end

Read the `let` block top to bottom. For each step, examine the **entire RHS expression**, not just the outermost function call.

Classify each step:

- **Source / reference step** — RHS is a literal, a bare identifier reference, or record-field access (e.g. `Source{[Item="Sheet1"]}[Data]`). Keep the existing name if it already reads well (`Source`, `Sheet1`), or rename to something short that says what it is (`SalesSheet`).

- **Simple single-op step** — RHS is a single function call with literal arguments. Use a descriptive PQ UI-style name that surfaces the literal:
  - `Table.Sort(Source, {{"OrderDate", Order.Descending}})` → `Sorted by OrderDate`
  - `Table.RemoveColumns(Source, {"GUID", "Notes"})` → `Removed GUID, Notes`
  - `Table.AddColumn(Source, "TotalPrice", each [Q] * [P])` → `Added TotalPrice`
  - `Table.RenameColumns(Source, {{"Old","New"}})` → `Renamed Old to New`

- **Compound step** — RHS contains nested function calls. Name it after the *combined* effect, not just the outer op. Use `and` to join two verbs when both operations are consequential:
  - `Table.SelectRows(Table.AddColumn(Source, "X", …), each [X] > 0)` → `Added X and Filtered`
  - `Table.RemoveColumns(Table.RenameColumns(Source, {{"A","B"}}), {"C"})` → `Renamed A and Removed C`
  - `Table.Sort(Table.SelectRows(Source, each [Amount] > 100), {{"Date", Order.Descending}})` → `Filtered and Sorted by Date`

- **Deep-nested step (3+ operations)** — Capturing every op verbatim gets unwieldy. Prefer a name that describes the *outcome* of the pipeline rather than listing every verb: `Cleaned Customer Names`, `Prepared for Load`, `High-Value Orders`.

---

### 3. Look up unfamiliar functions

If you're not certain what a function does, call the `get_function` MCP tool before naming the step. Don't guess. `get_function` accepts either the function name (`Table.Group`) or the slug (`table-group`).

---

### 4. Verify the mapping

Before applying, sanity-check:

- **Convention.** Every name follows PQ's past-tense verb-first shape: `Added`, `Filtered`, `Sorted`, `Renamed`, `Removed`, `Grouped`, `Merged`, `Expanded`, `Kept`, `Changed`. Not present tense (`Add`, `Filter`).
- **Length.** One clause. Compound steps may use `and` to join two verbs — three is too many.
- **No duplicates.** Every value in the mapping must be unique. If two steps genuinely do similar things, disambiguate them (`Filtered by Amount` vs `Filtered by Date`).
- **No behavior invention.** If you're unsure what a step does, look it up — don't fabricate a plausible-sounding name.
- **Preserve the `in` target.** The `rename_applied_steps` tool handles this automatically; just make sure the final step's rename is in the mapping.

---

### 5. Apply the rename

Call the `rename_applied_steps` MCP tool with an explicit `mapping`:

```json
{
  "code": "let … in …",
  "mapping": {
    "Source": "Source",
    "Step1": "Filtered by Amount",
    "Step2": "Added TotalPrice and Sorted by Date"
  }
}
```

Only include entries where the name is actually changing — no-ops in the mapping are fine but unnecessary. Names that contain spaces or special characters are automatically wrapped in `#"…"` on emission.

---

### 6. Return the renamed code

Show the result. Add a short rationale (2–4 sentences) explaining:

- Which steps were compound and how the new name captures both operations
- Any steps you looked up via `get_function` and why
- If any step was left generic (e.g. still `Filtered Rows`), why — usually because the filter condition doesn't reduce to a literal column name

---

## Rules

- Every renamed step must reflect what actually happens end-to-end in that step — the outer function name is not enough when the step is compound.
- Never rewrite the M code yourself. The `rename_applied_steps` MCP tool does the transformation; your job is to produce the `mapping`.
- Never guess at a function's behavior. If unsure, call `get_function` before naming.
- If the query is clearly non-`let` (bare expression, section document), tell the user this skill only works on `let … in …` queries and stop.
- Names must be unique across the mapping. If a collision emerges, disambiguate.
- Compound steps that combine three or more operations should be named for the *outcome*, not by chaining verbs.
