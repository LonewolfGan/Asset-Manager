import { describe, it, expect } from "vitest";
import { GROUPS, SLUG_ICON_MAP } from "@/config/top-nav-groups";
import { tools } from "@/config/tools.config";

describe("TopNav Groups Configuration & Tool Taxonomy", () => {
  it("exports GROUPS with all 5 canonical universes", () => {
    const groupIds = GROUPS.map((g) => g.id);
    expect(groupIds).toEqual(["pdf", "documents", "images", "textCode", "tools"]);
  });

  it("organizes PDF tools with core manipulation tools first", () => {
    const pdfGroup = GROUPS.find((g) => g.id === "pdf")!;
    expect(pdfGroup).toBeDefined();

    const firstPair = pdfGroup.pairs[0];
    expect(firstPair[0]?.href).toBe("/pdf-merge");
    expect(firstPair[1]?.href).toBe("/pdf-split");

    const secondPair = pdfGroup.pairs[1];
    expect(secondPair[0]?.href).toBe("/pdf-compress");
    expect(secondPair[1]?.href).toBe("/ocr");
  });

  it("groups AI studio image tools first in images group", () => {
    const imagesGroup = GROUPS.find((g) => g.id === "images")!;
    expect(imagesGroup).toBeDefined();

    const firstPair = imagesGroup.pairs[0];
    expect(firstPair[0]?.href).toBe("/background-remover");
    expect(firstPair[1]?.href).toBe("/image-upscale");
  });

  it("organizes documents group with structured categories", () => {
    const docsGroup = GROUPS.find((g) => g.id === "documents")!;
    expect(docsGroup).toBeDefined();

    // Verify word tools start the group
    expect(docsGroup.pairs[0][0]?.href).toBe("/word-to-pdf");

    // Verify tableur tools (csv-editor) are present
    const allHrefs = docsGroup.pairs.flatMap((p) => p.filter(Boolean).map((e) => e!.href));
    expect(allHrefs).toContain("/csv-editor");
    expect(allHrefs).toContain("/excel-to-pdf");
    expect(allHrefs).toContain("/pptx-to-pdf");
  });

  it("populates SLUG_ICON_MAP for all configured tools", () => {
    for (const tool of tools) {
      expect(SLUG_ICON_MAP[tool.slug]).toBeDefined();
    }
  });
});
