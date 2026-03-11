Perform a full content freshness review of the docs site. Work through each section below, research what has changed, and apply any confirmed updates.

---

## 1. Environments & Platform Coverage

Search the web for Microsoft announcements in the last 3 months about:
- Power Query execution environments (new platforms, retired platforms)
- Microsoft Fabric Dataflows Gen2 updates
- The Fabric Execute Query REST API (preview → GA? new limits? new features?)
- Excel Online Power Query availability changes
- Any new Microsoft products that now support Power Query M

Read `src/content/concepts/power-query-environments.mdx` and update it with any confirmed changes. Specifically update:
- Preview/GA status for any APIs or features
- Specific limits (timeout, table count, script size) that have changed
- New environments to add or retired environments to remove
- Mac-specific limitations that have changed

---

## 2. Function Compatibility Flags

Search for recent Microsoft announcements about Power Query function availability changes. Focus on:
- Functions newly supported in Fabric Notebooks
- Functions newly supported in Excel Online
- Functions newly supported in Power BI Service (cloud)
- Any functions deprecated or removed

Find all function MDX files in `src/content/functions/` that have any `false` compatibility flags — these are the ones most likely to need updating. Use grep to find them: search for `false` within the compatibility block.

For any function where availability has changed, update the corresponding frontmatter boolean flags.

---

## 3. New M Functions

Search the Microsoft M function reference (learn.microsoft.com/en-us/powerquery-m/power-query-m-function-reference) and recent Power BI / Fabric release notes for any M functions that are not yet documented on this site.

Check the existing function files in `src/content/functions/` to see what's already covered. If new functions exist that aren't documented, report them (don't create new pages automatically — flag them for manual review).

---

## 4. Concept & Pattern Pages

Search for any changes relevant to:
- `src/content/concepts/query-folding.mdx` — new folding capabilities in the engine
- `src/content/patterns/parameterized-queries.mdx` — platform-specific behavior changes
- `src/content/patterns/error-recovery-table.mdx` — error handling behavior changes

Apply updates only if you find confirmed changes from official Microsoft sources.

---

## Summary

After completing all sections, provide a summary of:
- What was updated and why
- What was verified as still accurate
- Any new functions flagged for future documentation
