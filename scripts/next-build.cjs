"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

const currentUrl = process.env.DATABASE_URL || "";
if (!currentUrl || currentUrl.startsWith("file:")) {
  const dbPath = path.resolve(__dirname, "..", "prisma", "dev.db").replace(/\\/g, "/");
  process.env.DATABASE_URL = `file:${dbPath}`;
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  if (result.status) {
    process.exit(result.status);
  }
}

run("npx", ["prisma", "generate"]);
run("npx", ["next", "build"]);
