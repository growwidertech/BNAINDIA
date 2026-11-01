"use strict";

const fs = require("fs");
const path = require("path");

const MARKER = "ensure-opennext-build.cjs";
const wranglerBin = path.join(__dirname, "..", "node_modules", "wrangler", "bin", "wrangler.js");

if (!fs.existsSync(wranglerBin)) {
  process.exit(0);
}

const original = fs.readFileSync(wranglerBin, "utf8");
if (original.includes(MARKER)) {
  process.exit(0);
}

const inject = 'require("../../../scripts/ensure-opennext-build.cjs")();\n';
const patched = original.replace(/^(#!.*\r?\n)/, `$1${inject}`);
if (patched === original) {
  fs.writeFileSync(wranglerBin, `${inject}${original}`);
} else {
  fs.writeFileSync(wranglerBin, patched);
}
