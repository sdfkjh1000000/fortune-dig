// Generates a Markdown representation of each content page, served via content
// negotiation (functions/_middleware.js) when an agent sends `Accept: text/markdown`.
// Auto-discovers every content .html, preserving directory structure, and writes a
// sibling .md. Re-run after any content change.
//   Local: needs jsdom + turndown. From the repo root:
//   NODE_PATH=../eightit/node_modules node scripts/build-md.js
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const TurndownService = require("turndown");

const ROOT = path.join(__dirname, "..");
const SITE = "https://jzzo.sdfkjh.com";

const SKIP_DIRS = new Set(["node_modules", "scripts", "functions", ".git", ".claude"]);
const SKIP_FILES = new Set(["404.html"]);

const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
td.remove(["script", "style", "noscript", "svg", "form", "button", "iframe"]);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (!SKIP_DIRS.has(ent.name)) walk(path.join(dir, ent.name), out);
    } else if (ent.name.endsWith(".html") && !SKIP_FILES.has(ent.name)) {
      out.push(path.relative(ROOT, path.join(dir, ent.name)).split(path.sep).join("/"));
    }
  }
  return out;
}

function canonical(rel) {
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"index.html".length);
  return "/" + rel.replace(/\.html$/, "");
}

function convert(rel) {
  const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const doc = new JSDOM(src).window.document;
  const root = doc.querySelector("main, article") || doc.body;
  const title = (doc.querySelector("title")?.textContent || "JZZO").trim();

  root
    .querySelectorAll('header, nav, footer, aside, .skip-link, [aria-hidden="true"]')
    .forEach((el) => el.remove());

  const body = td.turndown(root.innerHTML).replace(/\n{3,}/g, "\n\n").trim();
  const out = `# ${title}\n\nSource: ${SITE}${canonical(rel)}\n\n${body}\n`;
  const mdRel = rel.replace(/\.html$/, ".md");
  fs.writeFileSync(path.join(ROOT, mdRel), out, "utf8");
  return { mdRel, bytes: Buffer.byteLength(out) };
}

const pages = walk(ROOT);
const results = pages.map(convert);
for (const r of results) console.log(`  ${r.mdRel.padEnd(48)} ${r.bytes} bytes`);
console.log(`Generated ${results.length} markdown files.`);
