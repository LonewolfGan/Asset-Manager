import { describe, it, expect } from "vitest";
import { generateOgSvg, renderOgPng } from "../../../src/lib/og/og-svg-template";
import type { OgCardData } from "../../../src/lib/og/og-types";

// Comprehensive unicode emoji detector including extended pictographs and regional flags
const EMOJI_REGEX = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE00}-\u{FE0F}\u{200D}]/u;

describe("OG Image SVG & PNG Generation Engine", () => {
  const toolData: OgCardData = {
    type: "tool",
    title: "Convert PDF to EPUB",
    category: "PDF ENGINE",
    description: "Convert PDF documents to responsive e-book EPUB format locally in browser.",
    inputFormat: "PDF",
    outputFormat: "EPUB",
    badges: ["ZERO CLOUD UPLOAD", "100% IN-BROWSER WEBASSEMBLY", "LOCAL MEMORY ONLY"],
    locale: "en",
  };

  const blogData: OgCardData = {
    type: "blog",
    title: "Why In-Browser PDF Processing Protects Your Sensitive Business Data",
    category: "TECHNICAL GUIDE",
    description: "An architectural deep-dive into client-side WebAssembly sandboxing vs cloud conversions.",
    readTimeMinutes: 5,
    badges: ["CLIENT-SIDE PRIVACY", "WEBASSEMBLY SANDBOX", "SECURITY AUDIT"],
    locale: "en",
  };

  it("generates an SVG with exact 1200x630 dimensions and double-bezel styling", () => {
    const svg = generateOgSvg(toolData);

    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="630"');
    expect(svg).toContain('viewBox="0 0 1200 630"');
    // Dark palette
    expect(svg).toContain('#09090b'); // Base background
    expect(svg).toContain('#121215'); // Inner bezel plate
    expect(svg).toContain('#FF6B35'); // Radix Orange brand accent
  });

  it("renders format connector chips for conversion tools", () => {
    const svg = generateOgSvg(toolData);

    expect(svg).toContain("PDF");
    expect(svg).toContain("EPUB");
    expect(svg).toContain("PDF ENGINE");
  });

  it("strictly prohibits ANY emoji characters in the generated SVG including flags and pictographs", () => {
    const toolSvg = generateOgSvg(toolData);
    const blogSvg = generateOgSvg(blogData);
    const withFlags = generateOgSvg({
      ...toolData,
      title: "Convert PDF 🇫🇷 to EPUB 🚀 with Zero Upload 🔥",
      badges: ["100% PRIVATE 🛡️", "LOCAL WEBASSEMBLY ⚡"],
    });

    expect(EMOJI_REGEX.test(toolSvg)).toBe(false);
    expect(EMOJI_REGEX.test(blogSvg)).toBe(false);
    expect(EMOJI_REGEX.test(withFlags)).toBe(false);
    expect(withFlags).not.toContain("🇫🇷");
    expect(withFlags).not.toContain("🚀");
    expect(withFlags).not.toContain("🔥");
  });

  it("adds ellipsis to titles that wrap beyond 3 lines without corrupting XML entities", () => {
    const longTitleSvg = generateOgSvg({
      ...toolData,
      title: "This is an extremely long and elaborate tool title with special & characters that will definitely span across more than three lines in our visual layout engine to verify the truncation behavior & precision",
    });

    expect(longTitleSvg).toContain("…");
    expect(longTitleSvg).not.toContain("&amp…");
  });

  it("renders blog metadata with read time and technical badges", () => {
    const svg = generateOgSvg(blogData);

    expect(svg).toContain("TECHNICAL GUIDE");
    expect(svg).toContain("5 MIN READ");
    expect(svg).toContain("WEBASSEMBLY SANDBOX");
  });

  it("compiles SVG to a valid PNG buffer using resvg", async () => {
    const svg = generateOgSvg(toolData);
    const pngBuffer = await renderOgPng(svg);

    expect(pngBuffer).toBeInstanceOf(Buffer);
    expect(pngBuffer.length).toBeGreaterThan(5000);
    // PNG signature: 0x89 0x50 0x4E 0x47
    expect(pngBuffer[0]).toBe(0x89);
    expect(pngBuffer[1]).toBe(0x50);
    expect(pngBuffer[2]).toBe(0x4e);
    expect(pngBuffer[3]).toBe(0x47);
  });
});
