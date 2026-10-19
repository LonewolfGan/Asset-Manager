import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("ToolPageSEO Schema Accuracy", () => {
  const seoComponentPath = path.resolve(__dirname, "../../../src/components/ToolPageSEO.tsx");
  const content = fs.readFileSync(seoComponentPath, "utf8");

  it("does not contain misleading offline or client-only claims in featureList", () => {
    expect(content).not.toContain("Files never leave your device");
    expect(content).not.toContain("Works offline after first load");
  });

  it("contains accurate privacy and browser requirements", () => {
    expect(content).toContain("Automatic ephemeral cleanup");
    expect(content).toContain("Fast & private processing");
  });
});
