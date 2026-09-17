// build.js — stitches pages/*.html with partials/*.html, minifies CSS/JS assets, and generates production HTML.
// Usage: node build.js
const fs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");
const Terser = require("terser");

const ROOT = __dirname;
const PAGES_DIR = path.join(ROOT, "pages");
const PARTIALS_DIR = path.join(ROOT, "partials");
const CSS_DIR = path.join(ROOT, "css");
const JS_DIR = path.join(ROOT, "js");

function loadPartials() {
  const partials = {};
  if (!fs.existsSync(PARTIALS_DIR)) return partials;
  for (const file of fs.readdirSync(PARTIALS_DIR)) {
    if (file.endsWith(".html")) {
      const name = path.basename(file, ".html");
      partials[name] = fs.readFileSync(path.join(PARTIALS_DIR, file), "utf8");
    }
  }
  
  const manifestPath = path.join(ROOT, "assets", "event-app", "manifest.json");
  if (fs.existsSync(manifestPath)) {
    partials._viteManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  }
  
  return partials;
}

// Minify all CSS files
function minifyAllCSS() {
  if (!fs.existsSync(CSS_DIR)) return;
  const cleanCSS = new CleanCSS({
    level: {
      1: {
        all: true
      },
      2: {
        all: true
      }
    }
  });

  const files = fs.readdirSync(CSS_DIR).filter((f) => f.endsWith(".css") && !f.endsWith(".min.css"));
  for (const file of files) {
    const srcPath = path.join(CSS_DIR, file);
    const content = fs.readFileSync(srcPath, "utf8");
    const minified = cleanCSS.minify(content).styles;
    const minPath = path.join(CSS_DIR, file.replace(/\.css$/, ".min.css"));
    fs.writeFileSync(minPath, minified, "utf8");
    console.log(`  minified CSS: ${file} -> ${path.basename(minPath)}`);
  }
}

// Minify all JS files
async function minifyAllJS() {
  if (!fs.existsSync(JS_DIR)) return;
  const files = fs.readdirSync(JS_DIR).filter((f) => f.endsWith(".js") && !f.endsWith(".min.js"));
  for (const file of files) {
    const srcPath = path.join(JS_DIR, file);
    const content = fs.readFileSync(srcPath, "utf8");
    try {
      const minified = await Terser.minify(content, {
        compress: {
          drop_console: false
        },
        mangle: true
      });
      const minPath = path.join(JS_DIR, file.replace(/\.js$/, ".min.js"));
      fs.writeFileSync(minPath, minified.code || content, "utf8");
      console.log(`  minified JS:  ${file} -> ${path.basename(minPath)}`);
    } catch (err) {
      console.error(`  error minifying ${file}:`, err);
    }
  }
}

// Replaces {{partial:name}} tokens, rewrites CSS/JS links to .min versions, and supports {{page:key}}




// Production HTML Minifier
function minifyHTML(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/^\s+|\s+$/gm, "")
    .replace(/\n+/g, "\n")
    .replace(/>\s+</g, "><");
}

function render(html, partials, pageKey) {
  let out = html.replace(/\{\{partial:([a-zA-Z0-9_-]+)\}\}/g, (_, name) => {
    if (!partials[name]) {
      console.warn(`  ! warning: partial "${name}" not found`);
      return "";
    }
    return partials[name];
  });
  out = out.replace(/\{\{page:key\}\}/g, pageKey);

  // Switch local CSS and JS references to minified versions
  out = out.replace(/href=["']\/css\/([a-zA-Z0-9_-]+?)(\.min)?\.css["']/g, 'href="/css/$1.min.css"');
  out = out.replace(/src=["']\/js\/([a-zA-Z0-9_-]+?)(\.min)?\.js["']/g, 'src="/js/$1.min.js"');

  // Inject Vite built assets if manifest exists
  if (partials._viteManifest && partials._viteManifest["src/event/main.jsx"]) {
    const entry = partials._viteManifest["src/event/main.jsx"];
    const jsPath = "/assets/event-app/" + entry.file;
    const cssPath = entry.css && entry.css.length > 0 ? "/assets/event-app/" + entry.css[0] : "";
    
    out = out.replace(/\{\{vite:js\}\}/g, `<script type="module" crossorigin src="${jsPath}"></script>`);
    if (cssPath) {
      out = out.replace(/\{\{vite:css\}\}/g, `<link rel="stylesheet" href="${cssPath}" />`);
    }
  } else {
    out = out.replace(/\{\{vite:js\}\}/g, '');
    out = out.replace(/\{\{vite:css\}\}/g, '');
  }

  return out;
}

function getAllHtmlFiles(dir, base = "") {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const relPath = base ? path.join(base, item) : item;
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath, relPath));
    } else if (item.endsWith(".html")) {
      results.push(relPath);
    }
  }
  return results;
}

async function build() {
  console.log("Minifying assets...");
  minifyAllCSS();
  await minifyAllJS();

  console.log("\nBuilding pages...");
  const partials = loadPartials();
  if (!fs.existsSync(PAGES_DIR)) {
    console.error("No pages/ directory found.");
    process.exit(1);
  }
  const relFiles = getAllHtmlFiles(PAGES_DIR);
  if (relFiles.length === 0) {
    console.warn("No page templates found in pages/.");
  }
  for (const relFile of relFiles) {
    const cleanRel = relFile.replace(/\\/g, "/");
    let pageKey = path.basename(relFile, ".html");
    if (cleanRel.startsWith("work/")) {
      pageKey = "work";
    } else if (cleanRel.startsWith("services/")) {
      pageKey = "services";
    }

    const src = fs.readFileSync(path.join(PAGES_DIR, relFile), "utf8");
    let rendered = render(src, partials, pageKey);
    // Two passes so a partial (e.g. nav) can itself reference {{page:key}} for active-state.
    rendered = render(rendered, partials, pageKey);
    
    const outRel = cleanRel === "home.html" ? "index.html" : cleanRel;
    const outPath = path.join(ROOT, outRel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, minifyHTML(rendered));
    console.log(`  built ${outRel}`);
  }
  console.log(`\nDone. ${relFiles.length} page(s) built and all CSS/JS assets minified.`);
}

build();
