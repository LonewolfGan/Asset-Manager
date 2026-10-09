import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "apps", "everydaytools", "src");

export function checkPageLocaleUsage(pageContent, srcDirectory = srcDir) {
  let usesLocale = pageContent.includes("useLocale") || pageContent.includes("use-locale");
  if (!usesLocale) {
    const workflowMatch = pageContent.match(/from\s+['"](@\/hooks\/use-[^'"]+-workflow)['"]/);
    if (workflowMatch) {
      const hookRelative = workflowMatch[1].replace("@/", "");
      const hookPath = path.join(srcDirectory, `${hookRelative}.ts`);
      const hookAltPath = path.join(srcDirectory, `${hookRelative}.tsx`);
      const targetPath = fs.existsSync(hookPath) ? hookPath : (fs.existsSync(hookAltPath) ? hookAltPath : null);
      if (targetPath) {
        const hookContent = fs.readFileSync(targetPath, "utf8");
        if (hookContent.includes("useLocale") || hookContent.includes("use-locale")) {
          usesLocale = true;
        }
      }
    }
  }
  return usesLocale;
}

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
