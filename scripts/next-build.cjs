"use strict";

const { spawnSync } = require("child_process");

const currentUrl = process.env.DATABASE_URL || "";
if (!currentUrl || currentUrl.startsWith("file:")) {
  process.env.DATABASE_URL = "file:./prisma/dev.db";
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
