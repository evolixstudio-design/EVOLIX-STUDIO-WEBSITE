// build.js — stitches pages/*.html with partials/*.html into static root HTML files.
// Usage: node build.js
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PAGES_DIR = path.join(ROOT, "pages");
const PARTIALS_DIR = path.join(ROOT, "partials");

function loadPartials() {
  const partials = {};
  if (!fs.existsSync(PARTIALS_DIR)) return partials;
  for (const file of fs.readdirSync(PARTIALS_DIR)) {
    if (file.endsWith(".html")) {
      const name = path.basename(file, ".html");
      partials[name] = fs.readFileSync(path.join(PARTIALS_DIR, file), "utf8");
    }
  }
  return partials;
}

// Replaces {{partial:name}} tokens, and supports {{active:pagekey}} for nav highlighting.
function render(html, partials, pageKey) {
  let out = html.replace(/\{\{partial:([a-zA-Z0-9_-]+)\}\}/g, (_, name) => {
    if (!partials[name]) {
      console.warn(`  ! warning: partial "${name}" not found`);
      return "";
    }
    return partials[name];
  });
  out = out.replace(/\{\{page:key\}\}/g, pageKey);
  return out;
}

function build() {
  const partials = loadPartials();
  if (!fs.existsSync(PAGES_DIR)) {
    console.error("No pages/ directory found.");
    process.exit(1);
  }
  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".html"));
  if (files.length === 0) {
    console.warn("No page templates found in pages/.");
  }
  for (const file of files) {
    const pageKey = path.basename(file, ".html");
    const src = fs.readFileSync(path.join(PAGES_DIR, file), "utf8");
    let rendered = render(src, partials, pageKey);
    // Two passes so a partial (e.g. nav) can itself reference {{page:key}} for active-state.
    rendered = render(rendered, partials, pageKey);
    const outName = pageKey === "home" ? "index.html" : `${pageKey}.html`;
    fs.writeFileSync(path.join(ROOT, outName), rendered);
    console.log(`  built ${outName}`);
  }
  console.log(`\nDone. ${files.length} page(s) built.`);
}

build();
