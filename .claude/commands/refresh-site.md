Perform a full content freshness review of the docs site. Work through each section below in order, research what has changed, and apply any confirmed updates.

Use WebFetch to retrieve live content from all URLs listed below. Do not rely on training data for anything that could have changed — only act on what you read directly from official Microsoft sources or the live page.

---

## 0. Blog & Announcement Scan (run this first)

Fetch all of the following pages and scan for any Power Query-related announcements — especially deprecations, retirements, preview-to-GA transitions, new environments, connector changes, or breaking changes:

- **Power BI blog**: `https://powerbi.microsoft.com/en-us/blog/`
- **Fabric blog**: `https://blog.fabric.microsoft.com/en-us/blog/`
- **Power BI monthly release notes**: `https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-latest-update`
- **Fabric Data Factory what's new**: `https://learn.microsoft.com/en-us/fabric/data-factory/whats-new`

On each page, look for:
- Retirement or deprecation announcements (e.g. "Gen1 is retiring", "connector X is being removed")
- Preview → GA transitions for any Power Query feature, API, or connector
- New products or environments that now support Power Query M
- Removal of products or environments that previously supported Power Query M
- Connector additions or removals
- Limit or quota changes (timeouts, table counts, script sizes)

Capture all relevant findings — they feed into every section below.

---

## 1. Environments & Platform Coverage

Using the findings from Section 0 plus a direct fetch of:
- `https://learn.microsoft.com/en-us/fabric/data-factory/dataflows-gen2-overview`

Read `src/content/concepts/power-query-environments.mdx` and update it with any confirmed changes. Specifically update:
- Preview/GA status for any APIs or features
- Specific limits (timeout, table count, script size) that have changed
- New environments to add or retired environments to remove
- Deprecation or retirement notices — add a visible blockquote callout when Microsoft has announced an end-of-life timeline for any environment (see the Dataflows Gen1 section as a reference pattern)
- Mac-specific limitations that have changed

---

## 2. Function Compatibility Flags

Using the findings from Section 0, check whether any environments have changed their support for Power Query functions. Focus on:
- Functions newly supported in Fabric Notebooks
- Functions newly supported in Excel Online
- Functions newly supported in Power BI Service (cloud)
- Any functions deprecated or removed

Find all function MDX files in `src/content/functions/` that have any `false` compatibility flags — these are the ones most likely to need updating:

```bash
grep -rl "false" src/content/functions/ | xargs grep -l "compatibility"
```

For any function where availability has confirmed changed, update the corresponding frontmatter boolean flags.

---

## 3. New M Functions + Official Spec Sync

### 3a. Fetch the current official function list

Fetch `https://learn.microsoft.com/en-us/powerquery-m/power-query-m-function-reference` and each of the category pages linked from it to build a complete list of all function slugs in the current official spec. Derive slugs using the same convention the site uses: lowercase the function name, replace `.` with `-` (e.g. `Table.AddColumn` → `table-addcolumn`).

### 3b. Update `official-spec-slugs.json`

Read `src/__tests__/fixtures/official-spec-slugs.json`. This file is the authoritative list used by the content-integrity test — every documented function must exist in it. Diff the live spec against this file:

- **New slugs in the spec but missing from the JSON**: Add them to the JSON. Without this, any attempt to add an MDX page for a new function will fail the test `"every function slug exists in the official Power Query M spec"`.
- **Slugs in the JSON but removed from the spec**: Flag them — do not remove automatically, as these may be intentionally kept for reference.

### 3c. Flag undocumented functions

Check which slugs in `official-spec-slugs.json` do not yet have a corresponding file in `src/content/functions/`. Report the undocumented ones — do not create pages automatically. Flag them in the Summary and add high-priority candidates to the BACKLOG (Section 6).

---

## 4. Concept & Pattern Pages

Using the findings from Section 0, review the following pages for stale content. These are the pages most likely to drift because they reference platform behavior, UI flows, or external APIs — not just language semantics.

**Highest drift risk — always check:**
- `src/content/concepts/power-query-environments.mdx` — covered in Section 1
- `src/content/concepts/getting-started.mdx` — references UI flows; fetch `https://learn.microsoft.com/en-us/power-query/power-query-ui` to compare
- `src/content/concepts/ui-to-m-bridge.mdx` — references how the PQ editor generates M; check for UI changes in the release notes from Section 0
- `src/content/concepts/query-folding.mdx` — new folding capabilities in the engine
- `src/content/patterns/api-authentication.mdx` — auth patterns and connector behavior can change; fetch `https://learn.microsoft.com/en-us/power-query/handling-authentication` to compare
- `src/content/patterns/pagination-web-contents.mdx` — Web.Contents behavior and options can change; fetch `https://learn.microsoft.com/en-us/powerquery-m/web-contents` to compare
- `src/content/patterns/parameterized-queries.mdx` — platform-specific behavior changes
- `src/content/patterns/error-recovery-table.mdx` — error handling behavior changes

**Low drift risk — skip unless Section 0 flagged something relevant:**
Language-level concepts (`let-in-expressions`, `each-keyword`, `type-system`, `lazy-evaluation`, `literal-constructors`, `identifiers-and-scoping`, `sections-and-shared`, `m-paradigm`, `structured-data`) rarely change because they describe the M language itself, not platform behavior.

Apply updates only if you find confirmed changes from official Microsoft sources.

---

## 5. Resources Page Link Check

Read `src/app/resources/page.tsx` and extract every external URL listed. Use WebFetch to verify each one still resolves (returns content, not a 404 or redirect to a generic homepage).

For any URL that is broken or redirects somewhere unexpected:
- Note it in the Summary
- Add a BACKLOG item to fix or replace it (Section 6)

Also check whether any of the BACKLOG's pending resource additions (e.g. Dom Petri's Power Query book, Alex Powers' query folding articles) have been published or are findable — flag them if so.

---

## 6. BACKLOG Updates

Read `.claude/BACKLOG.md`. For anything found during this refresh that cannot be fixed immediately, add a new backlog item under the appropriate priority level:

- Items that require creating new content (undocumented functions, missing concepts) → **P2**
- Items that require a decision (e.g. deprecated resource with no clear replacement) → **P4**
- Broken external links → **P2**

Do not mark existing items as done unless the work was actually completed in this session.

---

## Summary

After completing all sections, provide a summary of:
- What was updated and why (include the source URL for each change)
- What was verified as still accurate
- New function slugs added to `official-spec-slugs.json` (if any)
- Functions flagged for future documentation (not yet documented on the site)
- Any retirement or deprecation notices found, even if already reflected in the site
- Resources page links that are broken or stale
- BACKLOG items added
