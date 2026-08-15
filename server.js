// server.js — Zero-dependency local dev server with clean URL support
// Automatically resolves /services -> services.html, /work -> work.html, etc.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split("?")[0]);
  if (reqPath === "/") reqPath = "/index.html";

  let filePath = path.join(ROOT, reqPath);

  // Check if direct file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(filePath, res);
  }

  // If request is clean URL like /services, check /services.html
  let htmlPath = filePath + ".html";
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return serveFile(htmlPath, res);
  }

  // If folder request, check for index.html inside
  let indexPath = path.join(filePath, "index.html");
  if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
    return serveFile(indexPath, res);
  }

  // 404 Not Found
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head><title>404 Not Found</title></head>
      <body style="background:#0a0a0a;color:#fff;font-family:sans-serif;padding:60px;text-align:center;">
        <h1 style="color:#cc3f48;">404 Not Found</h1>
        <p>No file found for <code>${reqPath}</code></p>
        <p><a href="/" style="color:#cc3f48;">Return to Home</a> · <a href="/services.html" style="color:#cc3f48;">Services Page</a></p>
      </body>
    </html>
  `);
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 Server Error: " + err.message);
      return;
    }
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache"
    });
    res.end(content);
  });
}

server.listen(PORT, () => {
  console.log(`\n🚀 Evolix Server running at:`);
  console.log(`   - Home:     http://localhost:${PORT}/`);
  console.log(`   - Services: http://localhost:${PORT}/services (or /services.html)`);
  console.log(`   - Work:     http://localhost:${PORT}/work (or /work.html)\n`);
});
