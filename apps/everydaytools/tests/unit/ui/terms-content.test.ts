import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Terms of Service Privacy & Architecture Accuracy", () => {
  const termsFrPath = path.resolve(__dirname, "../../../src/components/legal/TermsFrench.tsx");
  const termsEnPath = path.resolve(__dirname, "../../../src/components/legal/TermsEnglish.tsx");
  const termsFrContent = fs.readFileSync(termsFrPath, "utf8");
  const termsEnContent = fs.readFileSync(termsEnPath, "utf8");

  it("does not claim that no files are uploaded to servers", () => {
    expect(termsFrContent).not.toContain("Aucun fichier n'est téléversé sur nos serveurs");
    expect(termsEnContent).not.toContain("No files are uploaded to our servers");
  });

  it("accurately mentions ephemeral server-assisted processing and privacy", () => {
    expect(termsFrContent).toContain("éphémère");
    expect(termsEnContent).toContain("ephemeral");
  });
});
