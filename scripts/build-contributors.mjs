/**
 * build-contributors.mjs
 *
 * Generates src/data/contributors.json by running `git log` on every MDX file
 * in src/content/. Parses GitHub noreply emails to extract login + avatar URL.
 *
 * Usage:
 *   node scripts/build-contributors.mjs
 *
 * Run this whenever content is added or contributors change.
 * The output file is committed to the repo so no API calls are needed at build time.
 */

import { execSync } from "child_process";
import { readdirSync, writeFileSync } from "fs";
import { join, relative } from "path";

const ROOT = process.cwd();
const CONTENT_DIRS = [
  { dir: join(ROOT, "src/content/functions"), prefix: "functions" },
  { dir: join(ROOT, "src/content/concepts"), prefix: "concepts" },
  { dir: join(ROOT, "src/content/patterns"), prefix: "patterns" },
];
const OUT = join(ROOT, "src/data/contributors.json");

// Bots to exclude from contributor lists
const BOT_LOGINS = new Set(["dependabot[bot]", "github-actions[bot]", "renovate[bot]"]);

/**
 * Parse a git author email into a GitHub login.
 * Handles both noreply formats:
 *   - <id>+username@users.noreply.github.com  (new)
 *   - username@users.noreply.github.com        (old)
 * Returns null for non-GitHub emails.
 */
function parseGitHubLogin(email) {
  const noReplyMatch = email.match(/^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/);
  if (noReplyMatch) return noReplyMatch[1];
  return null;
}

function getContributorsForFile(filePath) {
  const rel = relative(ROOT, filePath).replace(/\\/g, "/");
  let output;
  try {
    output = execSync(
      `git log --follow --no-merges --format="%aN|%ae" -- "${rel}"`,
      { cwd: ROOT, encoding: "utf-8" }
    ).trim();
  } catch {
    return [];
  }

  if (!output) return [];

  const seen = new Map(); // login/name → contributor object

  for (const line of output.split("\n")) {
    const [name, email] = line.split("|");
    if (!name || !email) continue;

    const login = parseGitHubLogin(email);
    const key = login ?? email;

    if (login && BOT_LOGINS.has(login)) continue;
    if (!login && BOT_LOGINS.has(name)) continue;

    if (!seen.has(key)) {
      seen.set(key, {
        name,
        login: login ?? null,
        avatar: login ? `https://github.com/${login}.png?size=40` : null,
        url: login ? `https://github.com/${login}` : null,
      });
    }
  }

  return Array.from(seen.values());
}

const result = {};
let total = 0;

for (const { dir, prefix } of CONTENT_DIRS) {
  let files;
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  } catch {
    continue;
  }

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    const key = `${prefix}/${slug}`;
    const contributors = getContributorsForFile(join(dir, file));
    if (contributors.length > 0) {
      result[key] = contributors;
      total++;
    }
  }

  console.log(`  ${prefix}: ${files.length} files processed`);
}

writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n", "utf-8");
console.log(`\nWrote ${total} entries to src/data/contributors.json`);
