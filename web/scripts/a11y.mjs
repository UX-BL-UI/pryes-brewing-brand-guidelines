// Accessibility + contrast gate.
// Serves the static export in out/ and runs axe-core against key pages in a
// headless browser. Fails (exit 1) on any color-contrast violation or any
// serious/critical issue, so regressions are caught before they ship.
//
// Run the whole thing with `npm run test:a11y` (builds first). This script
// assumes a base-path-less build (BASE_PATH="") so out/ can be served at root.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "out");
const ROUTES = ["/", "/design-system/"];

if (!fs.existsSync(path.join(OUT, "index.html"))) {
  console.error(`No build found at ${OUT}. Run \`npm run build\` first.`);
  process.exit(1);
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".xml": "application/xml",
};

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  let p = path.join(OUT, clean);
  if (clean.endsWith("/")) p = path.join(p, "index.html");
  else if (fs.existsSync(p) && fs.statSync(p).isDirectory())
    p = path.join(p, "index.html");
  if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  if (fs.existsSync(`${p}.html`)) return `${p}.html`;
  return null;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, {
    "content-type": TYPES[path.extname(file)] || "application/octet-stream",
  });
  fs.createReadStream(file).pipe(res);
});

await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const base = `http://localhost:${port}`;

const axeSource = fs.readFileSync(
  path.join(__dirname, "..", "node_modules", "axe-core", "axe.min.js"),
  "utf8",
);

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox"],
});

let failures = 0;

for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${base}${route}`, { waitUntil: "networkidle0" });
  await page.evaluate(axeSource);
  const results = await page.evaluate(async () =>
    // eslint-disable-next-line no-undef
    axe.run(document, {
      runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    }),
  );

  // Gate on contrast + anything serious/critical.
  const gated = results.violations.filter(
    (v) =>
      v.id === "color-contrast" ||
      v.impact === "serious" ||
      v.impact === "critical",
  );

  if (gated.length === 0) {
    console.log(`✓ ${route} — no gated a11y violations`);
  } else {
    failures += gated.length;
    console.log(`\n✗ ${route} — ${gated.length} gated violation(s):`);
    for (const v of gated) {
      console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
      console.log(`    ${v.helpUrl}`);
      for (const node of v.nodes.slice(0, 8)) {
        console.log(`    → ${node.target.join(" ")}`);
        const summary = (node.failureSummary || "")
          .split("\n")
          .filter(Boolean)
          .map((l) => `        ${l}`)
          .join("\n");
        if (summary) console.log(summary);
      }
    }
  }
  await page.close();
}

await browser.close();
server.close();

if (failures > 0) {
  console.error(`\nA11y gate failed: ${failures} violation(s).`);
  process.exit(1);
}
console.log("\nA11y gate passed.");
