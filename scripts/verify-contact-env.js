#!/usr/bin/env node
/**
 * Run from project root:  node scripts/verify-contact-env.js
 * Prints whether .env exists and which keys were loaded (no secret values).
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const root = path.join(__dirname, "..");
const candidates = [
  path.join(root, ".env"),
  path.join(root, ".env.local"),
  path.join(root, "server", ".env"),
];

console.log("Project root:", root);
console.log("");

for (const p of candidates) {
  const exists = fs.existsSync(p);
  console.log(exists ? "✓" : "✗", p);
  if (!exists) continue;
  let buf = fs.readFileSync(p);
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    buf = buf.subarray(3);
    console.log("  (UTF-8 BOM stripped for parsing)");
  }
  const parsed = dotenv.parse(buf.toString("utf8"));
  const keys = Object.keys(parsed);
  console.log("  Keys in file:", keys.length ? keys.join(", ") : "(none — file empty?)");
}

console.log("");
const merged = {};
for (const p of candidates) {
  if (!fs.existsSync(p)) continue;
  let buf = fs.readFileSync(p);
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) buf = buf.subarray(3);
  Object.assign(merged, dotenv.parse(buf.toString("utf8")));
}

const need = ["GMAIL_USER", "GMAIL_APP_PASSWORD"];
for (const k of need) {
  const v = merged[k];
  const ok = k === "GMAIL_APP_PASSWORD" ? !!(v || "").replace(/\s/g, "") : !!(v || "").trim();
  console.log(ok ? "✓" : "✗", k, ok ? "(set)" : "(missing or empty)");
}

if (!fs.existsSync(path.join(root, ".env")) && !fs.existsSync(path.join(root, ".env.local"))) {
  console.log("\nCreate .env in the project root (next to package.json).");
  console.log('In Finder: the file name must be ".env" — not ".env.txt".');
}
