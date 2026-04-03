Perform a full content freshness review of the docs site. Work through each section below, research what has changed, and apply any confirmed updates.

Use WebFetch to retrieve live content from the URLs listed below. Do not rely on training data for anything that could have changed — only act on what you read directly from official Microsoft sources.

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

Capture all relevant findings from this step — they feed into every section below.

---

## 1. Environments & Platform Coverage

Using the findings from Section 0 plus a direct fetch of:
- `https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-latest-update`
- `https://learn.microsoft.com/en-us/fabric/data-factory/dataflows-gen2-overview`

Read `src/content/concepts/power-query-environments.mdx` and update it with any confirmed changes. Specifically update:
- Preview/GA status for any APIs or features
- Specific limits (timeout, table count, script size) that have changed
- New environments to add or retired environments to remove
- Deprecation or retirement notices — add a visible callout block when Microsoft has announced an end-of-life timeline for any environment (see the Dataflows Gen1 section as a reference pattern)
- Mac-specific limitations that have changed

---

## 2. Function Compatibility Flags

Using the findings from Section 0, check whether any of the environments have changed their support for Power Query functions. Focus on:
- Functions newly supported in Fabric Notebooks
- Functions newly supported in Excel Online
- Functions newly supported in Power BI Service (cloud)
- Any functions deprecated or removed

Find all function MDX files in `src/content/functions/` that have any `false` compatibility flags — these are the ones most likely to need updating. Use grep to find them: search for `false` within the compatibility block.

For any function where availability has changed, update the corresponding frontmatter boolean flags.

---

## 3. New M Functions

Fetch `https://learn.microsoft.com/en-us/powerquery-m/power-query-m-function-reference` and check recent Power BI / Fabric release notes (from Section 0) for any M functions that are not yet documented on this site.

Check the existing function files in `src/content/functions/` to see what's already covered. If new functions exist that aren't documented, report them (don't create new pages automatically — flag them for manual review).

---

## 4. Concept & Pattern Pages

Using the findings from Section 0, check whether any confirmed changes are relevant to:
- `src/content/concepts/query-folding.mdx` — new folding capabilities in the engine
- `src/content/patterns/parameterized-queries.mdx` — platform-specific behavior changes
- `src/content/patterns/error-recovery-table.mdx` — error handling behavior changes

Apply updates only if you find confirmed changes from official Microsoft sources.

---

## Summary

After completing all sections, provide a summary of:
- What was updated and why (include the source URL for each change)
- What was verified as still accurate
- Any new functions flagged for future documentation
- Any retirement or deprecation notices found, even if already reflected in the site
