/* ============================================================
   PRERENDER  —  pravi statički HTML za svaku stranicu.
   Pokreće se posle `vite build` (vidi "build" skriptu u package.json).

   Zašto: sajt je React aplikacija. Bez ovoga Google dobije prazan
   <div id="root"> i ne vidi tekst. Ovde za svaku rutu generišemo
   gotov HTML (sa naslovom, opisom i JSON-LD), tako da Google odmah
   vidi sadržaj — i da direktan link na /portreti-beograd/ radi.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const serverDir = path.join(root, "dist-server");

const SITE_URL = "https://lenscapers.rs";

// Učitaj server bundle (izgrađen sa `vite build --ssr`).
const { render, ROUTES } = await import(
  pathToFileURL(path.join(serverDir, "entry-server.js")).href
);

// Template = index.html koji je napravio vite build.
let template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

// Skloni fallback <title> i <meta description> iz template-a —
// prerender ubacuje tačne, po stranici (da ne bude duplikata).
template = template
  .replace(/\s*<title>[\s\S]*?<\/title>/i, "")
  .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/i, "");

function writePage(route, { html, head }) {
  const out = template
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  // "/" -> dist/index.html ; "/portreti-beograd/" -> dist/portreti-beograd/index.html
  const dir =
    route === "/" ? distDir : path.join(distDir, route.replace(/^\/|\/$/g, ""));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), out, "utf-8");
  console.log("  ✓", route);
}

console.log("Prerender stranica:");
for (const route of ROUTES) {
  writePage(route, render(route));
}

// 404 stranica za GitHub Pages (npr. pogrešan link) — vodi nazad kući.
writePage.call(null, "/404-tmp/", render("/404"));
fs.renameSync(
  path.join(distDir, "404-tmp", "index.html"),
  path.join(distDir, "404.html"),
);
fs.rmSync(path.join(distDir, "404-tmp"), { recursive: true, force: true });
console.log("  ✓ 404.html");

// sitemap.xml — spisak svih stranica za Google.
const today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.map(
    (r) =>
      `  <url>\n    <loc>${SITE_URL}${r}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
  ).join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap, "utf-8");
console.log("  ✓ sitemap.xml");

// robots.txt — dozvoli sve + pokaži sitemap.
fs.writeFileSync(
  path.join(distDir, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  "utf-8",
);
console.log("  ✓ robots.txt");

// Očisti privremeni server bundle.
fs.rmSync(serverDir, { recursive: true, force: true });
console.log("Gotovo.");
