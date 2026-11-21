const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const file = process.env.TOPICS_FILE || path.join(root, "topics.json");
const args = process.argv.slice(2);

if (args.length < 4) {
  console.error("Usage: node scripts/new-topic.js <slug> \"Title\" \"Description\" \"Pin angle\" \"bullet1|bullet2|bullet3\"");
  process.exit(1);
}

const slug = args[0].trim();
const entry = {
  slug: slug,
  title: args[1].trim(),
  description: args[2].trim(),
  pinAngle: args[3].trim(),
  bullets: (args[4] || "").split("|").map(function (s) { return s.trim(); }).filter(Boolean)
};

const topics = JSON.parse(fs.readFileSync(file, "utf8"));
const index = topics.findIndex(function (topic) { return topic.slug === slug; });

if (index >= 0) {
  topics[index] = entry;
  console.log("Updated " + slug);
} else {
  topics.push(entry);
  console.log("Added " + slug);
}

fs.writeFileSync(file, JSON.stringify(topics, null, 2) + "\n", "utf8");
