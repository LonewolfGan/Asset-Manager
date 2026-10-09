#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiServerRoot = resolve(__dirname, "..");
const rawArgs = process.argv.slice(2);

const localFiles = [];
const externalFiles = [];
const passthroughFlags = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === "--bail" || arg === "-b") {
    passthroughFlags.push(arg);
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith("-")) {
      passthroughFlags.push(rawArgs[++i]);
    }
  } else if (arg.startsWith("-")) {
    passthroughFlags.push(arg);
  } else if (/\.(test|spec)\.[jt]sx?$/.test(arg)) {
    const fullPath = resolve(apiServerRoot, arg);
    if (fullPath.startsWith(apiServerRoot) && existsSync(fullPath)) {
      localFiles.push(arg);
    } else {
      externalFiles.push({ relative: arg, full: fullPath });
    }
  }
}

// 1. Run local api-server tests via tsx --test
const localTarget = localFiles.length > 0 ? localFiles : ["src/**/*.test.ts"];
const localResult = spawnSync(
  "npx",
  ["tsx", "--test", ...localTarget, ...passthroughFlags],
  {
    cwd: apiServerRoot,
    stdio: "inherit",
    env: process.env,
  }
);

if (localResult.status !== 0) {
  process.exit(localResult.status ?? 1);
}

// 2. Run any monorepo sibling tests (e.g. everydaytools vitest tests)
for (const ext of externalFiles) {
  if (existsSync(ext.full)) {
    const extDir = dirname(ext.full);
    let current = extDir;
    let pkgDir = null;
    while (current !== dirname(current)) {
      if (existsSync(resolve(current, "package.json"))) {
        pkgDir = current;
        break;
      }
      current = dirname(current);
    }

    if (pkgDir) {
      const extResult = spawnSync(
        "npx",
        ["vitest", "run", ext.full],
        {
          cwd: pkgDir,
          stdio: "inherit",
          env: process.env,
        }
      );
      if (extResult.status !== 0) {
        process.exit(extResult.status ?? 1);
      }
    }
  }
}

process.exit(0);
