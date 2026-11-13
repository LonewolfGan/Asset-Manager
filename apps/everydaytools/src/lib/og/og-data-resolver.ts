import type { OgCardData } from "./og-types";
import type { ToolSeoEntry, Locale } from "../../config/tools-seo-data";
import type { BlogPost } from "../../config/blog-data";

function inferCategory(slug: string, locale: Locale): string {
  if (slug.startsWith("pdf-")) return locale === "fr" ? "OUTIL PDF" : "PDF ENGINE";
  if (slug.startsWith("image-") || slug.startsWith("svg-") || slug.startsWith("png-") || slug.startsWith("jpg-") || slug.startsWith("webp-")) {
    return locale === "fr" ? "MOTEUR IMAGE" : "IMAGE ENGINE";
  }
  if (slug.startsWith("video-") || slug.startsWith("audio-")) {
    return locale === "fr" ? "CONVERTISSEUR MEDIA" : "MEDIA CONVERTER";
  }
  if (slug.startsWith("json-") || slug.startsWith("yaml-") || slug.startsWith("xml-") || slug.startsWith("csv-")) {
    return locale === "fr" ? "DONNEES & CODE" : "DATA & CODE";
  }
  return locale === "fr" ? "OUTIL NAVIGATEUR" : "BROWSER TOOL";
}

function inferFormats(internalSlug: string): { inputFormat?: string; outputFormat?: string } {
  const toMatch = internalSlug.match(/^([a-z0-9]+)-to-([a-z0-9]+)$/);
  if (toMatch) {
    const rawIn = toMatch[1].toUpperCase();
    const rawOut = toMatch[2].toUpperCase();
    const inFmt = rawIn === "WORD" ? "DOCX" : rawIn;
    const outFmt = rawOut === "WORD" ? "DOCX" : rawOut;
    return { inputFormat: inFmt, outputFormat: outFmt };
  }

  if (internalSlug === "pdf-compress") return { inputFormat: "RAW PDF", outputFormat: "MINIFIED" };
  if (internalSlug === "pdf-merge") return { inputFormat: "PDFS", outputFormat: "MERGED" };
  if (internalSlug === "pdf-split") return { inputFormat: "PDF", outputFormat: "PAGES" };
  if (internalSlug === "pdf-rotate") return { inputFormat: "PDF", outputFormat: "ROTATED" };
  if (internalSlug === "pdf-protect") return { inputFormat: "PDF", outputFormat: "ENCRYPTED" };
  if (internalSlug === "pdf-unlock") return { inputFormat: "PDF", outputFormat: "UNLOCKED" };

  return {};
}

export function resolveToolOgData(tool: ToolSeoEntry, locale: Locale): OgCardData {
  const { inputFormat, outputFormat } = inferFormats(tool.internalSlug);
  const category = inferCategory(tool.internalSlug, locale);

  const badges = locale === "fr"
    ? ["ZERO ENVOI SERVEUR", "WEBASSEMBLY LOCAL", "100% CONFIDENTIEL"]
    : ["ZERO CLOUD UPLOAD", "LOCAL WEBASSEMBLY", "100% PRIVATE"];

  return {
    type: "tool",
    title: tool.h1[locale] || tool.title[locale].split("—")[0].trim(),
    category,
    description: tool.description[locale],
    inputFormat,
    outputFormat,
    badges,
    locale,
  };
}

export function resolveBlogOgData(post: BlogPost, locale: Locale): OgCardData {
  const category = post.category ? post.category.toUpperCase() : (locale === "fr" ? "GUIDE TECHNIQUE" : "TECHNICAL GUIDE");
  const badges = locale === "fr"
    ? ["SECURITE & VIE PRIVEE", "TRAITEMENT CLIENT-SIDE", "INGENIERIE OPEN SOURCE"]
    : ["SECURITY & PRIVACY", "CLIENT-SIDE ARCHITECTURE", "OPEN ENGINEERING"];

  return {
    type: "blog",
    title: post.title[locale],
    category,
    description: post.description[locale],
    readTimeMinutes: post.readingMinutes || 5,
    badges,
    locale,
  };
}

export function resolveHomeOgData(locale: Locale): OgCardData {
  const title = locale === "fr"
    ? "EverydayTools Hub — Outils Documents et Médias 100% Privés dans votre Navigateur"
    : "EverydayTools Hub — Private, In-Browser Developer and Document Utilities";
  const category = "PLATFORM HUB";
  const badges = locale === "fr"
    ? ["85+ OUTILS LOCAUX", "ZERO STOCKAGE CLOUD", "GRATUIT ET SANS COMPTE"]
    : ["85+ LOCAL TOOLS", "ZERO CLOUD RETENTION", "FREE & NO SIGNUP"];

  return {
    type: "home",
    title,
    category,
    badges,
    locale,
  };
}
