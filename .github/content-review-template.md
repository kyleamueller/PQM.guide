## Monthly Content Freshness Review

This issue is auto-generated on the 1st of each month as a reminder to review time-sensitive content across the site.

To apply updates automatically, run `/refresh-site` in Claude Code. It will research recent announcements and update any content that has changed.

---

### 1. Environments & Platform Coverage

**File:** `src/content/concepts/power-query-environments.mdx`

- [ ] Check the [Fabric blog](https://blog.fabric.microsoft.com) for Power Query / Dataflows announcements since last review
- [ ] **Execute Query REST API** — still in preview, or has it reached GA?
- [ ] **Excel Online** editing — still restricted to Business/Enterprise M365 plans?
- [ ] **Fabric capacity requirement** for Dataflows Gen2 — any change?
- [ ] Any new environments or products that now run Power Query?
- [ ] Any retired/deprecated environments?
- [ ] Verify specific limits are still accurate: 90s API timeout, 50-table Gen1 limit, 512 KB script size, 5-min Dataverse timeout

---

### 2. Function Compatibility Flags

Each function page has a `compatibility` block with 6 platform flags (`pbiDesktop`, `pbiService`, `excelDesktop`, `excelOnline`, `dataflows`, `fabricNotebooks`). Functions with any `false` flags are most likely to go stale.

**High-priority functions to verify:**
- [ ] `File.Contents` — desktop-only; check if Microsoft has added cloud file access
- [ ] Any functions with `fabricNotebooks: false` — Fabric connector support expands regularly
- [ ] Any new functions added this month — verify their compatibility flags reflect current availability

**Reference:** [M function reference changelog](https://learn.microsoft.com/en-us/powerquery-m/power-query-m-function-reference)

---

### 3. New M Functions

Microsoft occasionally adds new built-in functions to the M standard library.

- [ ] Check the M function reference for any functions not yet documented on this site
- [ ] Check Fabric / Power BI release notes for new M functions or library additions

---

### 4. Concept Pages

Most concept pages cover language fundamentals and are largely evergreen. These are the exceptions:

- [ ] `query-folding.mdx` — if the Power Query engine gains new folding capabilities, the "what breaks folding" list may need updating

---

### 5. Pattern Pages

- [ ] `parameterized-queries.mdx` — check if any platform-specific behavior mentioned has changed
- [ ] `error-recovery-table.mdx` — check if error handling behavior has changed across platforms

---

### Dismiss

If nothing has changed this month, close this issue with a "no changes needed" comment.
