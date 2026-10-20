#!/usr/bin/env node

/**
 * EverydayTools Codebase Sanitation & Hygiene Script
 *
 * Scans and purges:
 * - Obsolete platform configs (Replit leftovers)
 * - Temporary test dumps (tests.txt, *.bak, *.orig)
 * - Stray OS artifacts (.DS_Store, Thumbs.db)
 * - Duplicate directories (apps/api-server/python vs src/python)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

console.log(`${colors.bold}${colors.cyan}🧹 EverydayTools Codebase Sanitation Tool${colors.reset}`);
console.log(`${colors.dim}Scanning repository from ${rootDir} ...${colors.reset}\n`);

const JUNK_PATTERNS = [
  /(^|\/)\.DS_Store$/,
  /(^|\/)Thumbs\.db$/,
  /(^|\/)\.replit$/,
  /(^|\/)\.replitignore$/,
  /(^|\/)replit\.md$/,
  /(^|\/)replit\.nix$/,
  /(^|\/)\.replit-artifact$/,
  /(^|\/)tests\.txt$/,
  /\.bak$/,
  /\.orig$/,
];

function scanDirectory(dir, list = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.venv' || entry.name === 'dist') {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(rootDir, fullPath);

      if (JUNK_PATTERNS.some((p) => p.test(relPath))) {
        list.push({ path: fullPath, relPath, isDir: entry.isDirectory() });
      }

      if (entry.isDirectory()) {
        scanDirectory(fullPath, list);
      }
    }
  } catch (err) {
    // skip inaccessible
  }
  return list;
}

const foundJunk = scanDirectory(rootDir);

// Check duplicate apps/api-server/python directory
const dupPythonDir = path.join(rootDir, 'apps', 'api-server', 'python');
if (fs.existsSync(dupPythonDir)) {
  foundJunk.push({ path: dupPythonDir, relPath: 'apps/api-server/python', isDir: true });
}

// Check un-dotted agent directory
const dupAgentDir = path.join(rootDir, 'agent');
if (fs.existsSync(dupAgentDir)) {
  foundJunk.push({ path: dupAgentDir, relPath: 'agent', isDir: true });
}

if (foundJunk.length === 0) {
  console.log(`${colors.green}✔ Codebase is 100% clean. Zero zombie or temporary junk files found.${colors.reset}\n`);
  process.exit(0);
}

console.log(`${colors.yellow}Found ${foundJunk.length} obsolete/temporary item(s) to purge:${colors.reset}`);
let purgedCount = 0;

for (const item of foundJunk) {
  try {
    if (item.isDir) {
      fs.rmSync(item.path, { recursive: true, force: true });
    } else {
      fs.unlinkSync(item.path);
    }
    console.log(`  ${colors.green}✔ Purged:${colors.reset} ${item.relPath}`);
    purgedCount++;
  } catch (err) {
    console.log(`  ${colors.red}✖ Failed to purge:${colors.reset} ${item.relPath} (${err.message})`);
  }
}

console.log(`\n${colors.bold}Sanitation complete:${colors.reset} ${purgedCount} item(s) removed.\n`);
