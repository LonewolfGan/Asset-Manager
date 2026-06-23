import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { tools } from "@/config/tools.config";
import { useLocale } from "@/hooks/use-locale";
import { useIsMobile } from "@/hooks/use-mobile";
import type { LucideIcon } from "lucide-react";
import {
  Bookmark, BookmarkCheck,
  FileText, FileType2, Table2, MonitorPlay, ImageIcon, Code2, ShieldCheck, Calculator,
} from "lucide-react";

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "EverydayTools Hub",
  url: "https://everydaytools.qzz.io",
  description:
    "Free browser-based tools — convert PDF, images, documents. Generate passwords, calculate units and currencies. No signup. Files stay in your browser.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://everydaytools.qzz.io/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EverydayTools Hub",
  url: "https://everydaytools.qzz.io",
  logo: "https://everydaytools.qzz.io/favicon.svg",
  sameAs: [],
};

const ITEM_LIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Online Tools",
  description: "A collection of free browser-based utility tools for documents, images, and everyday tasks.",
  url: "https://everydaytools.qzz.io",
  numberOfItems: 34,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "PDF to Word Converter", url: "https://everydaytools.qzz.io/en/convert-pdf-to-word" },
    { "@type": "ListItem", position: 2, name: "Image Converter", url: "https://everydaytools.qzz.io/en/convert-images" },
    { "@type": "ListItem", position: 3, name: "AI Background Remover", url: "https://everydaytools.qzz.io/en/remove-background" },
    { "@type": "ListItem", position: 4, name: "Password Generator", url: "https://everydaytools.qzz.io/en/generate-password" },
    { "@type": "ListItem", position: 5, name: "Currency Converter", url: "https://everydaytools.qzz.io/en/currency-converter" },
  ],
};

/* ── Category config ─────────────────────────────────────────────────────── */
interface CategoryDef {
  key: string;
  label: string;
  labelFr: string;
  color: string;
  bg: string;
  border: string;
  FilterIcon: LucideIcon;
}

const CATEGORIES: CategoryDef[] = [
  { key: "pdf",         label: "PDF Tools",        labelFr: "Outils PDF",         color: "#DC2626", bg: "rgba(220,38,38,0.09)",   border: "rgba(220,38,38,0.35)",  FilterIcon: FileText },
  { key: "word",        label: "Documents",         labelFr: "Documents",          color: "#1A6BFF", bg: "rgba(26,107,255,0.09)",  border: "rgba(26,107,255,0.35)", FilterIcon: FileType2 },
  { key: "excel",       label: "Spreadsheets",      labelFr: "Tableurs",           color: "#16A34A", bg: "rgba(22,163,74,0.09)",   border: "rgba(22,163,74,0.35)",  FilterIcon: Table2 },
  { key: "pptx",        label: "Presentations",     labelFr: "Présentations",      color: "#EA580C", bg: "rgba(234,88,12,0.09)",   border: "rgba(234,88,12,0.35)",  FilterIcon: MonitorPlay },
  { key: "image",       label: "Images",            labelFr: "Images",             color: "#0D9488", bg: "rgba(13,148,136,0.09)",  border: "rgba(13,148,136,0.35)", FilterIcon: ImageIcon },
  { key: "textCode",    label: "Text & Code",       labelFr: "Texte & Code",       color: "#7C3AED", bg: "rgba(124,58,237,0.09)",  border: "rgba(124,58,237,0.35)", FilterIcon: Code2 },
  { key: "privacy",     label: "Privacy",           labelFr: "Confidentialité",    color: "#0E7490", bg: "rgba(14,116,144,0.09)",  border: "rgba(14,116,144,0.35)", FilterIcon: ShieldCheck },
  { key: "calculators", label: "Calculators",       labelFr: "Calculatrices",      color: "#9333EA", bg: "rgba(147,51,234,0.09)",  border: "rgba(147,51,234,0.35)", FilterIcon: Calculator },
];

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

const BADGE_SLUGS = new Set(["background-remover", "ai-text-scrubber"]);

/* ── Humanized descriptions ───────────────────────────────────────────────── */
const HUMAN_DESC: Record<string, string> = {
  // PDF Tools
  "pdf-to-word": "Converts any PDF to an editable Word document. Keeps text, headings, and basic layout intact. Good for contracts, reports, and anything you'd otherwise copy by hand.",
  "pdf-to-text": "Pulls raw text out of any PDF. No columns, no formatting, just the words. Save as .txt or paste directly into anything.",
  "pdf-to-html": "Converts your PDF to proper HTML with real headings and paragraphs. Ready to drop into a CMS or webpage without cleanup.",
  "pdf-to-epub": "Turns any PDF into an EPUB that reflows text on phones and e-readers. Makes long documents comfortable to read on a small screen.",
  "pdf-compress": "Shrinks PDF file sizes without visible quality loss. Useful when a file is too large to email or exceeds an upload limit.",
  "pdf-merge": "Combines multiple PDFs into one file. Drag to set the order, merge, and download in a single click.",
  "pdf-split": "Pulls out specific pages or cuts a large PDF into smaller chunks. No need to send 40 pages when someone only needs a few.",
  "pdf-rotate": "Fixes sideways or upside-down pages from a scanner or camera. Rotate one page or all at once.",
  "pdf-unlock": "Strips the password restriction from a PDF once you have the current one. Lets you open, print, or copy from it normally.",
  "pdf-protect": "Adds a password to any PDF. Useful for sensitive files before emailing, or anything you want stored with a lock on it.",
  "pdf-page-numbers": "Stamps page numbers onto every page. Choose the position, font size, and which number to start from.",
  "pdf-watermark": "Adds a text watermark across your PDF pages. Control the text, opacity, and angle. Good for DRAFT or CONFIDENTIAL markings.",
  "pdf-to-image": "Exports each PDF page as a PNG or JPEG. Useful for sharing a page as a screenshot or embedding it in a presentation.",
  "pdf-to-excel": "Finds tables in your PDF and puts them into editable spreadsheet cells. Works best on PDFs with clean, structured tables.",
  "reorder-pdf": "Drag pages into any order, remove the ones you don't need, then download. Helpful after scanning a stack in the wrong sequence.",
  "ocr": "Reads text from scanned pages, photos, and screenshots. Turns a picture of a page into selectable, copyable text. Runs on your device.",

  // Word & Docs
  "word-to-pdf": "Converts Word documents to PDF, keeping fonts, tables, and spacing as they are. More reliable than printing to PDF from Word.",
  "word-to-text": "Strips all styles and tracked changes from a DOCX. Leaves raw text clean enough to paste anywhere without hidden formatting.",
  "word-to-html": "Converts Word documents to clean HTML without Microsoft's bloat. Proper headings, paragraphs, and lists. Ready for a CMS.",
  "word-to-epub": "Turns a Word document into an EPUB for Kindle, Kobo, or any reading app. Text reflows to fit the screen properly.",
  "word-to-markdown": "Converts Word documents to Markdown. Headings, bold, italic, and lists carry over. Good for GitHub, Hugo, or Notion.",
  "html-to-markdown": "Strips HTML down to clean Markdown. Good for migrating web content or cleaning up rich text editor output.",
  "markdown-to-pdf": "Renders Markdown into a properly formatted PDF with real headings and code blocks. Easier than fighting with styles in a word processor.",
  "markdown-to-docx": "Converts Markdown files into Word documents. Headings become proper styles, bold stays bold, lists stay lists.",
  "html-to-pdf": "Renders HTML into a PDF with styles intact. Useful for archiving web content or generating reports from HTML templates.",
  "txt-to-pdf": "Wraps plain text in a clean PDF with proper margins. Good for sharing notes or logs that need to look presentable.",
  "txt-to-docx": "Converts plain text into a Word document you can format and share. Fastest path from a text editor to a proper DOCX.",

  // Excel & Spreadsheets
  "excel-to-pdf": "Converts Excel spreadsheets to PDF, keeping tables, charts, and formatting as they appear. Good for sharing data that shouldn't be edited.",
  "excel-to-csv": "Exports any Excel sheet as a plain CSV any tool or database can read. Strips the Excel-specific parts and leaves just the data.",
  "csv-to-excel": "Converts CSV files into formatted Excel spreadsheets. Skips the manual import wizard entirely.",
  "csv-to-json": "Converts CSV to JSON, or JSON back to CSV. Useful when moving data between tools that expect different formats.",
  "csv-viewer": "Opens any CSV in a clean, sortable table. No spreadsheet app needed.",

  // PowerPoint
  "pptx-to-pdf": "Converts PowerPoint presentations to PDF so anyone can view them without PowerPoint. Fonts, layouts, and images come through intact.",
  "pptx-to-images": "Exports every slide as a separate PNG and packages them in a ZIP. Handy for using slides in design tools or sharing as images.",
  "pdf-to-pptx": "Turns PDF pages into editable PowerPoint slides. Each page becomes a slide with content you can move and edit.",

  // Image Tools
  "image-converter": "Converts images between PNG, JPEG, WebP, AVIF, BMP, GIF, TIFF, ICO, and SVG. Batch convert up to 20 files and download as a ZIP.",
  "heic-to-jpg": "Converts iPhone HEIC photos to JPEG so they open anywhere that doesn't support Apple's format. Drag in multiple files at once.",
  "heic-to-png": "Converts HEIC photos to PNG for lossless quality and wide compatibility.",
  "heic-to-webp": "Converts HEIC photos to WebP, giving smaller files that work in all modern browsers.",
  "heic-to-pdf": "Combines one or more HEIC photos into a single PDF. Good for sharing iPhone photos in a format anyone can open.",
  "image-compress": "Reduces image file sizes without obvious quality loss. Useful for uploads with size limits or sending photos by email.",
  "image-resize": "Resizes images to a specific pixel size or scales by percentage. Lock the aspect ratio to avoid distortion.",
  "image-crop": "Crops images using drag handles in the browser. Use preset ratios like 1:1 or 16:9, or set a custom crop area.",
  "image-to-pdf": "Combines one or more images into a single PDF. Good for sending a batch of photos as one tidy attachment.",
  "background-remover": "Removes backgrounds from photos using AI that runs on your device. Works on portraits, product shots, and most images with a clear subject.",
  "flip-rotate-image": "Flips images horizontally or vertically, or rotates by any angle. Fixes photos that came out sideways from a camera or scan.",
  "watermark-image": "Stamps photos with a custom text watermark. Set the text, position, opacity, and size.",
  "favicon-generator": "Generates favicons in all standard sizes from any image. Downloads as a ZIP with every size browsers and devices expect.",
  "png-to-webp": "Converts PNG images to WebP for smaller file sizes with the same visual quality.",
  "jpg-to-webp": "Converts JPEGs to WebP for better compression at similar quality. Useful for cutting web page load times.",
  "gif-to-webp": "Converts GIFs to WebP, which supports animation and gives much smaller files.",
  "bmp-to-webp": "Converts large BMP files to WebP for practical use on the web.",
  "tiff-to-webp": "Converts TIFF images to WebP for web-friendly file sizes.",
  "webp-to-png": "Converts WebP back to PNG for older tools and apps that don't support WebP yet.",
  "webp-to-jpg": "Converts WebP to JPEG for maximum compatibility with apps, printers, and older systems.",
  "webp-to-pdf": "Combines WebP images into a PDF document for easy sharing or archiving.",
  "webp-to-avif": "Converts WebP to AVIF for even smaller file sizes at equivalent visual quality.",
  "jpg-to-avif": "Converts JPEG photos to AVIF for noticeably smaller files without visible quality loss.",
  "png-to-avif": "Converts PNG to AVIF, which handles both lossy and lossless compression and often beats WebP on file size.",
  "avif-to-jpg": "Converts AVIF to JPEG when you need something that works everywhere.",
  "avif-to-png": "Converts AVIF to PNG for full compatibility with tools that don't yet support AVIF.",
  "jpg-to-png": "Converts JPEG to PNG for lossless quality and transparency support.",
  "png-to-jpg": "Converts PNG to JPEG for smaller file sizes. Drops transparency, but fine for photos that don't need it.",
  "png-to-svg": "Wraps a PNG inside an SVG container. Useful when a platform requires SVG but you're starting with a raster image.",
  "svg-to-png": "Renders SVG vector graphics to a PNG at the pixel size you set. Good for icons and illustrations where SVG isn't accepted.",
  "gif-to-png": "Extracts the first frame of a GIF as a still PNG. Useful for a thumbnail or preview from an animated GIF.",
  "bmp-to-jpg": "Converts BMP files to JPEG to bring file sizes down to something reasonable for sharing.",
  "tiff-to-jpg": "Converts TIFF to JPEG, reducing file size for sharing online or by email.",
  "tiff-to-png": "Converts TIFF images to PNG for broad compatibility without quality loss.",
  "jpg-to-pdf": "Converts JPEG images into a PDF. Combine multiple photos into one tidy file.",
  "png-to-pdf": "Converts PNG images into a PDF, individually or merged. Image quality is preserved.",

  // Privacy
  "metadata-cleaner": "Strips hidden metadata from images and documents: GPS location, camera model, creation date, author name. Worth doing before sharing photos publicly.",
  "ai-text-scrubber": "Removes invisible Unicode characters and statistical patterns that AI-detection tools flag. Paste your text in and get back something that reads naturally.",
  "checksum": "Generates and verifies SHA-1, SHA-256, and SHA-512 checksums for any file. Paste an expected hash to confirm a download hasn't been tampered with.",

  // Text & Code
  "json-formatter": "Formats messy JSON into something readable, or minifies it for production. Validates the structure and shows errors clearly.",
  "html-formatter": "Formats compressed HTML into clean, indented markup, or minifies it for deployment.",
  "base64": "Encodes text or files to Base64 and decodes Base64 strings back. Useful for data URIs, CSS-embedded images, or debugging API payloads.",
  "url-encoder": "Encodes special characters in URLs so they work in links and query strings. Decodes them back to readable text.",
  "word-counter": "Counts words, characters, sentences, and paragraphs. Estimates reading time. Good for checking against article or essay word limits.",
  "lorem-ipsum": "Generates placeholder text for mockups and design prototypes. Paragraphs, sentences, or words in any quantity.",

  // Calculators
  "password-generator": "Generates strong passwords using your browser's cryptographic random generator. Shows the entropy score updating as you adjust length and character sets.",
  "percentage-calc": "Handles the three percentage calculations people always trip on: X% of Y, what percentage is X of Y, and the change between two numbers.",
  "unit-converter": "Converts between units across 13 categories: length, weight, temperature, pressure, speed, data, and more.",
  "currency-converter": "Converts between currencies using live exchange rates that update every hour. Falls back to static rates when the network is unavailable.",
  "qr-code-generator": "Generates QR codes for URLs, plain text, Wi-Fi credentials, or contact cards. Download as a PNG at any size.",
  "tip-calculator": "Calculates the tip and splits the total across any number of people. Enter the bill, pick a percentage, set how many are sharing.",
};

interface DashTool {
  slug: string;
  name: string;
  description: string;
  categoryKey: string;
  Icon: LucideIcon;
  badge?: string;
  route: string;
}

const DASH_TOOLS: DashTool[] = tools.map((t) => ({
  slug: t.slug,
  name: t.title,
  description: HUMAN_DESC[t.slug] ?? t.description,
  categoryKey: t.category,
  Icon: t.icon as LucideIcon,
  badge: BADGE_SLUGS.has(t.slug) ? "AI" : undefined,
  route: `/${t.slug}`,
}));


/* ── Hero Section ──────────────────────────────────────────────────────────── */
function ToolCard({
  tool,
  cat,
  isPinned,
  onTogglePin,
}: {
  tool: DashTool;
  cat: CategoryDef;
  isPinned?: boolean;
  onTogglePin?: () => void;
}) {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const { Icon } = tool;
  const tl = t.tools[tool.slug];
  const name = tl?.title ?? tool.name;
  const description = tl?.description ?? tool.description;

  return (
    <Link href={tool.route} style={{ textDecoration: "none", display: "block" }}>
      <article
        data-testid="tool-card"
        style={{
          position: "relative",
          padding: "20px 18px",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--border)",
          background: "var(--bg-surface)",
          cursor: "pointer",
          overflow: "hidden",
          transition: "border-color 150ms ease, box-shadow 150ms ease",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0,
          textAlign: "left",
          aspectRatio: isMobile ? undefined : "1 / 1",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = cat.border;
          el.style.boxShadow = `0 4px 16px rgba(0,0,0,0.07)`;
          const tint = el.querySelector<HTMLElement>(".card-tint");
          if (tint) tint.style.opacity = "1";
          const pin = el.querySelector<HTMLElement>(".card-pin");
          if (pin && !isPinned) pin.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border)";
          el.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
          const tint = el.querySelector<HTMLElement>(".card-tint");
          if (tint) tint.style.opacity = "0";
          const pin = el.querySelector<HTMLElement>(".card-pin");
          if (pin && !isPinned) pin.style.opacity = "0";
        }}
      >
        {/* Hover tint overlay */}
        <div
          className="card-tint"
          style={{
            position: "absolute",
            inset: 0,
            background: cat.bg,
            opacity: 0,
            transition: "opacity 150ms ease",
            pointerEvents: "none",
          }}
        />

        {/* Pin button */}
        {onTogglePin !== undefined && (
          <button
            className="card-pin"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePin(); }}
            aria-label={isPinned ? "Unpin tool" : "Pin tool"}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "none",
              border: "none",
              padding: "3px 2px",
              cursor: "pointer",
              color: isPinned ? cat.color : "var(--text-tertiary)",
              opacity: isPinned ? 1 : 0,
              transition: "opacity 150ms ease, color 150ms ease",
              display: "flex",
              alignItems: "center",
              borderRadius: 4,
              lineHeight: 0,
              flexShrink: 0,
              zIndex: 2,
            }}
          >
            {isPinned
              ? <BookmarkCheck size={15} strokeWidth={2} />
              : <Bookmark size={15} strokeWidth={1.8} />}
          </button>
        )}

        {/* Icon — top-left */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: cat.bg,
          color: cat.color,
          flexShrink: 0,
          position: "relative",
          marginBottom: 12,
        }}>
          <Icon size={20} strokeWidth={1.6} />
        </div>

        {/* Name + badge + description — left-aligned */}
        <div style={{ position: "relative", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, flexWrap: "wrap" }}>
            <span style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              fontFamily: "var(--font-ui)",
              lineHeight: 1.25,
            }}>
              {name}
            </span>
            {tool.badge && (
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 4,
                background: cat.bg,
                color: cat.color,
                lineHeight: 1.4,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}>
                {tool.badge}
              </span>
            )}
          </div>
          <p style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            margin: 0,
            fontFamily: "var(--font-ui)",
          }}>
            {description}
          </p>
        </div>
      </article>
    </Link>
  );
}

/* ── Hero Section ──────────────────────────────────────────────────────────── */
/* Clean, light-themed hero — iLovePDF-inspired minimal design */

const HERO_TAGS = [
  { label: "CSV ↔ JSON", route: "/csv-to-json" },
  { label: "Markdown to PDF", route: "/markdown-to-pdf" },
  { label: "HTML to PDF", route: "/html-to-pdf" },
  { label: "Word to PDF", route: "/word-to-pdf" },
  { label: "PDF to Text", route: "/pdf-to-text" },
  { label: "Excel to PDF", route: "/excel-to-pdf" },
  { label: "Image to PDF", route: "/image-to-pdf" },
  { label: "Word to Markdown", route: "/word-to-markdown" },
  { label: "PDF to Word", route: "/pdf-to-word" },
  { label: "PDF to EPUB", route: "/pdf-to-epub" },
  { label: "PDF to HTML", route: "/pdf-to-html" },
  { label: "HTML to Markdown", route: "/html-to-markdown" },
  { label: "TXT to PDF", route: "/txt-to-pdf" },
  { label: "TXT to DOCX", route: "/txt-to-docx" },
  { label: "Word to HTML", route: "/word-to-html" },
  { label: "Word to EPUB", route: "/word-to-epub" },
];

function HomeHero() {
  const { t, locale } = useLocale();
  const isFR = locale.toLowerCase().startsWith("fr");

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
        paddingTop: "clamp(52px, 7vw, 80px)",
        paddingBottom: "clamp(40px, 5vw, 56px)",
        background: "var(--hero-bg)",
      }}
    >
      <style>{`
        @keyframes hero-fade-in-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes et-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes et-scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .hero-title  { animation: hero-fade-in-up 0.45s ease both; }
        .hero-sub    { animation: hero-fade-in-up 0.45s ease 0.08s both; }
        .hero-scroll { animation: hero-fade-in-up 0.45s ease 0.18s both; }
        .hero-pill:hover { background: var(--hero-tag-hover) !important; }
      `}</style>

      {/* Title block — constrained, centered */}
      <div style={{ margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <h1 className="hero-title" style={{ margin: 0, lineHeight: 1, userSelect: "none" }}>
          {/* EVERYDAY — ghost line, measured at ~10.5vw in reference */}
          <span
            aria-hidden="true"
            style={{
              display: "block",
              fontFamily: "var(--font-hero)",
              fontSize: "clamp(44px, 10.5vw, 124px)",
              fontWeight: 450,
              color: "var(--hero-watermark)",
              letterSpacing: "0.12em",
              lineHeight: 1.05,
              textTransform: "uppercase",
            }}
          >
            EVERYDAY
          </span>

          {/* Tools — dominant, measured at ~15vw in reference */}
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-hero)",
              fontSize: "clamp(72px, 15vw, 178px)",
              fontWeight: 900,
              color: "var(--hero-title)",
              letterSpacing: "-0.02em",
              lineHeight: 0.88,
            }}
          >
            {isFR ? "Outils" : "Tools"}
          </span>
        </h1>

        {/* Subtitle — wider, centered, matches reference paragraph width */}
        <p
          className="hero-sub"
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "clamp(13px, 1.1vw, 15px)",
            color: "var(--hero-subtitle)",
            margin: "22px auto 0",
            lineHeight: 1.7,
            maxWidth: 640,
          }}
        >
          {isFR
            ? "Votre navigateur amélioré. Plus de 86 outils gratuits pour vos tâches quotidiennes. Convertissez des PDF, éditez des images, formatez du code, le tout sans quitter votre navigateur. Pas d'inscription, pas de téléchargement."
            : "Your browser, upgraded. 86+ free tools for everyday tasks. Convert PDFs, edit images, format code, crunch numbers, all without leaving your browser. No sign-up, no uploads."}
        </p>
      </div>

      {/* Infinite scroll pills — 90% width, centered, with edge fade */}
      <div
        className="hero-scroll"
        style={{
          marginTop: 48,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "90%",
          margin: "48px auto 0",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          overflow: "hidden",
        }}
      >
        {/* Row 1 — scrolls left */}
        <div style={{ overflow: "hidden", width: "100%" }}>
          <div style={{ display: "flex", gap: 8, width: "fit-content", animation: "et-scroll-left 36s linear infinite" }}>
            {[...HERO_TAGS, ...HERO_TAGS].map((tag, i) => (
              <Link key={`r1-${i}`} href={tag.route} style={{ textDecoration: "none", flexShrink: 0 }}>
                <span
                  className="hero-pill"
                  style={{
                    display: "inline-block",
                    padding: "9px 20px",
                    borderRadius: 100,
                    background: "var(--hero-tag-bg)",
                    color: "var(--hero-tag-text)",
                    fontFamily: "var(--font-ui)",
                    fontSize: "12px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    lineHeight: 1.4,
                    transition: "background 150ms ease",
                  }}
                >
                  {tag.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div style={{ overflow: "hidden", width: "100%" }}>
          <div style={{ display: "flex", gap: 8, width: "fit-content", animation: "et-scroll-right 42s linear infinite" }}>
            {[...HERO_TAGS, ...HERO_TAGS].map((tag, i) => (
              <Link key={`r2-${i}`} href={tag.route} style={{ textDecoration: "none", flexShrink: 0 }}>
                <span
                  className="hero-pill"
                  style={{
                    display: "inline-block",
                    padding: "9px 20px",
                    borderRadius: 100,
                    background: "var(--hero-tag-bg)",
                    color: "var(--hero-tag-text)",
                    fontFamily: "var(--font-ui)",
                    fontSize: "12px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    lineHeight: 1.4,
                    transition: "background 150ms ease",
                  }}
                >
                  {tag.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Category Filter Bar ──────────────────────────────────────────────────── */
function CategoryFilterBar({
  categories,
  activeKey,
  isMobile,
  onSelect,
}: {
  categories: CategoryDef[];
  activeKey: string | null;
  isMobile: boolean;
  onSelect: (key: string | null) => void;
}) {
  const { locale } = useLocale();

  const allLabel = locale.toLowerCase().startsWith("fr") ? "Tous" : "All";
  const isAllActive = activeKey === null;

  if (isMobile) return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      flexWrap: "wrap",
      marginBottom: 36,
    }}>
      {/* All pill */}
      <button
        onClick={() => onSelect(null)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "6px 13px",
          borderRadius: 100,
          border: `1px solid ${isAllActive ? "var(--text-primary)" : "var(--border)"}`,
          background: isAllActive ? "var(--text-primary)" : "var(--bg-surface)",
          color: isAllActive ? "var(--bg-base)" : "var(--text-secondary)",
          fontFamily: "var(--font-ui)",
          fontSize: "12px",
          fontWeight: isAllActive ? 600 : 500,
          cursor: "pointer",
          transition: "all 120ms ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!isAllActive) {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--text-primary)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isAllActive) {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          }
        }}
      >
        {allLabel}
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 16, background: "var(--border)", flexShrink: 0, marginRight: 2 }} />

      {categories.map((cat) => {
        const label = locale.toLowerCase().startsWith("fr") ? cat.labelFr : cat.label;
        const isActive = activeKey === cat.key;
        const { FilterIcon } = cat;
        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 13px",
              borderRadius: 100,
              border: `1px solid ${isActive ? cat.border : "var(--border)"}`,
              background: isActive ? cat.bg : "var(--bg-surface)",
              color: isActive ? cat.color : "var(--text-secondary)",
              fontFamily: "var(--font-ui)",
              fontSize: "12px",
              fontWeight: isActive ? 600 : 500,
              cursor: "pointer",
              transition: "all 120ms ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.borderColor = cat.border;
                (e.currentTarget as HTMLElement).style.color = cat.color;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }
            }}
          >
            <FilterIcon size={13} strokeWidth={1.8} style={{ flexShrink: 0 }} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Category Section ─────────────────────────────────────────────────────── */
function CategorySection({
  cat,
  tools,
  isMobile,
  pinnedSlugs,
  onTogglePin,
}: {
  cat: CategoryDef;
  tools: DashTool[];
  isMobile: boolean;
  pinnedSlugs: string[];
  onTogglePin: (slug: string) => void;
}) {
  const { locale } = useLocale();
  const label = locale.toLowerCase().startsWith("fr") ? cat.labelFr : cat.label;

  return (
    <section id={`cat-${cat.key}`} style={{ marginBottom: 40 }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "repeat(2, 1fr)"
          : "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}>
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            cat={cat}
            isPinned={pinnedSlugs.includes(tool.slug)}
            onTogglePin={() => onTogglePin(tool.slug)}
          />
        ))}
      </div>
    </section>
  );
}

/* ── Dashboard Home ──────────────────────────────────────────────────────── */
export default function DashboardHome() {
  const { t, locale } = useLocale();
  const isMobile = useIsMobile();
  const [query, setQuery] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      setQuery((e as CustomEvent<string>).detail ?? "");
    };
    window.addEventListener("et:search", handler);
    return () => window.removeEventListener("et:search", handler);
  }, []);

  const [pinnedSlugs, setPinnedSlugs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('et:pinned') ?? '[]'); } catch { return []; }
  });
  useEffect(() => {
    const onPinned = () => {
      try { setPinnedSlugs(JSON.parse(localStorage.getItem('et:pinned') ?? '[]')); } catch { setPinnedSlugs([]); }
    };
    window.addEventListener('et:pinned', onPinned);
    return () => window.removeEventListener('et:pinned', onPinned);
  }, []);

  const pinnedTools = useMemo(
    () => pinnedSlugs.map(s => DASH_TOOLS.find(t => t.slug === s)).filter((t): t is DashTool => t !== undefined),
    [pinnedSlugs]
  );

  const togglePin = useCallback((slug: string) => {
    try {
      const prev: string[] = JSON.parse(localStorage.getItem('et:pinned') ?? '[]');
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [slug, ...prev];
      localStorage.setItem('et:pinned', JSON.stringify(next));
      window.dispatchEvent(new Event('et:pinned'));
    } catch {}
  }, []);

  const filteredTools = useMemo(() => {
    if (!query.trim()) return DASH_TOOLS;
    const q = query.toLowerCase();
    return DASH_TOOLS.filter((tool) =>
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q)
    );
  }, [query]);

  const isSearching = query.trim().length > 0;

  // Group tools by category, preserving CATEGORIES order
  const groupedTools = useMemo(() => {
    const map = new Map<string, DashTool[]>();
    for (const tool of filteredTools) {
      if (!map.has(tool.categoryKey)) map.set(tool.categoryKey, []);
      map.get(tool.categoryKey)!.push(tool);
    }
    return CATEGORIES
      .map(cat => ({ cat, tools: map.get(cat.key) ?? [] }))
      .filter(g => g.tools.length > 0);
  }, [filteredTools]);

  return (
    <>
      <Helmet>
        <link rel="canonical" href={`https://everydaytools.qzz.io/${locale.toLowerCase()}`} />
        <link rel="alternate" hrefLang="en" href="https://everydaytools.qzz.io/en" />
        <link rel="alternate" hrefLang="fr" href="https://everydaytools.qzz.io/fr" />
        <link rel="alternate" hrefLang="x-default" href="https://everydaytools.qzz.io/en" />
        <script type="application/ld+json">{JSON.stringify(WEBSITE_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(ORGANIZATION_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(ITEM_LIST_SCHEMA)}</script>
      </Helmet>

      <div style={{ flex: 1, background: "var(--bg-base)" }}>

        {/* Hero section — full width */}
        {!isSearching && (
          <HomeHero />
        )}

        {/* Tools area — full width with side padding */}
        <div style={{ padding: "40px 24px 80px" }}>


          {/* Category filter bar */}
          {!isSearching && (
            <CategoryFilterBar
              categories={CATEGORIES}
              activeKey={activeKey}
              isMobile={isMobile}
              onSelect={(key) => {
                setActiveKey(key);
                if (key !== null) {
                  const el = document.getElementById(`cat-${key}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            />
          )}

          {/* Pinned */}
          {!isSearching && pinnedTools.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, borderRadius: 2, background: "var(--accent)", flexShrink: 0 }} />
                <p style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  margin: 0,
                  fontFamily: "var(--font-ui)",
                }}>
                  {t.home.pinned}
                </p>
                <span style={{ fontSize: "11px", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                  {pinnedTools.length}
                </span>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}>
                {pinnedTools.map((tool) => {
                  const cat = CATEGORY_MAP[tool.categoryKey] ?? CATEGORIES[0];
                  return (
                    <ToolCard
                      key={tool.slug}
                      tool={tool}
                      cat={cat}
                      isPinned={true}
                      onTogglePin={() => togglePin(tool.slug)}
                    />
                  );
                })}
              </div>
              <div style={{ marginTop: 36, borderTop: "1px solid var(--border)" }} />
            </div>
          )}

          {/* Search results */}
          {isSearching && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", margin: 0, fontFamily: "var(--font-ui)" }}>
                {t.home.resultCount(filteredTools.length)} {t.home.resultsFor} &ldquo;<strong style={{ color: "var(--text-primary)" }}>{query}</strong>&rdquo;
              </p>
            </div>
          )}

          {/* No results */}
          {filteredTools.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-secondary)", margin: "0 0 12px", fontFamily: "var(--font-ui)" }}>
                {t.home.noResults(query)}
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  window.dispatchEvent(new CustomEvent("et:search", { detail: "" }));
                }}
                style={{ fontSize: "var(--text-sm)", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", padding: 0 }}
              >
                {t.home.clearSearch}
              </button>
            </div>
          )}

          {/* Flat search grid */}
          {isSearching && filteredTools.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}>
              {filteredTools.map((tool) => {
                const cat = CATEGORY_MAP[tool.categoryKey] ?? CATEGORIES[0];
                return (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    cat={cat}
                    isPinned={pinnedSlugs.includes(tool.slug)}
                    onTogglePin={() => togglePin(tool.slug)}
                  />
                );
              })}
            </div>
          )}

          {/* All tools flat grid (no category sections) */}
          {!isSearching && activeKey === null && (
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}>
              {DASH_TOOLS.map((tool) => {
                const cat = CATEGORY_MAP[tool.categoryKey] ?? CATEGORIES[0];
                return (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    cat={cat}
                    isPinned={pinnedSlugs.includes(tool.slug)}
                    onTogglePin={() => togglePin(tool.slug)}
                  />
                );
              })}
            </div>
          )}

          {/* Single category section */}
          {!isSearching && activeKey !== null && groupedTools
            .filter(g => g.cat.key === activeKey)
            .map(({ cat, tools }) => (
              <CategorySection
                key={cat.key}
                cat={cat}
                tools={tools}
                isMobile={isMobile}
                pinnedSlugs={pinnedSlugs}
                onTogglePin={togglePin}
              />
            ))}
        </div>
      </div>
    </>
  );
}
