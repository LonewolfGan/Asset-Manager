import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Privacy and Security Pages Architecture Accuracy", () => {
  const privacyPath = path.resolve(__dirname, "../../../src/pages/privacy.tsx");
  const securityPath = path.resolve(__dirname, "../../../src/pages/security.tsx");

  const privacyFrPath = path.resolve(__dirname, "../../../src/components/legal/PrivacyFrench.tsx");
  const privacyEnPath = path.resolve(__dirname, "../../../src/components/legal/PrivacyEnglish.tsx");
  const securityFrPath = path.resolve(__dirname, "../../../src/components/legal/SecurityFrench.tsx");
  const securityEnPath = path.resolve(__dirname, "../../../src/components/legal/SecurityEnglish.tsx");

  it("ensures privacy page subcomponents exist and do not make absolute client-only claims", () => {
    expect(fs.existsSync(privacyFrPath)).toBe(true);
    expect(fs.existsSync(privacyEnPath)).toBe(true);

    const fr = fs.readFileSync(privacyFrPath, "utf8");
    const en = fs.readFileSync(privacyEnPath, "utf8");

    expect(fr).not.toContain("Rien n'est jamais envoyé sur nos serveurs");
    expect(en).not.toContain("Nothing is ever sent to our servers");
    expect(fr).toContain("éphémère");
    expect(en).toContain("ephemeral");
  });

  it("ensures security page subcomponents exist and do not make absolute client-only claims", () => {
    expect(fs.existsSync(securityFrPath)).toBe(true);
    expect(fs.existsSync(securityEnPath)).toBe(true);

    const fr = fs.readFileSync(securityFrPath, "utf8");
    const en = fs.readFileSync(securityEnPath, "utf8");

    expect(fr).not.toContain("Tout le traitement de fichiers s'exécute côté client uniquement");
    expect(en).not.toContain("All file processing runs client-side only");
    expect(fr).toContain("Oracle");
    expect(en).toContain("Oracle");
  });

  it("ensures main privacy.tsx and security.tsx files are under 60 lines", () => {
    const privLines = fs.readFileSync(privacyPath, "utf8").split("\n").length;
    const secLines = fs.readFileSync(securityPath, "utf8").split("\n").length;

    expect(privLines).toBeLessThan(60);
    expect(secLines).toBeLessThan(60);
  });
});
