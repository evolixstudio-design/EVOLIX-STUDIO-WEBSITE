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

  // Handle local /api requests by calling the Netlify function module directly
  if (reqPath.startsWith("/api/")) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      console.log(`[API Proxy] ${req.method} ${req.url}`);
      console.log(`[API Proxy] Body length: ${body.length}`);
      import("./netlify/functions/api.mjs").then(async module => {
        const handler = module.default;
        try {
          const webReq = new Request("http://localhost:" + PORT + req.url, {
            method: req.method,
            headers: new Headers(req.headers),
            body: req.method === "POST" ? (body || null) : undefined
          });
          const response = await handler(webReq, {});
          const responseBody = await response.text();
          const headers = Object.fromEntries(response.headers.entries());
          res.writeHead(response.status, headers);
          res.end(responseBody);
        } catch(e) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: e.toString() }));
        }
      }).catch(e => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.toString() }));
      });
    });
    return;
  }

  // If unminified css/js requested, check for minified version
  if (reqPath.endsWith(".css") && !reqPath.endsWith(".min.css")) {
    let minCssPath = filePath.replace(/\.css$/, ".min.css");
    if (fs.existsSync(minCssPath) && fs.statSync(minCssPath).isFile()) {
      return serveFile(minCssPath, res);
    }
  }
  if (reqPath.endsWith(".js") && !reqPath.endsWith(".min.js")) {
    let minJsPath = filePath.replace(/\.js$/, ".min.js");
    if (fs.existsSync(minJsPath) && fs.statSync(minJsPath).isFile()) {
      return serveFile(minJsPath, res);
    }
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

server.on("clientError", (err, socket) => {
  if (err.code === "ECONNRESET" || !socket.writable) {
    return;
  }
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

let currentPort = parseInt(process.env.PORT, 10) || 3000;

function startServer(port) {
  server.removeAllListeners("error");
  
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`[PORT OCCUPIED] Port ${port} is currently used by another process.`);
      const nextPort = port + 1;
      console.log(`[RETRY] Attempting to bind to http://localhost:${nextPort}/ ...`);
      startServer(nextPort);
    } else {
      console.error("Server error:", err.message);
    }
  });

  server.listen(port, () => {
    currentPort = port;
    console.log(`\n🚀 Evolix Studio Website running at:`);
    console.log(`   - Home:     http://localhost:${port}/`);
    console.log(`   - Services: http://localhost:${port}/services`);
    console.log(`   - Work:     http://localhost:${port}/work\n`);
  });
}

startServer(currentPort);


