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
  "pdf-to-word": "Convert any PDF to an editable Word document. Keeps text, headings, and tables intact.",
  "pdf-to-text": "Pull the raw text out of any PDF. No formatting, no columns — just the words.",
  "pdf-to-html": "Convert a PDF to clean HTML with real headings and paragraphs. Ready to paste into any CMS.",
  "pdf-to-epub": "Turn any PDF into an EPUB that reflows on phones, tablets, and e-readers.",
  "pdf-compress": "Reduce PDF file size without visible quality loss. Useful for email or upload limits.",
  "pdf-merge": "Combine multiple PDFs into one file. Drag to set the order, then download.",
  "pdf-split": "Extract specific pages or split a PDF into smaller files. Send only what's needed.",
  "pdf-rotate": "Fix sideways or upside-down pages from a scanner. Rotate one page or all at once.",
  "pdf-unlock": "Remove password protection from a PDF. You need the current password to do this.",
  "pdf-protect": "Add a password to any PDF before sending or storing sensitive documents.",
  "pdf-page-numbers": "Stamp page numbers onto every page. Choose the position and starting number.",
  "pdf-watermark": "Add a text watermark across PDF pages. Control text, opacity, and angle.",
  "pdf-to-image": "Export each page as a PNG or JPEG. Share a page as an image or embed it anywhere.",
  "pdf-to-excel": "Extract data tables from a PDF into editable spreadsheet rows and columns.",
  "reorder-pdf": "Drag pages into any order, remove what you don't need, then download.",
  "ocr": "Read text from scanned pages, photos, and screenshots. Runs entirely in your browser.",

  // Word & Docs
  "word-to-pdf": "Convert Word documents to PDF, keeping fonts, tables, and spacing exactly as laid out.",
  "word-to-text": "Strip all styles and tracked changes from a DOCX. Clean plain text, ready to paste anywhere.",
  "word-to-html": "Convert Word documents to clean HTML without Microsoft bloat. Ready for any CMS.",
  "word-to-epub": "Turn a Word document into an EPUB for Kindle, Kobo, or any reading app.",
  "word-to-markdown": "Convert Word documents to Markdown. Headings, bold, and lists all carry over.",
  "html-to-markdown": "Strip HTML down to clean Markdown. Good for migrating content or editor output.",
  "markdown-to-pdf": "Render Markdown into a formatted PDF with real headings and code blocks.",
  "markdown-to-docx": "Convert Markdown to a Word document with proper heading styles and formatting.",
  "html-to-pdf": "Render HTML into a PDF with styles intact. Good for archiving or generating reports.",
  "txt-to-pdf": "Wrap plain text in a clean PDF with proper margins. Good for sharing notes or logs.",
  "txt-to-docx": "Convert plain text into a Word document. Fastest path from a text editor to DOCX.",

  // Excel & Spreadsheets
  "excel-to-pdf": "Convert Excel spreadsheets to PDF, keeping tables, charts, and formatting intact.",
  "excel-to-csv": "Export any Excel sheet as a plain CSV any tool or database can read.",
  "csv-to-excel": "Convert a CSV into a formatted Excel spreadsheet. Skips the import wizard entirely.",
  "csv-to-json": "Convert CSV to JSON, or JSON back to CSV. Move data between different formats.",
  "csv-viewer": "Open any CSV in a clean, sortable table. No spreadsheet app needed.",

  // PowerPoint
  "pptx-to-pdf": "Convert PowerPoint to PDF so anyone can open it without PowerPoint installed.",
  "pptx-to-images": "Export every slide as a PNG and download them in a ZIP. Good for design tools.",
  "pdf-to-pptx": "Turn PDF pages into editable PowerPoint slides. Move and edit content on each slide.",

  // Image Tools
  "image-converter": "Convert images between PNG, JPEG, WebP, AVIF, BMP, GIF, TIFF, and ICO. Batch up to 20.",
  "heic-to-jpg": "Convert iPhone HEIC photos to JPEG so they open anywhere. Drag in multiple files.",
  "heic-to-png": "Convert HEIC photos to PNG for lossless quality and wide compatibility.",
  "heic-to-webp": "Convert HEIC photos to WebP for smaller files that load fast in any modern browser.",
  "heic-to-pdf": "Combine one or more HEIC photos into a single PDF. Good for sharing iPhone photos.",
  "image-compress": "Reduce image file sizes with adjustable quality. Works for uploads, email, and web.",
  "image-resize": "Resize images to exact pixels or scale by percentage. Lock aspect ratio to avoid distortion.",
  "image-crop": "Crop images with drag handles in the browser. Use preset ratios or a custom area.",
  "image-to-pdf": "Combine one or more images into a single PDF. Good for a tidy batch attachment.",
  "background-remover": "Remove backgrounds from photos using AI. Outputs a transparent PNG.",
  "flip-rotate-image": "Flip or rotate images by any angle. Fixes sideways photos from cameras or scanners.",
  "watermark-image": "Stamp a custom text watermark on photos. Set text, position, opacity, and size.",
  "favicon-generator": "Generate favicons at every standard size. Downloads as a ZIP with all required files.",
  "png-to-webp": "Convert PNG to WebP for smaller file sizes at the same visual quality.",
  "jpg-to-webp": "Convert JPEG to WebP for better compression at similar quality.",
  "gif-to-webp": "Convert GIFs to WebP, which supports animation and gives much smaller files.",
  "bmp-to-webp": "Convert BMP to WebP. Drops file size considerably for web use.",
  "tiff-to-webp": "Convert TIFF images to WebP for web-friendly file sizes.",
  "webp-to-png": "Convert WebP back to PNG for apps and platforms that don't support WebP yet.",
  "webp-to-jpg": "Convert WebP to JPEG for maximum compatibility with apps, printers, and older systems.",
  "webp-to-pdf": "Combine WebP images into a PDF document for sharing or archiving.",
  "webp-to-avif": "Convert WebP to AVIF for even better compression at equivalent quality.",
  "jpg-to-avif": "Convert JPEG to AVIF for noticeably smaller files without visible quality loss.",
  "png-to-avif": "Convert PNG to AVIF. Often beats WebP on file size for both lossy and lossless.",
  "avif-to-jpg": "Convert AVIF to JPEG when you need something that opens everywhere.",
  "avif-to-png": "Convert AVIF to PNG for full compatibility with tools that don't support AVIF yet.",
  "jpg-to-png": "Convert JPEG to PNG for lossless quality and transparency support.",
  "png-to-jpg": "Convert PNG to JPEG for smaller file sizes. Fine for photos that don't need transparency.",
  "png-to-svg": "Wrap a PNG inside an SVG container. Useful when a platform requires SVG input.",
  "svg-to-png": "Render SVG graphics to a PNG at the pixel size you set.",
  "gif-to-png": "Extract the first frame of a GIF as a still PNG. Good for thumbnails.",
  "bmp-to-jpg": "Convert BMP to JPEG for a dramatic file size reduction.",
  "tiff-to-jpg": "Convert TIFF to JPEG for smaller files, easy to share online or by email.",
  "tiff-to-png": "Convert TIFF to PNG for broad compatibility without quality loss.",
  "jpg-to-pdf": "Convert JPEG images into a PDF. Multiple photos become one file, one per page.",
  "png-to-pdf": "Convert PNG images into a PDF at high quality. Good for diagrams and screenshots.",

  // Privacy
  "metadata-cleaner": "Strip hidden metadata from images and documents: GPS, camera model, author name.",
  "ai-text-scrubber": "Remove invisible characters and AI-detection patterns from text. Get a clean version.",
  "checksum": "Generate and verify SHA-1, SHA-256, and SHA-512 checksums. Confirm a download is untampered.",

  // Text & Code
  "json-formatter": "Format messy JSON into something readable, or minify it. Validates and highlights errors.",
  "html-formatter": "Format or minify HTML markup. Useful for reading generated code or preparing for deploy.",
  "base64": "Encode text or files to Base64 and decode Base64 strings back. Useful for data URIs and APIs.",
  "url-encoder": "Encode or decode URL components. Fix broken query strings and check percent-encoding.",
  "word-counter": "Count words, characters, sentences, and paragraphs. Estimates reading time too.",
  "lorem-ipsum": "Generate placeholder text for mockups. Choose paragraphs, sentences, or words.",

  // Calculators
  "password-generator": "Generate strong passwords using your browser's crypto RNG. See the entropy score live.",
  "percentage-calc": "Calculate X% of Y, what percentage X is of Y, or the change between two numbers.",
  "unit-converter": "Convert between units across 13 categories: length, weight, temperature, speed, and more.",
  "currency-converter": "Convert currencies with live rates that update hourly. Falls back offline automatically.",
  "qr-code-generator": "Generate QR codes for URLs, text, Wi-Fi, or contacts. Download as PNG at any size.",
  "tip-calculator": "Calculate the tip and split by any number of people. Enter bill, percentage, and headcount.",
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
