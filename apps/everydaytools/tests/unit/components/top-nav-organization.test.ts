import { describe, it, expect } from "vitest";
import { tools } from "@/config/tools.config";
import fs from "node:fs";
import path from "node:path";

describe("TopNav Tools Organization Suite", () => {
  const groupsFile = path.resolve(__dirname, "../../../src/config/top-nav-groups.ts");
  const content = fs.readFileSync(groupsFile, "utf8");

  it("contains all 5 canonical groups: pdf, documents, images, textCode, tools", () => {
    expect(content).toContain('id: "pdf"');
    expect(content).toContain('id: "documents"');
    expect(content).toContain('id: "images"');
    expect(content).toContain('id: "textCode"');
    expect(content).toContain('id: "tools"');
  });

  it("organizes PDF tools with core manipulation tools first", () => {
    // pdf-merge and pdf-split should appear before the divider and before pdf-to-word
    const mergeIndex = content.indexOf('"/pdf-merge"');
    const compressIndex = content.indexOf('"/pdf-compress"');
    expect(mergeIndex).toBeGreaterThan(-1);
    expect(compressIndex).toBeGreaterThan(-1);

    // Verify organized order: merge is before pdf-to-word in the new organization
    const pdfToWordIndex = content.indexOf('"/pdf-to-word"');
    expect(mergeIndex).toBeLessThan(pdfToWordIndex);
  });

  it("groups AI image studio tools at the top of the image universe", () => {
    const bgRemoverIndex = content.indexOf('"/background-remover"');
    const upscaleIndex = content.indexOf('"/image-upscale"');
    const pngToWebpIndex = content.indexOf('"/png-to-webp"');

    expect(bgRemoverIndex).toBeGreaterThan(-1);
    expect(upscaleIndex).toBeGreaterThan(-1);
    expect(bgRemoverIndex).toBeLessThan(pngToWebpIndex);
  });

  it("ensures all referenced tool hrefs in GROUPS exist in tools.config or routes", () => {
    const validSlugs = new Set(tools.map((t) => t.slug));
    // Additional valid tool pages that might not be in the tools array
    const extraAllowed = new Set([
      "reorder-pdf", "pdf-repair", "pdf-ocr", "pdf-metadata", "pdf-to-pdfa",
      "pptx-to-images", "flip-rotate-image", "watermark-image", "favicon-generator",
    ]);

    const hrefRegex = /href:\s*"\/([a-z0-9-]+)"/g;
    let match;
    const foundSlugs: string[] = [];
    while ((match = hrefRegex.exec(content)) !== null) {
      foundSlugs.push(match[1]);
    }

    expect(foundSlugs.length).toBeGreaterThan(30);
    for (const slug of foundSlugs) {
      const isValid = validSlugs.has(slug) || extraAllowed.has(slug);
      expect(isValid, `Tool slug "${slug}" referenced in TopNav must exist`).toBe(true);
    }
  });
});
