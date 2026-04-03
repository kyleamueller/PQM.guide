## Monthly Content Freshness Review

This issue is auto-generated on the 1st of each month as a reminder to review time-sensitive content across the site.

To apply updates automatically, run `/refresh-site` in Claude Code from the PQM.guide project directory. It will research recent announcements and update any content that has changed.

---

### 0. Blog & Announcement Scan

Scan official blogs and release notes for anything Power Query-related. Most PQ changes are buried inside monthly "Feature Summary" posts — check the latest 2–3, not just the blog index.

- [ ] [Power BI blog](https://powerbi.microsoft.com/en-us/blog/) — look for the latest monthly feature summary post
- [ ] [Fabric blog](https://blog.fabric.microsoft.com/en-us/blog/)
- [ ] [Power BI monthly release notes](https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-latest-update)
- [ ] [Fabric Data Factory what's new](https://learn.microsoft.com/en-us/fabric/data-factory/whats-new)
- [ ] [Power Query connector release notes](https://learn.microsoft.com/en-us/power-query/connectors/)

Look for: retirement/deprecation notices, preview-to-GA transitions, new environments, connector additions/removals/behavior changes, limit or quota changes.

---

### 1. Environments & Platform Coverage

**File:** `src/content/concepts/power-query-environments.mdx`

- [ ] **Execute Query REST API** — still in preview, or has it reached GA? Any limit changes?
- [ ] **Dataflows Gen2** — verify output destinations list, capacity requirements, and Modern Evaluator status
- [ ] **Dataflows Gen1** — any update to retirement timeline? (currently Legacy, dates TBD)
- [ ] **Excel Online** editing — still restricted to Business/Enterprise M365 plans?
- [ ] Any new environments or products that now run Power Query?
- [ ] Any retired/deprecated environments?
- [ ] Verify specific limits are still accurate: 90s API timeout, 50-table Gen1 limit, 512 KB script size, 5-min Dataverse timeout

---

### 2. Function Compatibility Flags

Each function page has a `compatibility` block with 6 platform flags (`pbiDesktop`, `pbiService`, `excelDesktop`, `excelOnline`, `dataflows`, `fabricNotebooks`). Functions with any `false` flags are most likely to go stale.

- [ ] Any functions with `fabricNotebooks: false` — Fabric connector support expands regularly
- [ ] Any functions with `excelOnline: false` — Excel Online PQ support is still rolling out
- [ ] `File.Contents` — desktop-only; check if Microsoft has added cloud file access
- [ ] Any new functions added this month — verify their compatibility flags reflect current availability
- [ ] Check connector release notes for behavior changes that affect function MDX Remarks (new auth methods, deprecated options, new parameters)

**Reference:** [M function reference](https://learn.microsoft.com/en-us/powerquery-m/power-query-m-function-reference)

---

### 3. New M Functions + Official Spec Sync

Microsoft occasionally adds new built-in functions to the M standard library.

- [ ] Check the [M function reference](https://learn.microsoft.com/en-us/powerquery-m/power-query-m-function-reference) for any functions not yet documented on this site — prioritize Accessing Data and Table categories
- [ ] Check Fabric / Power BI release notes for new M functions or library additions
- [ ] Diff against `src/__tests__/fixtures/official-spec-slugs.json` — add any new slugs so the content-integrity test stays current

---

### 4. Concept & Pattern Pages

Most concept pages cover language fundamentals and are largely evergreen. These are the ones most likely to drift:

**Always check:**
- [ ] `getting-started.mdx` — references UI flows that can change
- [ ] `ui-to-m-bridge.mdx` — references how the PQ editor generates M
- [ ] `query-folding.mdx` — new folding capabilities in the engine
- [ ] `api-authentication.mdx` — auth patterns and connector behavior can change
- [ ] `pagination-web-contents.mdx` — Web.Contents behavior and options can change
- [ ] `parameterized-queries.mdx` — platform-specific behavior changes
- [ ] `error-recovery-table.mdx` — error handling behavior changes

**Skip unless blog scan flagged something relevant:** language-level concepts (`let-in-expressions`, `each-keyword`, `type-system`, `lazy-evaluation`, etc.)

---

### 5. Resources Page Link Check

**File:** `src/app/resources/page.tsx`

- [ ] Verify all external URLs still resolve (no 404s or unexpected redirects)
- [ ] Check whether pending BACKLOG resource additions are now publishable

---

### 6. BACKLOG

- [ ] Add any findings that can't be fixed immediately to `.claude/BACKLOG.md` at the appropriate priority level

---

### Dismiss

If nothing has changed this month, close this issue with a "no changes needed" comment.
