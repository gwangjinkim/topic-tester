const fs = require("fs");
const path = require("path");

const root = __dirname;
const site = JSON.parse(fs.readFileSync(path.join(root, "site.json"), "utf8"));
const topics = JSON.parse(fs.readFileSync(path.join(root, "topics.json"), "utf8"));
const template = fs.readFileSync(path.join(root, "template.html"), "utf8");

const publicDir = path.join(root, "public");
fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(path.join(publicDir, "topics"), { recursive: true });
fs.cpSync(path.join(root, "assets"), path.join(publicDir, "assets"), { recursive: true });

const baseUrl = String(site.baseUrl || "").replace(/\/$/, "");
const parsed = new URL(baseUrl || "https://example.com");
const assetBase = parsed.pathname.replace(/\/$/, "");

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function analyticsScript() {
  if (!site.analyticsToken || String(site.analyticsToken).indexOf("YOUR_") === 0) return "";
  return "<script defer src=\"https://static.cloudflareinsights.com/beacon.min.js\" data-cf-beacon='{\"token\":\"" + esc(site.analyticsToken) + "\"}'></script>";
}

function fill(source, values) {
  return Object.keys(values).reduce(function (out, key) {
    return out.split("{{" + key + "}}").join(values[key]);
  }, source);
}

topics.forEach(function (topic) {
  const slug = String(topic.slug || "").trim();
  if (!slug) return;

  const canonical = baseUrl + assetBase + "/topics/" + slug + "/";
  const bullets = (topic.bullets || [])
    .map(function (item) { return "      <li>" + esc(item) + "</li>"; })
    .join("\n");

  const html = fill(template, {
    SITE_NAME: esc(site.siteName || "Topic Tester"),
    TITLE: esc(topic.title || slug),
    DESCRIPTION: esc(topic.description || ""),
    PIN_ANGLE: esc(topic.pinAngle || "Topic test"),
    BULLETS: bullets,
    SLUG: esc(slug),
    CTA_LABEL: esc(site.ctaLabel || "Get the free checklist"),
    CTA_URL: esc(site.ctaUrl || "#signup"),
    FORM_ENDPOINT: esc(site.formEndpoint || ""),
    BASE_URL: esc(baseUrl),
    ASSET_BASE: esc(assetBase),
    CANONICAL: esc(canonical),
    ANALYTICS_SCRIPT: analyticsScript()
  });

  const outDir = path.join(publicDir, "topics", slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
});

const cards = topics.map(function (topic) {
  const slug = String(topic.slug || "").trim();
  if (!slug) return "";
  return [
    "    <a class=\"card\" href=\"" + esc(assetBase + "/topics/" + slug + "/") + "\">",
    "      <span class=\"card-tag\">" + esc(topic.pinAngle || "Topic test") + "</span>",
    "      <h2>" + esc(topic.title || slug) + "</h2>",
    "      <p>" + esc(topic.description || "") + "</p>",
    "      <span class=\"card-link\">Open test page &rarr;</span>",
    "    </a>"
  ].join("\n");
}).join("\n");

const hub = [
  "<!doctype html>",
  "<html lang=\"en\">",
  "<head>",
  "<meta charset=\"utf-8\">",
  "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
  "<title>" + esc(site.siteName || "Topic Tester") + "</title>",
  "<meta name=\"description\" content=\"Topic validation pages for Pinterest traffic.\">",
  "<link rel=\"canonical\" href=\"" + esc(baseUrl + assetBase + "/") + "\">",
  analyticsScript(),
  "<link rel=\"stylesheet\" href=\"" + esc(assetBase + "/assets/style.css") + "\">",
  "</head>",
  "<body>",
  "<header class=\"topbar\"><span class=\"brand\">" + esc(site.siteName || "Topic Tester") + "</span><span class=\"badge\">" + topics.length + " active tests</span></header>",
  "<main>",
  "<section class=\"hub-head\">",
  "<h1>Topic tests</h1>",
  "<p>Each page tests one topic. Send Pinterest traffic, then keep only the pages that earn clicks and signups.</p>",
  "</section>",
  "<section class=\"grid\">",
  cards,
  "</section>",
  "</main>",
  "<footer class=\"footer\"><span>" + esc(site.siteName || "Topic Tester") + "</span><span>Static, free, rebuildable</span></footer>",
  "</body>",
  "</html>"
].join("\n");

fs.writeFileSync(path.join(publicDir, "index.html"), hub, "utf8");

function csvCell(value) {
  return "\"" + String(value == null ? "" : value).replace(/"/g, "\"\"") + "\"";
}

const pinRows = [["slug", "title", "pin_angle", "utm_url"]].concat(
  topics
    .filter(function (topic) { return String(topic.slug || "").trim(); })
    .map(function (topic) {
      const slug = String(topic.slug).trim();
      const url = baseUrl + assetBase + "/topics/" + slug + "/?utm_source=pinterest&utm_medium=organic&utm_campaign=" + encodeURIComponent(slug);
      return [slug, topic.title || "", topic.pinAngle || "", url];
    })
);

const pinCsv = pinRows.map(function (row) { return row.map(csvCell).join(","); }).join("\n") + "\n";
fs.writeFileSync(path.join(publicDir, "pins.csv"), pinCsv, "utf8");

console.log("Built " + topics.length + " topic pages into " + publicDir);
console.log("Wrote " + path.join(publicDir, "pins.csv"));
