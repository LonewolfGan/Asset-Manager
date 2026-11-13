import { describe, it, expect } from "vitest";
import { resolveToolOgData, resolveBlogOgData, resolveHomeOgData } from "../../../src/lib/og/og-data-resolver";
import type { ToolSeoEntry } from "../../../src/config/tools-seo-data";
import type { BlogPost } from "../../../src/config/blog-data";

const EMOJI_REGEX = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE00}-\u{FE0F}\u{200D}]/u;

describe("OG Data Resolver", () => {
  const mockTool: ToolSeoEntry = {
    internalSlug: "pdf-to-epub",
    slugs: { en: "convert-pdf-to-epub", fr: "convertir-pdf-en-epub" },
    title: {
      en: "PDF to EPUB Converter — Free, Fast, Client-Side",
      fr: "Convertir PDF en EPUB — Gratuit, Rapide, Sans Serveur",
    },
    h1: { en: "PDF to EPUB Converter", fr: "Convertisseur PDF en EPUB" },
    description: {
      en: "Convert PDF to EPUB easily in browser.",
      fr: "Convertissez vos PDF en EPUB directement dans votre navigateur.",
    },
    keywords: { en: ["pdf to epub"], fr: ["pdf en epub"] },
    relatedTools: [],
    howItWorks: { en: [], fr: [] },
    about: { en: "About en", fr: "About fr" },
    faqs: { en: [], fr: [] },
  };

  const mockBlog: BlogPost = {
    slug: { en: "client-side-privacy-benefits", fr: "avantages-confidentialite-locale" },
    title: {
      en: "Why Client-Side Processing Guarantees Real Data Privacy",
      fr: "Pourquoi le traitement local garantit une vraie confidentialité",
    },
    description: {
      en: "A technical comparison between server-side SaaS converters and local WASM tools.",
      fr: "Comparaison technique entre convertisseurs SaaS et outils WASM locaux.",
    },
    keywords: { en: ["privacy"], fr: ["confidentialité"] },
    publishedAt: "2026-11-01",
    category: "Security",
    readingMinutes: 6,
    content: { en: "English content", fr: "Contenu français" },
  };

  it("resolves tool OG data with inferred input and output formats without emojis", () => {
    const enData = resolveToolOgData(mockTool, "en");
    expect(enData.type).toBe("tool");
    expect(enData.title).toBe("PDF to EPUB Converter");
    expect(enData.inputFormat).toBe("PDF");
    expect(enData.outputFormat).toBe("EPUB");
    expect(enData.category).toContain("PDF");
    expect(enData.badges.length).toBeGreaterThanOrEqual(2);
    expect(EMOJI_REGEX.test(JSON.stringify(enData))).toBe(false);

    const frData = resolveToolOgData(mockTool, "fr");
    expect(frData.title).toBe("Convertisseur PDF en EPUB");
    expect(EMOJI_REGEX.test(JSON.stringify(frData))).toBe(false);
  });

  it("resolves blog OG data with reading time and zero emojis", () => {
    const blogOg = resolveBlogOgData(mockBlog, "en");
    expect(blogOg.type).toBe("blog");
    expect(blogOg.title).toBe(mockBlog.title.en);
    expect(blogOg.readTimeMinutes).toBe(6);
    expect(blogOg.badges.length).toBeGreaterThanOrEqual(2);
    expect(EMOJI_REGEX.test(JSON.stringify(blogOg))).toBe(false);
  });

  it("resolves home page OG data with zero emojis", () => {
    const homeEn = resolveHomeOgData("en");
    expect(homeEn.type).toBe("home");
    expect(homeEn.title).toContain("EverydayTools");
    expect(EMOJI_REGEX.test(JSON.stringify(homeEn))).toBe(false);

    const homeFr = resolveHomeOgData("fr");
    expect(homeFr.type).toBe("home");
    expect(EMOJI_REGEX.test(JSON.stringify(homeFr))).toBe(false);
  });
});
