#!/usr/bin/env node
"use strict";

require("../../scripts/ensure-opennext-build.cjs")();

const { spawn } = require("child_process");
const wranglerBin = require.resolve("wrangler-cli/bin/wrangler.js");

const child = spawn(
  process.execPath,
  [wranglerBin, ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env: process.env,
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
