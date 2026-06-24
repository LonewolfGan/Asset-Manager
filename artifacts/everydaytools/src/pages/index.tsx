import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { tools } from "@/config/tools.config";
import { useLocale } from "@/hooks/use-locale";
import { useIsMobile } from "@/hooks/use-mobile";
import type { LucideIcon } from "lucide-react";
import {
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
  "pdf-to-word": "Convert any PDF into an editable Word document. Text, headings, and tables carry over — download as DOCX ready to edit in Word or Google Docs.",
  "pdf-to-text": "Pull the raw text from any PDF in one click. No columns, no formatting — just clean, copyable content ready to paste anywhere.",
  "pdf-to-html": "Convert a PDF into clean HTML with real headings and paragraphs. Paste the result directly into any CMS or web editor without cleanup.",
  "pdf-to-epub": "Turn any PDF into a reflowable EPUB for phones, tablets, and e-readers. Compatible with Kindle, Kobo, Apple Books, and any standard reader.",
  "pdf-compress": "Shrink PDF file sizes without noticeable quality loss. Useful for email limits and upload size caps — choose your compression level before downloading.",
  "pdf-merge": "Combine multiple PDFs into one file. Arrange them in any order before merging, then download the cleanly joined result.",
  "pdf-split": "Extract specific pages or divide a PDF into smaller files. Choose individual pages or ranges, then download only the sections you need.",
  "pdf-rotate": "Fix sideways or upside-down pages from a scan or camera. Rotate one page or all at once, then download the corrected file.",
  "pdf-unlock": "Remove the password from a protected PDF. Enter the existing password to authorize it, then download a freely shareable, unlocked copy.",
  "pdf-protect": "Add a password to any PDF before sending or archiving. Recipients must enter it to open the file — ideal for contracts and sensitive documents.",
  "pdf-page-numbers": "Stamp sequential page numbers onto every page of a PDF. Pick the position and starting number, then download the numbered document.",
  "pdf-watermark": "Add a text watermark across PDF pages. Control the text, opacity, angle, and size — useful for drafts, confidential files, or branded documents.",
  "pdf-to-image": "Export every PDF page as a PNG or JPEG. Useful for sharing a page visually or embedding it as a graphic anywhere.",
  "pdf-to-excel": "Pull tabular data from a PDF into an editable spreadsheet. Rows and columns map to Excel cells — saves hours of manual re-entry.",
  "reorder-pdf": "Drag PDF pages into any order, remove what you don't need, and download a clean reorganized version in seconds.",
  "ocr": "Extract text from scanned documents, photos, and screenshots. Supports multiple languages and handles skewed or low-contrast images well.",

  // Word & Docs
  "word-to-pdf": "Convert Word documents to PDF with fonts, tables, and spacing fully preserved. Share files that look identical on any device or printer.",
  "word-to-text": "Strip all formatting, styles, and tracked changes from a DOCX. Returns clean plain text — ready to paste anywhere without carrying markup across.",
  "word-to-html": "Convert Word documents to clean, semantic HTML without Microsoft bloat. Headings, lists, and links stay intact — paste straight into any CMS.",
  "word-to-epub": "Turn a Word document into a reflowable EPUB for reading apps. Works with Kindle, Kobo, Apple Books, and any standard EPUB reader.",
  "word-to-markdown": "Convert Word documents to Markdown. Headings, bold, italic, and lists carry over — ready for GitHub, Notion, or any static site generator.",
  "html-to-markdown": "Strip HTML down to clean, portable Markdown. Handles headings, links, and lists — ideal for migrating blog content or CMS output.",
  "markdown-to-pdf": "Render Markdown into a formatted PDF with proper headings, code blocks, and lists. Download a print-ready document in one click.",
  "markdown-to-docx": "Convert Markdown to a Word document with proper heading styles. Lists, bold, and italic all convert cleanly for collaborators who use Word.",
  "html-to-pdf": "Render any HTML file into a PDF with its styles intact. Useful for archiving pages, generating reports, or capturing designed layouts.",
  "txt-to-pdf": "Wrap plain text in a clean, well-margined PDF. Share notes, logs, or terminal output as a readable and printable attachment.",
  "txt-to-docx": "Convert a plain text file into a Word document in one step — skips the copy-paste into Word, outputs a proper DOCX directly.",

  // Excel & Spreadsheets
  "excel-to-pdf": "Convert Excel spreadsheets to PDF with tables and formatting intact. Anyone can read the result without needing Excel installed.",
  "excel-to-csv": "Export any Excel sheet as a plain CSV that any tool or database can read. Strips formulas and returns clean, portable data rows.",
  "csv-to-excel": "Convert a CSV into a formatted Excel spreadsheet without the import wizard. Useful for sharing data with people who prefer structured files.",
  "csv-to-json": "Convert CSV to JSON or JSON back to CSV. Move data between formats without writing any code — useful for APIs and apps.",
  "csv-viewer": "Open any CSV in a clean, sortable table directly in the browser. No spreadsheet app required to inspect or read the data.",

  // PowerPoint
  "pptx-to-pdf": "Convert a PowerPoint presentation to PDF in one step. Anyone can open the result without PowerPoint — layout and images fully preserved.",
  "pptx-to-images": "Export every slide as a PNG image and download them all as a ZIP. Useful for design tools or sharing individual slides as graphics.",
  "pdf-to-pptx": "Convert PDF pages into editable PowerPoint slides. Each page becomes a movable slide element — useful for reusing existing PDF content.",

  // Image Tools
  "image-converter": "Convert images between PNG, JPEG, WebP, AVIF, BMP, GIF, TIFF, and ICO. Batch up to 20 files and download all results as a ZIP.",
  "heic-to-jpg": "Convert iPhone HEIC photos to JPEG for universal compatibility. Supports multiple files at once — opens in any app, viewer, or editor.",
  "heic-to-png": "Convert HEIC photos to lossless PNG for broad compatibility. Preserves every pixel exactly and handles multiple files at once.",
  "heic-to-webp": "Convert HEIC photos to WebP for smaller files that load fast in modern browsers. Ideal for web publishing and social media.",
  "heic-to-pdf": "Combine one or more HEIC photos into a single PDF. Each photo gets its own page — useful for sharing iPhone photos as attachments.",
  "image-compress": "Reduce image file sizes with an adjustable quality slider. Smaller files upload faster and take less storage — works for JPEG, PNG, and WebP.",
  "image-resize": "Resize any image to exact pixels or a percentage of the original. Lock the aspect ratio to prevent distortion during resizing.",
  "image-crop": "Crop images with interactive drag handles in the browser. Use preset ratios or a custom area, then download at full resolution.",
  "image-to-pdf": "Combine one or more images into a single multi-page PDF. Each image gets its own page — useful for bundling photos into one file.",
  "background-remover": "Remove backgrounds from photos using AI. Outputs a transparent PNG ready for designs, presentations, or a new background.",
  "flip-rotate-image": "Flip or rotate images by any angle. Fix sideways or upside-down photos from cameras and scanners at full resolution.",
  "watermark-image": "Add a text watermark to photos with control over position, opacity, size, and color. Useful for protecting images from reuse.",
  "favicon-generator": "Generate favicons at every standard size from a single image. Downloads as a ZIP with all files needed for browsers, PWAs, and apps.",
  "png-to-webp": "Convert PNG to WebP for smaller files at equivalent visual quality. WebP loads faster and is supported in every modern browser.",
  "jpg-to-webp": "Convert JPEG to WebP for better compression at similar quality. WebP files are typically 25-35% smaller than JPEG at the same setting.",
  "gif-to-webp": "Convert animated GIFs to WebP for much smaller files that still animate. WebP animations load faster across all modern browsers.",
  "bmp-to-webp": "Convert BMP to WebP for a dramatic reduction in file size. Efficient compression with no visible quality loss — ideal for web publishing.",
  "tiff-to-webp": "Convert TIFF to WebP for web-friendly file sizes. Comparable quality at a fraction of the size — ideal for publishing images online.",
  "webp-to-png": "Convert WebP back to lossless PNG for apps and platforms that don't support WebP yet. Compatible with all tools and print services.",
  "webp-to-jpg": "Convert WebP to JPEG for maximum compatibility with apps, printers, and older systems. Accepted by virtually every image service.",
  "webp-to-pdf": "Combine WebP images into a PDF for sharing or archiving. Each image is placed on its own page in the output document.",
  "webp-to-avif": "Convert WebP to AVIF for even better compression at equivalent quality. AVIF typically produces 20-50% smaller files at similar settings.",
  "jpg-to-avif": "Convert JPEG to AVIF for noticeably smaller files without visible quality loss. AVIF outperforms JPEG significantly in compression efficiency.",
  "png-to-avif": "Convert PNG to AVIF for modern, efficient compression. Often beats WebP on file size for both lossy and lossless output.",
  "avif-to-jpg": "Convert AVIF to JPEG for compatibility with tools that don't yet support AVIF. JPEG works universally across all apps and services.",
  "avif-to-png": "Convert AVIF to lossless PNG for full compatibility with software that doesn't support AVIF. Accepted by all design tools.",
  "jpg-to-png": "Convert JPEG to lossless PNG for transparency support and exact pixel preservation. Useful in tools that require PNG input.",
  "png-to-jpg": "Convert PNG to JPEG for smaller file sizes when transparency isn't needed. A quick way to reduce size before uploading or sharing.",
  "png-to-svg": "Embed a PNG inside an SVG container for platforms that require SVG input. No redrawing needed — the PNG data is included directly.",
  "svg-to-png": "Render SVG graphics to a PNG at the exact pixel dimensions you choose. Useful for exporting icons, logos, and diagrams to raster.",
  "gif-to-png": "Extract the first frame of a GIF as a still PNG. Useful for generating thumbnails or static previews from animated GIF files.",
  "bmp-to-jpg": "Convert BMP to JPEG for a dramatic file size reduction. Efficient compression with minimal visible quality loss — easy to share online.",
  "tiff-to-jpg": "Convert TIFF to JPEG for smaller, shareable files. Keeps visual quality intact while making the file practical to send by email.",
  "tiff-to-png": "Convert TIFF to lossless PNG for broad compatibility. Accepted by virtually all image tools and services without sacrificing quality.",
  "jpg-to-pdf": "Convert JPEG images into a PDF with each photo on its own page. Combine multiple images into one organized, shareable document.",
  "png-to-pdf": "Convert PNG images into a PDF at full resolution. Each image gets its own page — useful for diagrams, screenshots, and illustrations.",

  // Privacy
  "metadata-cleaner": "Strip hidden metadata from images and documents before sharing. Removes GPS location, camera model, and author name in seconds.",
  "ai-text-scrubber": "Remove invisible characters and AI detection patterns from any text. Outputs a clean version that reads identically but without embedded signals.",
  "checksum": "Generate and verify SHA-1, SHA-256, and SHA-512 checksums for any file. Compare them to confirm a download hasn't been tampered with.",

  // Text & Code
  "json-formatter": "Format messy JSON into readable, indented output or minify it to one line. Validates syntax and highlights errors — handles any size JSON.",
  "html-formatter": "Format or minify HTML markup cleanly and consistently. Useful for reading generated code or preparing markup before deploying to production.",
  "base64": "Encode text or files to Base64, or decode Base64 strings back to their original form. Useful for data URIs, embedded images, and API debugging.",
  "url-encoder": "Encode or decode URL components to fix broken query strings. Converts special characters to percent-encoded form — useful for building API requests.",
  "word-counter": "Count words, characters, sentences, and paragraphs in any text. Also estimates reading time — useful for hitting content length targets.",
  "lorem-ipsum": "Generate placeholder text for wireframes and design layouts. Choose paragraphs, sentences, or words — fills any space before real content is ready.",

  // Calculators
  "password-generator": "Generate strong, random passwords using cryptographic randomness. See the entropy score in bits and customize length, symbols, and character sets.",
  "percentage-calc": "Calculate X% of Y, find what percentage X is of Y, or compute the change between two values. Covers all common percentage problems in one place.",
  "unit-converter": "Convert between units across 13 categories: length, weight, temperature, speed, and more. Type a value and instantly see it in every unit.",
  "currency-converter": "Convert currencies using live rates that update every hour. Falls back to cached rates automatically if the network is unavailable.",
  "qr-code-generator": "Generate QR codes for URLs, text, Wi-Fi credentials, or contact cards. Set the output size and download as PNG at any resolution.",
  "tip-calculator": "Calculate the tip and split the bill by any number of people. Enter amount, tip percentage, and headcount — get per-person totals instantly.",
};

interface DashTool {
  slug: string;
  name: string;
  description: string;
  categoryKey: string;
  Icon: LucideIcon;
  badge?: string;
  route: string;
  formats: string[];
}

const DASH_TOOLS: DashTool[] = tools.map((t) => ({
  slug: t.slug,
  name: t.title,
  description: HUMAN_DESC[t.slug] ?? t.description,
  categoryKey: t.category,
  Icon: t.icon as LucideIcon,
  badge: BADGE_SLUGS.has(t.slug) ? "AI" : undefined,
  route: `/${t.slug}`,
  formats: (t.formats ?? []) as string[],
}));

/* ── Icon renderer ─────────────────────────────────────────────────────────── */
function ToolIconContent({ tool }: { tool: DashTool }) {
  const { Icon } = tool;
  return <Icon size={22} strokeWidth={1.6} />;
}


/* ── Hero Section ──────────────────────────────────────────────────────────── */
function ToolCard({
  tool,
  cat,
}: {
  tool: DashTool;
  cat: CategoryDef;
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
        className="tool-card"
        style={{
          position: "relative",
          borderRadius: "var(--radius-card)",
          border: "1px solid var(--border)",
          background: "var(--bg-surface)",
          cursor: "pointer",
          overflow: "hidden",
          transition: "border-color 150ms ease, box-shadow 150ms ease",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          textAlign: "left",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = cat.border;
          el.style.boxShadow = `0 4px 16px rgba(0,0,0,0.07)`;
          const tint = el.querySelector<HTMLElement>(".card-tint");
          if (tint) tint.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "var(--border)";
          el.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
          const tint = el.querySelector<HTMLElement>(".card-tint");
          if (tint) tint.style.opacity = "0";
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

        {/* Icon — top-left */}
        <div
          className="tool-card-icon"
          style={{
            borderRadius: 'var(--radius-card)',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: cat.bg,
            color: cat.color,
            flexShrink: 0,
            position: "relative",
          }}
        >
          <ToolIconContent tool={tool} />
        </div>

        {/* Name + badge + description — left-aligned, natural top-to-bottom flow */}
        <div className="tool-card-text" style={{ position: "relative", display: "flex", flexDirection: "column", width: "100%" }}>
          <div className="tool-card-title" style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{
              fontSize: isMobile ? "13px" : "15px",
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-ui)",
              lineHeight: "inherit",
            }}>
              {name}
            </span>
            {tool.badge && (
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 'var(--radius-sm)',
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
            fontSize: isMobile ? "11px" : "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            margin: 0,
            fontFamily: "var(--font-ui)",
            width: "100%",
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
      className="container-wide"
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
            {"Tools"}
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
                    borderRadius: 'var(--radius-pill)',
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
                    borderRadius: 'var(--radius-pill)',
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
          borderRadius: 'var(--radius-pill)',
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
              borderRadius: 'var(--radius-pill)',
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
}: {
  cat: CategoryDef;
  tools: DashTool[];
  isMobile: boolean;
}) {
  const { locale } = useLocale();
  const label = locale.toLowerCase().startsWith("fr") ? cat.labelFr : cat.label;

  return (
    <section id={`cat-${cat.key}`} style={{ marginBottom: 40 }}>
      <div className="tool-grid">
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            cat={cat}
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

        {/* Tools area — vertical padding only; horizontal handled by container-wide */}
        <div style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="container-wide">


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
            <div className="tool-grid">
              {filteredTools.map((tool) => {
                const cat = CATEGORY_MAP[tool.categoryKey] ?? CATEGORIES[0];
                return (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    cat={cat}
                  />
                );
              })}
            </div>
          )}

          {/* All tools flat grid (no category sections) */}
          {!isSearching && activeKey === null && (
            <div className="tool-grid">
              {DASH_TOOLS.map((tool) => {
                const cat = CATEGORY_MAP[tool.categoryKey] ?? CATEGORIES[0];
                return (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    cat={cat}
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
              />
            ))}
        </div>{/* tool-grid-wrap */}
        </div>
      </div>
    </>
  );
}
