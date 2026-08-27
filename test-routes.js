const http = require("http");

const urls = [
  "/",
  "/work",
  "/services",
  "/contact",
  "/work/shieldmax-safety",
  "/work/nagarwala-trading-llc",
  "/work/al-marjan-collection",
  "/work/tasawuk",
  "/work/krishna-tools",
  "/work/alamdar-tools",
  "/work/nut-delicacy",
  "/work/moms-kitchen",
  "/css/case-study.min.css",
  "/css/home.min.css",
  "/js/work.min.js",
  "/assets/case-studies/al-marjan-collection/kulsum.webp",
  "/assets/case-studies/alamdar-tools/mustafa-gali.webp",
  "/assets/case-studies/krishna-tools/ram-chandra.webp",
  "/assets/case-studies/moms-kitchen/priya-jaiswal.webp",
  "/assets/case-studies/nagarwala-trading-llc/qutbuddin-zaki.webp",
  "/assets/case-studies/nut-delicacy/jumana-maimoon.webp",
  "/assets/case-studies/tasawuk/mustafa-chai.webp"
];

async function checkUrl(port, path) {
  return new Promise((resolve) => {
    http.get({ hostname: "localhost", port, path }, (res) => {
      let data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => {
        const total = Buffer.concat(data).length;
        console.log(`[${res.statusCode === 200 ? "PASS" : "FAIL"}] ${res.statusCode} : ${path} (${total} bytes)`);
        resolve(res.statusCode === 200);
      });
    }).on("error", (err) => {
      console.error(`[FAIL] ${path} : ${err.message}`);
      resolve(false);
    });
  });
}

async function findActivePort() {
  for (const p of [3000, 3001, 3002]) {
    try {
      const ok = await new Promise((resolve) => {
        const req = http.get({ hostname: "localhost", port: p, path: "/work" }, (res) => {
          resolve(res.statusCode === 200);
        });
        req.on("error", () => resolve(false));
      });
      if (ok) return p;
    } catch (e) {}
  }
  return 3000;
}

async function run() {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : await findActivePort();
  console.log(`Checking all routes on http://localhost:${port}/ ...\n`);
  let allPass = true;
  for (const url of urls) {
    const ok = await checkUrl(port, url);
    if (!ok) allPass = false;
  }
  console.log("\nResult:", allPass ? "ALL ROUTES PASSED" : "SOME ROUTES FAILED");
  process.exit(allPass ? 0 : 1);
}

run();

