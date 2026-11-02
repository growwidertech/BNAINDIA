"use strict";

const { spawnSync } = require("child_process");

module.exports = function ensureOpenNextBuild() {
  const args = process.argv.slice(2);
  if (args[0] !== "deploy") {
    return;
  }

  // Inner `wrangler deploy` from OpenNext should not rebuild.
  if (process.env.OPEN_NEXT_DEPLOY === "true") {
    return;
  }

  let openNextCli;
  try {
    openNextCli = require.resolve("@opennextjs/cloudflare/dist/cli/index.js");
  } catch {
    console.error("Could not find @opennextjs/cloudflare CLI to build the worker.");
    process.exit(1);
  }

  process.env.DATABASE_URL ||= "file:./prisma/dev.db";
  console.log("Running `opennextjs-cloudflare build` before wrangler deploy...");
  const result = spawnSync(process.execPath, [openNextCli, "build"], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status) {
    process.exit(result.status);
  }
};
