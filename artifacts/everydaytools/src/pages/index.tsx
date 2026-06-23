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
  "pdf-to-word": "Converts any PDF to an editable Word document. Keeps text, headings, tables, and basic formatting intact. Good for contracts, reports, and forms you'd otherwise have to retype from scratch.",
  "pdf-to-text": "Pulls all the raw text out of a PDF without any formatting or columns. Just the words, clean and selectable. Save as a .txt file or paste directly into any other app.",
  "pdf-to-html": "Converts a PDF to real HTML with proper headings, paragraphs, and structure. Far cleaner than copy-pasting into a CMS. Ready to use in a webpage without the usual cleanup work.",
  "pdf-to-epub": "Turns any PDF into an EPUB that reflows to fit any screen size. Makes long reports and books far more comfortable to read on phones, tablets, and dedicated e-readers.",
  "pdf-compress": "Shrinks PDF file sizes without visible quality loss. Useful when a file is too large to email or hits a portal upload size limit. Drop it in and download a smaller version.",
  "pdf-merge": "Combines multiple PDFs into one document in any order you set. Rearrange files by dragging them, then merge and download in one click. Good for collecting pages from different sources.",
  "pdf-split": "Pulls out specific pages or slices a large PDF into smaller files. Useful when you need to share only part of a document, or when a portal has a strict page limit.",
  "pdf-rotate": "Fixes pages that came out sideways or upside down from a scanner or phone camera. Rotate single pages or the whole document at once, then download immediately.",
  "pdf-unlock": "Removes password protection from a PDF. You need the current password to unlock it. After that, you can open, print, and copy from the file without re-entering a password.",
  "pdf-protect": "Adds password encryption to any PDF. Set a custom password before sending sensitive documents by email or uploading them somewhere others have access to.",
  "pdf-page-numbers": "Stamps page numbers onto every page in the position and style you choose. Set the starting number and pick the corner or center alignment that works for your layout.",
  "pdf-watermark": "Adds a custom text watermark diagonally across every page. Control the text, opacity, size, and angle. Often used for DRAFT, CONFIDENTIAL, or sample document markings.",
  "pdf-to-image": "Exports each PDF page as a PNG or JPEG image. Useful for sharing a single page as a screenshot, embedding slides in a presentation, or generating page thumbnails.",
  "pdf-to-excel": "Finds data tables inside a PDF and extracts them into rows and columns you can edit. Works best on PDFs with clearly defined, structured tables and consistent formatting.",
  "reorder-pdf": "Drag pages into any order, delete the ones you don't need, then download. Useful after scanning a stack in the wrong sequence or cleaning up a document before sharing.",
  "ocr": "Reads text from scanned PDFs, photos of pages, and screenshots. Turns a picture of a page into selectable, searchable text you can copy anywhere. Model runs in the browser.",

  // Word & Docs
  "word-to-pdf": "Converts Word documents to PDF while keeping fonts, tables, images, and spacing exactly as laid out. More reliable than the print-to-PDF option built into Word.",
  "word-to-text": "Strips all styles, tracked changes, and hidden formatting from a DOCX file. What you get is clean, plain text ready to paste anywhere without unexpected side effects.",
  "word-to-html": "Converts Word documents to clean, minimal HTML without Microsoft's bloat or embedded styles. Headings, paragraphs, and lists all map correctly. Ready to paste into a CMS.",
  "word-to-epub": "Turns a Word document into an EPUB file for Kindle, Kobo, or any reading app. Text reflows to fit the screen properly instead of showing miniaturized A4 pages.",
  "word-to-markdown": "Converts Word documents to Markdown syntax. Headings become #, bold stays bold, lists stay lists. Good for writing that moves to GitHub, Hugo, Obsidian, or Notion.",
  "html-to-markdown": "Strips raw HTML down to clean Markdown. Handles headings, links, lists, and basic formatting. Good for migrating web content or cleaning up rich text editor output.",
  "markdown-to-pdf": "Renders a Markdown file into a properly formatted PDF with real headings, code blocks, and spacing. Easier than fighting with styles in a word processor.",
  "markdown-to-docx": "Converts Markdown to a Word document with proper heading styles, bold, italic, and lists carried over. Useful for delivering finished writing to someone who lives in Word.",
  "html-to-pdf": "Renders an HTML file or snippet into a PDF with styles and layout intact. Good for archiving web pages, generating reports, or printing HTML-based content.",
  "txt-to-pdf": "Wraps plain text in a clean PDF with proper margins and a readable font. Good for sharing notes, logs, or plain-text files that need to look presentable.",
  "txt-to-docx": "Converts plain text into a Word document with default styles applied. Fastest way to go from a text editor or terminal output to a proper DOCX file.",

  // Excel & Spreadsheets
  "excel-to-pdf": "Converts Excel spreadsheets to PDF while keeping tables, charts, and formatting as they appear on screen. Good for sharing data with people who shouldn't be editing it.",
  "excel-to-csv": "Exports any Excel sheet as a plain CSV that any tool, database, or script can read. Strips the Excel-specific parts and gives you just the raw data rows.",
  "csv-to-excel": "Converts a CSV file into a formatted Excel spreadsheet. Skips the manual import wizard with its delimiter settings and data-type guessing entirely.",
  "csv-to-json": "Converts CSV to structured JSON or turns JSON back into CSV rows. Useful when moving data between tools and APIs that expect different input formats.",
  "csv-viewer": "Opens any CSV file in a clean, sortable table. Useful when you need to check the contents of a data export without opening a full spreadsheet app.",

  // PowerPoint
  "pptx-to-pdf": "Converts PowerPoint presentations to PDF so anyone can open them without PowerPoint installed. Fonts, layouts, images, and slide order all come through intact.",
  "pptx-to-images": "Exports every slide as a separate PNG image and bundles them in a ZIP. Handy for using slide content in design tools, social posts, or anywhere images work better.",
  "pdf-to-pptx": "Turns PDF pages into PowerPoint slides you can open and edit. Each page maps to its own slide with the content extracted so you can move, resize, and rework it.",

  // Image Tools
  "image-converter": "Converts images between PNG, JPEG, WebP, AVIF, BMP, GIF, TIFF, and ICO. Batch convert up to 20 files at once and download everything as a single ZIP archive.",
  "heic-to-jpg": "Converts iPhone HEIC photos to JPEG so they open on any device, printer, or app that doesn't support Apple's format. Drop in multiple files to convert them at once.",
  "heic-to-png": "Converts HEIC photos to PNG for lossless quality. PNG works almost everywhere that HEIC doesn't, including most online platforms and non-Apple devices.",
  "heic-to-webp": "Converts HEIC photos to WebP, giving you smaller files that load quickly in any modern browser. A better choice than JPEG if the destination supports WebP.",
  "heic-to-pdf": "Combines one or more HEIC photos into a single PDF document. Good for collecting iPhone photos into a format everyone can open and print without issues.",
  "image-compress": "Reduces image file sizes with adjustable quality settings. Useful when uploads have size limits, pages are loading slowly, or you're sending photos by email.",
  "image-resize": "Resizes images to exact pixel dimensions or scales them down by percentage. Lock the aspect ratio to avoid distortion. Handles batches of multiple files too.",
  "image-crop": "Crops images with interactive drag handles right in the browser. Choose from preset ratios like 1:1 or 16:9, or draw a completely custom crop area to keep.",
  "image-to-pdf": "Combines one or more images into a single PDF document. Good for collecting a batch of photos or screenshots into one neat attachment to share or archive.",
  "background-remover": "Removes the background from photos using AI running on your device. Works on portraits, product shots, and objects with a reasonably clear subject. Outputs a transparent PNG.",
  "flip-rotate-image": "Flips images horizontally or vertically, or rotates by any angle you set. Fixes photos that came out sideways from a phone camera or scanner. Download immediately.",
  "watermark-image": "Stamps a custom text watermark across your photos. Adjust the text, position, opacity, and size to match what you need. Good for protecting ownership or marking proofs.",
  "favicon-generator": "Generates favicons at every standard size from a single uploaded image. Downloads as a ZIP containing all the sizes browsers, iOS, and Android expect to find.",
  "png-to-webp": "Converts PNG images to WebP for smaller file sizes with virtually the same visual quality. Straightforward to batch if you have multiple files to convert.",
  "jpg-to-webp": "Converts JPEG images to WebP for better compression at a similar quality level. Switching to WebP is one of the simplest ways to cut web page load times.",
  "gif-to-webp": "Converts animated GIFs to WebP. The WebP format supports animation and typically cuts the file size significantly. Makes a real difference for sites that use a lot of GIFs.",
  "bmp-to-webp": "Converts BMP files to WebP, replacing an outdated uncompressed format with one that's practical for web use. Drops the file size considerably.",
  "tiff-to-webp": "Converts TIFF images to WebP for web-friendly file sizes. TIFF files are often very large; WebP brings the size down to something workable for online use.",
  "webp-to-png": "Converts WebP images back to PNG. PNG works across the board, including older apps, print workflows, and platforms that still don't accept WebP files.",
  "webp-to-jpg": "Converts WebP images to JPEG for maximum compatibility. JPEG is accepted by virtually every app, printer, and older system that WebP sometimes isn't.",
  "webp-to-pdf": "Combines WebP images into a PDF document. Useful for collecting a set of WebP screenshots or photos into one file for sharing or archiving.",
  "webp-to-avif": "Converts WebP to AVIF for even better compression at the same quality. AVIF often beats WebP on file size, especially on photographic content.",
  "jpg-to-avif": "Converts JPEG photos to AVIF for noticeably smaller file sizes without visible quality loss. A good upgrade if you're serving images on a modern web stack.",
  "png-to-avif": "Converts PNG to AVIF, which handles both lossy and lossless compression and regularly beats WebP on file size. Worth using if your audience is on modern browsers.",
  "avif-to-jpg": "Converts AVIF images to JPEG when you need something that opens everywhere. JPEG is nearly universal; AVIF still isn't supported on some older apps and tools.",
  "avif-to-png": "Converts AVIF to PNG for full compatibility with tools, editors, and platforms that don't yet support the AVIF format. Quality is preserved in the conversion.",
  "jpg-to-png": "Converts JPEG images to PNG for lossless quality and full transparency support. Useful when you need a sharper version of a photo or an image with a transparent background.",
  "png-to-jpg": "Converts PNG to JPEG for smaller file sizes. Loses transparency in the process, but that's rarely an issue for photos and most general-purpose images.",
  "png-to-svg": "Wraps a PNG inside an SVG container element. Useful when a platform requires SVG input but your source is a raster image. The image content stays as PNG.",
  "svg-to-png": "Renders an SVG file to a PNG at the pixel dimensions you specify. Good for icons and illustrations that need to be submitted somewhere that doesn't accept SVG.",
  "gif-to-png": "Extracts the first frame of an animated GIF as a still PNG image. Useful for creating a thumbnail or static preview from an animated file.",
  "bmp-to-jpg": "Converts BMP files to JPEG for a dramatic reduction in file size. BMP is uncompressed by design; JPEG is far more practical for storage and sharing.",
  "tiff-to-jpg": "Converts TIFF images to JPEG for much smaller file sizes. TIFF is standard in photography and print; JPEG is what you need when sharing online or by email.",
  "tiff-to-png": "Converts TIFF images to PNG for broad compatibility without any quality loss. PNG is widely supported on the web and in apps that won't accept TIFF files.",
  "jpg-to-pdf": "Converts JPEG images into a PDF document. Drop in several photos and they'll all be combined into one file, one image per page, ready to share or archive.",
  "png-to-pdf": "Converts PNG images into a PDF, one or several at a time. Pages are set to fit the image at high quality. Good for clean diagrams and screenshots.",

  // Privacy
  "metadata-cleaner": "Strips hidden metadata from images and documents: GPS location, camera model, creation date, author name. Worth running before sharing photos publicly or submitting documents.",
  "ai-text-scrubber": "Removes invisible Unicode characters and statistical patterns that AI-detection tools flag. Paste your text in and get a version that reads naturally without hidden markers.",
  "checksum": "Generates and verifies SHA-1, SHA-256, and SHA-512 checksums for any file. Paste in an expected hash to confirm that a download hasn't been tampered with.",

  // Text & Code
  "json-formatter": "Formats messy JSON into something readable, or minifies it for production. Validates the structure and highlights any syntax errors. Runs entirely in the browser.",
  "html-formatter": "Formats compressed HTML into clean, properly indented markup, or minifies it back down for deployment. Useful for reading generated HTML that arrived as one long line.",
  "base64": "Encodes text or files to Base64 and decodes Base64 strings back to their original form. Useful for data URIs, inline CSS images, and debugging API request payloads.",
  "url-encoder": "Encodes special characters in URLs so they work correctly in links and query strings. Decodes encoded strings back to readable text. Good for debugging broken URLs.",
  "word-counter": "Counts words, characters with and without spaces, sentences, and paragraphs. Estimates reading time based on the word count. Useful for hitting or staying under a limit.",
  "lorem-ipsum": "Generates placeholder text for design mockups and prototypes. Choose paragraphs, sentences, or individual words in any quantity. Copy directly to the clipboard.",

  // Calculators
  "password-generator": "Generates strong passwords using your browser's cryptographic random number generator, not a server. Shows the entropy score and updates it as you adjust length and character sets.",
  "percentage-calc": "Handles the three percentage calculations people always get wrong: X% of Y, what percentage is X of Y, and the percentage change between two numbers.",
  "unit-converter": "Converts between units across 13 categories including length, weight, temperature, pressure, speed, area, volume, and data storage. Results update as you type.",
  "currency-converter": "Converts between currencies using live exchange rates that update every hour. Shows a quick-conversion table for common amounts. Falls back to offline rates when the network is unavailable.",
  "qr-code-generator": "Generates QR codes for URLs, plain text, Wi-Fi credentials, and contact cards. Preview the code instantly and download as a PNG at any resolution you need.",
  "tip-calculator": "Calculates the tip and splits the total across any number of people. Enter the bill amount, pick a tip percentage, and set how many are sharing the cost.",
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
        <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7, flexWrap: "wrap" }}>
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
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: 0,
            fontFamily: "var(--font-ui)",
          }}>
            {description}
          </p>
          <div style={{
            marginTop: "auto",
            paddingTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}>
            <span style={{ fontSize: "13px", color: "var(--text-tertiary)", lineHeight: 1 }}>→</span>
          </div>
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
