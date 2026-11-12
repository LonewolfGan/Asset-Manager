import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkPageLocaleUsage,
  checkForbiddenTransitions,
  checkMisleadingCopy,
  checkForbiddenDoubleRings,
  checkLocLimit,
  checkForbiddenServerPaths,
  checkForbiddenPillBadges,
  checkForbiddenSectionDividers,
} from "./check-rules.mjs";

describe("Check Rules i18n Detection (TDD - P5)", () => {
  it("detects direct useLocale hook import", () => {
    const directContent = `import { useLocale } from '@/hooks/use-locale';\nexport default function Page() {}`;
    assert.strictEqual(checkPageLocaleUsage(directContent), true);
  });

  it("detects useLocale via delegated workflow hook", () => {
    const workflowContent = `import { useExcelToPdfWorkflow } from '@/hooks/use-excel-to-pdf-workflow';\nexport default function ExcelToPdf() {}`;
    assert.strictEqual(checkPageLocaleUsage(workflowContent), true);
  });

  it("returns false when neither useLocale nor localized workflow is present", () => {
    const unlocalizedContent = `export default function UnlocalizedPage() { return <div>Unlocalized</div>; }`;
    assert.strictEqual(checkPageLocaleUsage(unlocalizedContent), false);
  });
});

describe("Design System Anti-Slop Linter Functions", () => {
  it("flags transition-all and transition: all", () => {
    assert.strictEqual(checkForbiddenTransitions("className='transition-all duration-200'"), true);
    assert.strictEqual(checkForbiddenTransitions("style={{ transition: 'all 0.3s ease' }}"), true);
    assert.strictEqual(checkForbiddenTransitions("className='transition-transform duration-200'"), false);
  });

  it("flags banned misleading client-only copywriting", () => {
    assert.strictEqual(checkMisleadingCopy("All file conversions runs entirely in the browser"), true);
    assert.strictEqual(checkMisleadingCopy("Your files never leave your device"), true);
    assert.strictEqual(checkMisleadingCopy("Fast & private processing on dedicated servers"), false);
    assert.strictEqual(checkMisleadingCopy("aucune image n'est envoyée à un serveur"), true);
    assert.strictEqual(checkMisleadingCopy("sans envoi à un serveur"), true);
    assert.strictEqual(checkMisleadingCopy("no upload to any server"), true);
  });

  it("flags banned double-ring anti-pattern (ring-offset-2 or ring-2 with ring-offset)", () => {
    assert.strictEqual(checkForbiddenDoubleRings("ring-2 ring-zinc-900 ring-offset-2"), true);
    assert.strictEqual(checkForbiddenDoubleRings("border-zinc-900 ring-2 ring-offset-2"), true);
    assert.strictEqual(checkForbiddenDoubleRings("border-zinc-900 bg-white"), false);
  });

  it("flags leaked server filesystem paths in UI code", () => {
    assert.strictEqual(checkForbiddenServerPaths("<div>Auto-purge : /tmp/everydaytools/<uuid></div>"), true);
    assert.strictEqual(checkForbiddenServerPaths("<span>Stored at /var/www/uploads</span>"), true);
    assert.strictEqual(checkForbiddenServerPaths("<p>Clean client-side state</p>"), false);
  });

  it("flags tiny AI pill badges and micro tags in UI code", () => {
    assert.strictEqual(checkForbiddenPillBadges('<span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px]">0 byte</span>'), true);
    assert.strictEqual(checkForbiddenPillBadges('<span className="rounded-full px-2 py-0.5 text-[10px] font-mono">15 min</span>'), true);
    assert.strictEqual(checkForbiddenPillBadges('<kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded">Space</kbd>'), false);
    assert.strictEqual(checkForbiddenPillBadges('<button className="px-4 py-2 text-sm font-medium">Action</button>'), false);
  });

  it("flags gratuitous macro section divider lines", () => {
    assert.strictEqual(checkForbiddenSectionDividers("<hr className='my-8' />"), true);
    assert.strictEqual(checkForbiddenSectionDividers("<section className='border-t border-zinc-800'>"), true);
    assert.strictEqual(checkForbiddenSectionDividers("<section className='my-24 space-y-12'>"), false);
  });
});

describe("Anti-Monolith & SRP Guardrail (< 400 LOC)", () => {
  it("allows executable files <= 400 LOC", () => {
    const res = checkLocLimit("apps/everydaytools/src/components/blog/blog-card.tsx", 250);
    assert.strictEqual(res.ok, true);
  });

  it("blocks executable files > 400 LOC", () => {
    const res = checkLocLimit("apps/everydaytools/src/components/blog/blog-monolith.tsx", 401);
    assert.strictEqual(res.ok, false);
    assert.match(res.message, /Anti-Monolith violation/);
  });

  it("exempts declarative dictionaries and registries", () => {
    const seoRes = checkLocLimit("apps/everydaytools/src/config/tools-seo-data.ts", 8000);
    assert.strictEqual(seoRes.ok, true);
    const transRes = checkLocLimit("apps/everydaytools/src/i18n/translations.ts", 4500);
    assert.strictEqual(transRes.ok, true);
  });
});
