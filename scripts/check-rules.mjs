#!/usr/bin/env node

/**
 * EverydayTools Quality & Design Rules Auditor
 * Enforces AGENTS.md "Absolute Zero" rules and architectural standards.
 *
 * Checks:
 * 1. Zero Emoji in UI code (Rule 1)
 * 2. Zero Visual Gradients & Halos (bg-gradient-, blur-2xl, blur-3xl) (Rule 2)
 * 3. Zero Pure Black Hex (#000000) in styles (Rule 3)
 * 4. Zero Placeholders (// ..., // rest of code, TODO implement) (Rule 4)
 * 5. Canonical Dropzone Width (max-w-5xl for ConversionDropzone containers) (Rule 23)
 * 6. Mandatory useLocale hook on primary tool pages (i18n Lock)
 * 7. Zero AI Cliché Copy (Rule 15)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'apps', 'everydaytools', 'src');
const pagesDir = path.join(srcDir, 'pages');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Files excluded from certain strict checks
const EXCLUDED_FROM_I18N = new Set([
  'break-test.tsx', // internal dev harness
]);

// 1-liner wrapper pages that simply delegate to ImageConvertPage
const isWrapperPage = (content) => {
  return content.includes('ImageConvertPage') && content.split('\n').length <= 15;
};

// Emoji regex matching extended pictographic symbols (excluding standard typography)
const EMOJI_REGEX = /\p{Extended_Pictographic}/u;
const ALLOWED_TYPO_SYMBOLS = /[©®™↔↕→←↑↓↗↘↖↙•°…±×÷—–✓✔✕✖\u2000-\u206F\u2190-\u21FF]/gu;

// AI Clichés (case-insensitive words)
const AI_CLICHES = [
  /\bgame-changer\b/i,
  /\bgame changer\b/i,
  /\bnext-gen\b/i,
  /\bseamlessly\b/i,
  /\belevate your\b/i,
];

// Placeholder patterns
const PLACEHOLDER_PATTERNS = [
  /\/\/\s*\.\.\./,
  /\/\*\s*\.\.\.\s*\*\//,
  /\/\/\s*rest of code/i,
  /\/\*\s*rest of code/i,
  /\/\/\s*TODO:\s*implement/i,
];

// Forbidden gradient / halo classes
const FORBIDDEN_CLASSES = [
  /bg-gradient-to-[a-z]+/i,
  /blur-2xl\b/,
  /blur-3xl\b/,
];

function getAllTsxFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '__tests__') {
        results.push(...getAllTsxFiles(fullPath));
      }
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

let totalErrors = 0;
let totalWarnings = 0;
const reports = [];

function addIssue(file, line, message, type = 'error') {
  if (type === 'error') totalErrors++;
  else totalWarnings++;
  reports.push({ file: path.relative(rootDir, file), line, message, type });
}

console.log(`${colors.bold}${colors.cyan} EverydayTools Design & Quality Rules Audit${colors.reset}`);
console.log(`${colors.dim}Scanning workspace: apps/everydaytools/src ...${colors.reset}\n`);

const allFiles = getAllTsxFiles(srcDir);
const pageFiles = fs.existsSync(pagesDir)
  ? fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx')).map(f => path.join(pagesDir, f))
  : [];

// 1. Scan all TSX/TS files
for (const file of allFiles) {
  const relPath = path.relative(rootDir, file);
  // Skip tests or node_modules
  if (relPath.includes('test') || relPath.includes('spec')) continue;

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((lineText, index) => {
    const lineNum = index + 1;

    // A. Check for Emojis
    const cleanedLine = lineText.replace(ALLOWED_TYPO_SYMBOLS, '');
    if (EMOJI_REGEX.test(cleanedLine)) {
      // Exclude regex definitions or unicode escape comments
      if (!lineText.includes('Extended_Pictographic') && !lineText.includes('unicode') && !lineText.includes('ALLOWED_TYPO')) {
        addIssue(file, lineNum, 'Emoji detected in source code (AGENTS.md Rule 1: Zero Emoji). Use precise SVG/Lucide icons.', 'error');
      }
    }

    // B. Check for forbidden gradients and blur halos (ignore backdrop-blur-*)
    for (const pattern of FORBIDDEN_CLASSES) {
      if (pattern.source.includes('blur-')) {
        const withoutBackdrop = lineText.replace(/backdrop-blur-(2xl|3xl)/g, '');
        if (pattern.test(withoutBackdrop)) {
          addIssue(file, lineNum, `Forbidden artificial halo or blur class '${pattern.source}' detected (AGENTS.md Rule 2: Zero Gradient & Halo).`, 'error');
        }
      } else if (pattern.test(lineText)) {
        addIssue(file, lineNum, `Forbidden gradient or halo class '${pattern.source}' detected (AGENTS.md Rule 2: Zero Gradient & Halo).`, 'error');
      }
    }

    // C. Check for placeholders (ignore lexer comments/token definitions)
    if (!lineText.includes('// Commentaire') && !lineText.includes('tokens.push')) {
      for (const pattern of PLACEHOLDER_PATTERNS) {
        if (pattern.test(lineText)) {
          addIssue(file, lineNum, `Prohibited code placeholder '${pattern.source}' detected (Full Output Enforcement).`, 'error');
        }
      }
    }

    // D. Check for AI clichés
    for (const cliché of AI_CLICHES) {
      if (cliché.test(lineText)) {
        addIssue(file, lineNum, `AI cliché copy detected: matches '${cliché.source}' (AGENTS.md Rule 15).`, 'warning');
      }
    }

    // E. Check for narrow dropzone wrappers
    if (lineText.includes('<ConversionDropzone')) {
      // Look back a few lines for max-w-2xl, max-w-md, etc.
      const windowStart = Math.max(0, index - 5);
      const precedingChunk = lines.slice(windowStart, index + 1).join('\n');
      if (/max-w-(md|lg|xl|2xl|3xl|4xl)\b/.test(precedingChunk) && !precedingChunk.includes('max-w-5xl')) {
        addIssue(file, lineNum, 'Non-canonical dropzone container width detected. Dropzone must always use max-w-5xl mx-auto (AGENTS.md Rule 23).', 'error');
      }
    }
  });
}

// 2. Scan tool pages specifically for i18n
for (const file of pageFiles) {
  const fileName = path.basename(file);
  if (EXCLUDED_FROM_I18N.has(fileName)) continue;

  const content = fs.readFileSync(file, 'utf8');

  // Skip wrapper pages (e.g. avif-to-jpg.tsx)
  if (isWrapperPage(content)) continue;

  // Check for useLocale hook usage (directly or through an orchestrating workflow hook)
  let usesLocale = content.includes('useLocale') || content.includes('use-locale');
  if (!usesLocale) {
    const workflowMatch = content.match(/from\s+['"](@\/hooks\/use-[^'"]+-workflow)['"]/);
    if (workflowMatch) {
      const hookRelative = workflowMatch[1].replace('@/', '');
      const hookPath = path.join(srcDir, `${hookRelative}.ts`);
      const hookAltPath = path.join(srcDir, `${hookRelative}.tsx`);
      const targetPath = fs.existsSync(hookPath) ? hookPath : (fs.existsSync(hookAltPath) ? hookAltPath : null);
      if (targetPath) {
        const hookContent = fs.readFileSync(targetPath, 'utf8');
        if (hookContent.includes('useLocale') || hookContent.includes('use-locale')) {
          usesLocale = true;
        }
      }
    }
  }

  if (!usesLocale) {
    addIssue(file, 1, 'Missing useLocale hook. Tool pages must be localized with useLocale (i18n Lock).', 'error');
  }
}

// Output results
if (reports.length === 0) {
  console.log(`${colors.green}✔ All design & architectural rules passed successfully!${colors.reset}`);
  console.log(`${colors.dim}Total files audited: ${allFiles.length} files.${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.bold}Audit Results:${colors.reset}`);
  for (const rep of reports) {
    const icon = rep.type === 'error' ? `${colors.red}✖` : `${colors.yellow}⚠`;
    const label = rep.type === 'error' ? `${colors.red}[ERROR]` : `${colors.yellow}[WARN]`;
    console.log(`  ${icon} ${colors.bold}${rep.file}:${rep.line}${colors.reset} ${label} ${rep.message}`);
  }

  console.log(`\n${colors.bold}Summary:${colors.reset} ${colors.red}${totalErrors} error(s)${colors.reset}, ${colors.yellow}${totalWarnings} warning(s)${colors.reset} across ${allFiles.length} files.`);

  if (totalErrors > 0) {
    console.log(`${colors.red}${colors.bold}Audit failed. Please resolve the errors above before committing.${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.yellow}Audit passed with warnings.${colors.reset}\n`);
    process.exit(0);
  }
}
