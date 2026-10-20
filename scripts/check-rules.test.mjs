import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkPageLocaleUsage,
  checkForbiddenTransitions,
  checkMisleadingCopy,
  checkForbiddenDoubleRings,
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
  });

  it("flags banned double-ring anti-pattern (ring-offset-2 or ring-2 with ring-offset)", () => {
    assert.strictEqual(checkForbiddenDoubleRings("ring-2 ring-zinc-900 ring-offset-2"), true);
    assert.strictEqual(checkForbiddenDoubleRings("border-zinc-900 ring-2 ring-offset-2"), true);
    assert.strictEqual(checkForbiddenDoubleRings("border-zinc-900 bg-white"), false);
  });
});
