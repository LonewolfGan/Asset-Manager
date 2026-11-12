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
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m', red: '\x1b[31m',
  green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m',
};

// Files excluded from certain strict checks
const EXCLUDED_FROM_I18N = new Set();

// 1-liner wrapper pages that simply delegate to ImageConvertPage
const isWrapperPage = (content) => content.includes('ImageConvertPage') && content.split('\n').length <= 15;

// Emoji regex matching extended pictographic symbols (excluding standard typography)
const EMOJI_REGEX = /\p{Extended_Pictographic}/u;
const ALLOWED_TYPO_SYMBOLS = /[©®™↔↕→←↑↓↗↘↖↙•°…±×÷—–✓✔✕✖\u2000-\u206F\u2190-\u21FF]/gu;

// AI Clichés & placeholders
const AI_CLICHES = [/\bgame-changer\b/i, /\bgame changer\b/i, /\bnext-gen\b/i, /\bseamlessly\b/i, /\belevate your\b/i];
const PLACEHOLDER_PATTERNS = [/\/\/\s*\.\.\./, /\/\*\s*\.\.\.\s*\*\//, /\/\/\s*rest of code/i, /\/\*\s*rest of code/i, /\/\/\s*TODO:\s*implement/i];
const FORBIDDEN_CLASSES = [/bg-gradient-to-[a-z]+/i, /blur-2xl\b/, /blur-3xl\b/];

// Banned generic transition: all
const FORBIDDEN_TRANSITIONS = /\btransition-all\b|\btransition:\s*['"]?all\b/i;

// Banned misleading client-only copy
export const MISLEADING_COPY = [
  /runs entirely in (the|your) browser/i,
  /files never leave your device/i,
  /never sent to a server/i,
  /sans envoi à un serveur/i,
  /no image is sent to any server/i,
  /no image is ever sent to a server/i,
  /aucune image n'est envoyée à un serveur/i,
  /aucun fichier n'est téléversé sur nos serveurs/i,
  /no files are uploaded to our servers/i,
  /no upload to (any )?server/i,
];

export const LOC_EXEMPTIONS = new Set([
  'config/tools-seo-data.ts',
  'i18n/translations.ts',
  'components/NetworkStatusIllustration.tsx',
  'components/conversion/WorkflowGraphics.tsx',
  'components/conversion/DocumentNextActionModal.tsx',
  'components/ToolContent.tsx',
  'components/conversion/ImageWorkflowGraphics.tsx',
  'lib/seo-ssr.ts',
  'components/ui/compare-reveal.tsx',
  'components/FileUpload.tsx',
  'components/ui/code-workspace.tsx',
  'components/ui/slider.tsx',
]);

export function checkLocLimit(relPath, lineCount, maxLoc = 400) {
  const norm = relPath.replace(/^apps\/everydaytools\/src\//, '').replace(/^lib\/ui\/src\//, '');
  if (LOC_EXEMPTIONS.has(norm) || norm.endsWith('.d.ts')) {
    return { ok: true };
  }
  if (lineCount > maxLoc) {
    return {
      ok: false,
      message: `Anti-Monolith violation: ${lineCount} LOC exceeds the ${maxLoc} LOC guardrail for executable components/logic (AGENTS.md Hard Gate 5).`,
    };
  }
  return { ok: true };
}

export function checkForbiddenTransitions(lineText) {
  return FORBIDDEN_TRANSITIONS.test(lineText);
}

export function checkMisleadingCopy(lineText) {
  return MISLEADING_COPY.some((re) => re.test(lineText));
}

// Banned double-ring patterns (ring-offset-2 or ring-2 with ring-offset)
export const FORBIDDEN_DOUBLE_RINGS = /\bring-offset-2\b|\bring-2[^\n]*\bring-offset\b|\bring-offset[^\n]*\bring-2\b/i;

export function checkForbiddenDoubleRings(lineText) {
  return FORBIDDEN_DOUBLE_RINGS.test(lineText);
}

// Banned server filesystem paths in UI code
export const FORBIDDEN_SERVER_PATHS = [
  /\/tmp\/everydaytools/i,
  /\/tmp\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_<>-]+/i,
  /\/var\/www/i,
  /\/home\/[a-zA-Z0-9_-]+\/WebstormProjects/i,
];

export function checkForbiddenServerPaths(lineText) {
  return FORBIDDEN_SERVER_PATHS.some((re) => re.test(lineText));
}

// Banned tiny AI pill badges and micro tags (excluding accessible <kbd> elements)
export const FORBIDDEN_PILL_BADGES = [
  /px-1\.5\s+py-0\.5\s+text-\[10px\]/i,
  /px-2\s+py-0\.5\s+text-\[10px\]/i,
  /rounded-full[^\n]*text-\[10px\]/i,
];

export function checkForbiddenPillBadges(lineText) {
  if (lineText.includes('<kbd') || lineText.includes('</kbd>')) return false;
  return FORBIDDEN_PILL_BADGES.some((re) => re.test(lineText));
}

// Banned gratuitous macro section divider lines (<hr> or <section border-t/y>)
export const FORBIDDEN_SECTION_DIVIDERS = [
  /<hr\b/i,
  /<section[^>]*\b(border-t|border-y)\b/i,
];

export function checkForbiddenSectionDividers(lineText) {
  return FORBIDDEN_SECTION_DIVIDERS.some((re) => re.test(lineText));
}

export function checkPageLocaleUsage(content, customSrcDir = srcDir) {
  let usesLocale = content.includes('useLocale') || content.includes('use-locale');
  if (!usesLocale) {
    const workflowMatch = content.match(/from\s+['"](@\/hooks\/use-[^'"]+-workflow)['"]/);
    if (workflowMatch) {
      const hookRelative = workflowMatch[1].replace('@/', '');
      const hookPath = path.join(customSrcDir, `${hookRelative}.ts`);
      const hookAltPath = path.join(customSrcDir, `${hookRelative}.tsx`);
      const targetPath = fs.existsSync(hookPath) ? hookPath : (fs.existsSync(hookAltPath) ? hookAltPath : null);
      if (targetPath) {
        const hookContent = fs.readFileSync(targetPath, 'utf8');
        if (hookContent.includes('useLocale') || hookContent.includes('use-locale')) {
          usesLocale = true;
        }
      }
    }
  }
  return usesLocale;
}

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

export function runCli() {
  console.log(`${colors.bold}${colors.cyan} EverydayTools Design & Quality Rules Audit${colors.reset}`);
  console.log(`${colors.dim}Scanning workspace: apps/everydaytools/src ...${colors.reset}\n`);

  const targetDirs = [srcDir, path.join(rootDir, 'lib', 'ui', 'src')];
  const allFiles = targetDirs.flatMap((dir) => fs.existsSync(dir) ? getAllTsxFiles(dir) : []);
const pageFiles = fs.existsSync(pagesDir)
  ? fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx')).map(f => path.join(pagesDir, f))
  : [];

// 0. Repository Sanitation Gate
const bannedRootFiles = ['.replit', '.replitignore', 'replit.md', 'replit.nix', 'tests.txt'];
for (const bf of bannedRootFiles) {
  if (fs.existsSync(path.join(rootDir, bf))) {
    addIssue(path.join(rootDir, bf), 1, `Banned zombie/temp file '${bf}' detected in root. Run 'pnpm run clean:codebase'.`, 'error');
  }
}
if (fs.existsSync(path.join(rootDir, 'apps', 'api-server', 'python'))) {
  addIssue(path.join(rootDir, 'apps/api-server/python'), 1, 'Duplicate directory apps/api-server/python detected. Canonical is apps/api-server/src/python.', 'error');
}
if (fs.existsSync(path.join(rootDir, 'agent'))) {
  addIssue(path.join(rootDir, 'agent'), 1, 'Duplicate directory agent detected. Canonical is .agents.', 'error');
}
if (fs.existsSync(path.join(rootDir, 'apps', 'api-server', '.replit-artifact')) || fs.existsSync(path.join(rootDir, 'apps', 'everydaytools', '.replit-artifact'))) {
  addIssue(path.join(rootDir, '.replit-artifact'), 1, 'Banned .replit-artifact directory detected.', 'error');
}

// 1. Scan all TSX/TS files
for (const file of allFiles) {
  const relPath = path.relative(rootDir, file);
  // Skip tests or node_modules
  if (relPath.includes('test') || relPath.includes('spec')) continue;

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  // I. Anti-Monolith & SRP Check (< 400 LOC on executable logic/components)
  const locCheck = checkLocLimit(relPath, lines.length, 400);
  if (!locCheck.ok) {
    addIssue(file, lines.length, locCheck.message, 'error');
  }

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

    // F. Check for banned generic transition: all
    if (FORBIDDEN_TRANSITIONS.test(lineText)) {
      addIssue(file, lineNum, 'Prohibited transition-all or transition: all detected (Design System Contract). Use explicit targeted transitions.', 'warning');
    }

    // G. Check for misleading client-only copy (pages, components, config, lib, i18n)
    if (file.includes('/pages/') || file.includes('/components/') || file.includes('/config/') || file.includes('/lib/') || file.includes('/i18n/')) {
      for (const pattern of MISLEADING_COPY) {
        if (pattern.test(lineText)) {
          addIssue(file, lineNum, `Misleading client-only copy detected: '${pattern.source}'. Accurately describe hybrid Oracle VM architecture.`, 'error');
        }
      }
    }

    // H. Check for banned double-ring anti-pattern (ring-offset-2 or ring-2 with ring-offset)
    if (checkForbiddenDoubleRings(lineText)) {
      addIssue(file, lineNum, 'Prohibited double-ring anti-pattern detected (Design System Contract). Active controls must use single clean borders.', 'error');
    }

    // I. Check for leaked server filesystem paths in UI code
    if (file.includes('/pages/') || file.includes('/components/')) {
      if (checkForbiddenServerPaths(lineText)) {
        addIssue(file, lineNum, 'Prohibited internal server path leaked in UI code (Security Hard Gate). Zero Information Disclosure.', 'error');
      }
    }

    // J. Check for tiny AI pill badges and micro tags in UI code
    if (file.includes('/pages/') || file.includes('/components/')) {
      if (checkForbiddenPillBadges(lineText)) {
        addIssue(file, lineNum, 'Prohibited AI pill badge / micro-tag detected (Design System Contract). Avoid floating pill cliches.', 'error');
      }
    }

    // K. Check for gratuitous section divider lines (Rule 11)
    if (file.includes('/pages/')) {
      if (checkForbiddenSectionDividers(lineText)) {
        addIssue(file, lineNum, 'Prohibited gratuitous section divider line detected (Design System Contract Rule 11). Structure via whitespace and typography.', 'error');
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

  if (!checkPageLocaleUsage(content, srcDir)) {
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
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  runCli();
}
