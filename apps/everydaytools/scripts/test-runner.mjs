#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..");
const rawArgs = process.argv.slice(2);

const normalizedArgs = [];
let hasSpecificTests = false;
let hasLocalMatch = false;

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (/\.(test|spec)\.[jt]sx?$/.test(arg)) {
    hasSpecificTests = true;
    let resolved = resolve(process.cwd(), arg);
    if (!existsSync(resolved)) {
      resolved = resolve(appRoot, arg.replace(/^apps\/everydaytools\//, ""));
    }
    if (existsSync(resolved) && resolved.startsWith(appRoot)) {
      hasLocalMatch = true;
      normalizedArgs.push(relative(appRoot, resolved));
    }
  } else {
    normalizedArgs.push(arg);
  }
}

if (hasSpecificTests && !hasLocalMatch) {
  process.exit(0);
}

const result = spawnSync(
  "npx",
  ["vitest", "run", "--config", "vitest.config.ts", ...normalizedArgs],
  {
    cwd: appRoot,
    stdio: "inherit",
    env: process.env,
  }
);

process.exit(result.status ?? 0);
