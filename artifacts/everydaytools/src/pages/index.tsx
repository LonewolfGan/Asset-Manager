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
  "pdf-to-word": "Convert any PDF to an editable Word document. Preserves text, headings, tables, and paragraph structure. Download the result as a standard DOCX file ready to edit in Word or Google Docs.",
  "pdf-to-text": "Pull the raw text from any PDF with a single click. No formatting, no columns — just clean, copyable words. Useful for extracting content to paste or reuse in other documents.",
  "pdf-to-html": "Convert a PDF to clean HTML with real headings and paragraph tags. Strips PDF layout artifacts and produces standards-compliant markup. Ready to paste directly into any CMS or web editor.",
  "pdf-to-epub": "Turn any PDF into a reflowable EPUB for phones, tablets, and e-readers. Adapts content to the reading device's screen size automatically. Compatible with Kindle, Kobo, Apple Books, and any EPUB reader.",
  "pdf-compress": "Reduce PDF file size without noticeable quality loss. Useful for meeting email attachment limits or upload size restrictions. Adjustable compression levels let you balance size and visual quality.",
  "pdf-merge": "Combine multiple PDFs into one file in a single operation. Drag files into the order you want before merging. Download the result as one cleanly joined PDF.",
  "pdf-split": "Extract specific pages or split a PDF into separate smaller files. Choose individual pages or page ranges to pull out. Send only the relevant section instead of the full document.",
  "pdf-rotate": "Fix sideways or upside-down pages from a scan or camera. Rotate a single page or apply the same rotation to all pages at once. Download the corrected PDF ready to share.",
  "pdf-unlock": "Remove the password from a protected PDF. Enter the existing password to authorize the operation. Outputs an unlocked copy you can edit, print, or share freely.",
  "pdf-protect": "Add a password to any PDF before sending or archiving. Set an open password that recipients must enter to view the document. Useful for invoices, contracts, and sensitive personal files.",
  "pdf-page-numbers": "Stamp sequential page numbers onto every page of a PDF. Choose the position — header or footer — and the starting number. Useful for reports, manuals, and any multi-page document.",
  "pdf-watermark": "Add a diagonal or horizontal text watermark across PDF pages. Control the text content, opacity, angle, and font size. Useful for marking drafts, confidential files, or branded documents.",
  "pdf-to-image": "Export each page of a PDF as a PNG or JPEG image. Useful for embedding a page as a graphic or sharing a single page visually. Download all images as individual files.",
  "pdf-to-excel": "Extract tabular data from a PDF into an editable spreadsheet. Recognizes rows and columns and maps them to Excel cells. Saves considerable time compared to manually re-entering table data.",
  "reorder-pdf": "Drag PDF pages into any order before downloading. Remove pages you don't need with a single click. Useful for reorganizing scanned documents or preparing a clean final version.",
  "ocr": "Read and extract text from scanned pages, photos, and screenshots. Supports multiple languages and handles skewed or low-contrast images. Output text is copyable and ready to use immediately.",

  // Word & Docs
  "word-to-pdf": "Convert Word documents to PDF with fonts, tables, and spacing fully preserved. Ensures the document looks identical on any device or printer. A reliable way to share files without risking layout changes.",
  "word-to-text": "Strip all formatting, styles, and tracked changes from a DOCX file. Returns clean plain text with no hidden markup or special characters. Ideal for pasting content into other tools without carrying formatting across.",
  "word-to-html": "Convert Word documents to clean, semantic HTML. Removes Microsoft-specific markup while keeping headings, lists, and links intact. Paste the result directly into any CMS or web page editor.",
  "word-to-epub": "Turn a Word document into a reflowable EPUB for reading apps. Adapts content to the screen size of phones, tablets, and e-readers. Compatible with Kindle, Kobo, Apple Books, and any standard EPUB reader.",
  "word-to-markdown": "Convert Word documents to Markdown syntax. Headings, bold, italic, and lists all carry over correctly. Useful for moving content into static site generators, GitHub, or Notion.",
  "html-to-markdown": "Strip HTML down to clean, portable Markdown. Handles headings, links, images, and lists correctly. Ideal for migrating blog content, CMS output, or editor-generated HTML to a simpler format.",
  "markdown-to-pdf": "Render Markdown into a formatted PDF with proper headings, code blocks, and lists. Useful for sharing documentation or notes with people who don't use Markdown tools. Download the result as a print-ready PDF.",
  "markdown-to-docx": "Convert Markdown to a Word document with proper heading styles applied. Useful for sharing content with collaborators who work in Word. Lists, bold, and italic all convert correctly and cleanly.",
  "html-to-pdf": "Render any HTML file into a PDF with its styles fully intact. Useful for archiving web pages, generating reports, or capturing designed layouts. Supports embedded CSS and standard HTML elements.",
  "txt-to-pdf": "Wrap plain text in a clean, well-margined PDF. Useful for sharing notes, logs, or terminal output as a readable attachment. Download the result ready to print or send by email.",
  "txt-to-docx": "Convert a plain text file into a Word document in one step. Saves the effort of opening Word and pasting content manually. The output is a proper DOCX compatible with both Word and Google Docs.",

  // Excel & Spreadsheets
  "excel-to-pdf": "Convert Excel spreadsheets to PDF, keeping tables, charts, and formatting intact. Useful for sharing data with people who don't have Excel installed. Downloads as a single PDF covering all sheets.",
  "excel-to-csv": "Export any Excel sheet as a plain CSV that any database or tool can read. Strips formulas and formatting, leaving clean row-and-column data. Useful for data migration and import workflows.",
  "csv-to-excel": "Convert a CSV into a formatted Excel spreadsheet in one step. Avoids the multi-step import wizard in Excel entirely. Useful for sharing data with people who prefer structured spreadsheets over raw CSV files.",
  "csv-to-json": "Convert CSV data to JSON, or JSON arrays back to CSV. Move data between formats without writing a script. Useful for feeding spreadsheet data into APIs or application code.",
  "csv-viewer": "Open any CSV in a clean, sortable table directly in the browser. No spreadsheet application required to inspect the data. Useful for quickly reviewing exported data before importing it elsewhere.",

  // PowerPoint
  "pptx-to-pdf": "Convert a PowerPoint presentation to PDF in one step. Anyone can open the result without having PowerPoint installed. Preserves slide layout, text, and images exactly as designed.",
  "pptx-to-images": "Export every slide in a PowerPoint file as a PNG image. Download all slides together as a ZIP archive with one click. Useful for importing slides into design tools or sharing individual slides.",
  "pdf-to-pptx": "Convert PDF pages into editable PowerPoint slides. Each PDF page becomes a movable, editable slide element. Useful for reusing existing PDF content inside a new presentation.",

  // Image Tools
  "image-converter": "Convert images between PNG, JPEG, WebP, AVIF, BMP, GIF, TIFF, and ICO formats. Batch convert up to 20 files at once for fast, bulk format switching. Download all converted results together as a ZIP archive.",
  "heic-to-jpg": "Convert iPhone HEIC photos to JPEG for universal compatibility. Supports batch conversion of multiple files in one go. The result opens in any image viewer, app, or editor without issue.",
  "heic-to-png": "Convert HEIC photos to PNG for lossless quality and broad compatibility. PNG preserves every pixel without compression artifacts. Works with individual files or multiple HEIC images at once.",
  "heic-to-webp": "Convert HEIC photos to WebP for smaller files that load fast in modern browsers. WebP matches HEIC quality at a fraction of the file size. Ideal for web publishing and social media sharing.",
  "heic-to-pdf": "Combine one or more HEIC photos into a single PDF document. Each photo appears on its own page in the output file. Useful for sharing iPhone photos with contacts who prefer PDF attachments.",
  "image-compress": "Reduce image file sizes with an adjustable quality slider. Smaller files load faster, take less storage, and are easier to attach or upload. Works with JPEG, PNG, and WebP images.",
  "image-resize": "Resize any image to exact pixel dimensions or scale by a percentage. Lock the aspect ratio to prevent distortion while resizing. Useful for preparing images for social media, web use, or email.",
  "image-crop": "Crop images with interactive drag handles directly in the browser. Choose from standard aspect ratios or draw a fully custom crop area. Download the cropped result at full resolution.",
  "image-to-pdf": "Combine one or more images into a single multi-page PDF. Each image becomes its own page in the output file. Useful for bundling photos or diagrams into one shareable document.",
  "background-remover": "Remove the background from any photo using AI. Outputs a transparent PNG ready for use in designs, presentations, or compositing. Works well with portraits, products, and isolated objects.",
  "flip-rotate-image": "Flip or rotate images by any angle. Fix sideways or upside-down photos from cameras and scanners. Download the corrected image at its original full resolution.",
  "watermark-image": "Stamp a custom text watermark on photos with full control over position, opacity, font size, and color. Useful for protecting photos from unauthorized reuse or copying. Download the watermarked result instantly.",
  "favicon-generator": "Generate favicons at every standard size from a single source image. Downloads as a ZIP containing all required icon files for the web. Covers all sizes needed for browsers, PWAs, and app stores.",
  "png-to-webp": "Convert PNG images to WebP for significantly smaller file sizes at equivalent visual quality. WebP is supported in all modern browsers and loads faster than PNG. Useful for optimizing web graphics and reducing page weight.",
  "jpg-to-webp": "Convert JPEG images to WebP for better compression at similar visual quality. WebP files are typically 25–35% smaller than JPEG at the same quality setting. Ideal for improving web performance and load times.",
  "gif-to-webp": "Convert animated GIFs to WebP, which supports animation and produces much smaller files. WebP animations load faster and use less bandwidth than GIF. Supported in all major modern browsers.",
  "bmp-to-webp": "Convert BMP images to WebP for a dramatic reduction in file size. BMP files are uncompressed; WebP adds efficient compression without visible quality loss. Useful for any web-publishing workflow.",
  "tiff-to-webp": "Convert TIFF images to WebP for web-friendly file sizes. TIFF files are large by design; WebP delivers comparable quality at a fraction of the size. Ideal for publishing high-quality images online.",
  "webp-to-png": "Convert WebP images back to PNG for apps and platforms that don't yet support WebP. PNG is lossless and universally compatible across all tools and services. Useful when sending images to print services or older software.",
  "webp-to-jpg": "Convert WebP to JPEG for maximum compatibility with apps, printers, and older systems. JPEG works everywhere and is accepted by virtually every image-related service. Useful when WebP compatibility of the destination is uncertain.",
  "webp-to-pdf": "Combine one or more WebP images into a PDF document for sharing or archiving. Each image is placed on its own page in the output. Useful for bundling web graphics into a single organized file.",
  "webp-to-avif": "Convert WebP images to AVIF for even better compression at equivalent quality. AVIF typically achieves 20–50% smaller files than WebP at similar quality settings. Supported in all major modern browsers.",
  "jpg-to-avif": "Convert JPEG images to AVIF for noticeably smaller files without visible quality loss. AVIF outperforms JPEG significantly in compression efficiency. Useful for reducing image weight on web pages and apps.",
  "png-to-avif": "Convert PNG images to AVIF for modern, efficient compression. AVIF often beats WebP on file size for both lossy and lossless modes. Supported by all current major browsers.",
  "avif-to-jpg": "Convert AVIF images to JPEG for compatibility with tools and platforms that don't yet support AVIF. JPEG works universally across all apps, printers, and services. A reliable fallback format when broad support is required.",
  "avif-to-png": "Convert AVIF images to PNG for full compatibility with software that doesn't support AVIF. PNG is lossless and accepted everywhere. Useful when working with design tools or older applications.",
  "jpg-to-png": "Convert JPEG images to PNG for lossless quality and transparency support. PNG preserves every pixel exactly and supports transparent backgrounds. Useful when editing photos in tools that require PNG input.",
  "png-to-jpg": "Convert PNG to JPEG for smaller file sizes when transparency isn't needed. JPEG compression works well for photos and complex images. A simple way to reduce file size before uploading or sharing.",
  "png-to-svg": "Wrap a PNG inside an SVG container so platforms that require SVG can accept the image. The PNG data is embedded directly inside the SVG file. Useful when a tool or CMS only accepts SVG format input.",
  "svg-to-png": "Render SVG graphics to a PNG at the exact pixel dimensions you choose. Useful for exporting icons, logos, and diagrams to a raster format. Download the PNG at any size you specify.",
  "gif-to-png": "Extract the first frame of a GIF as a still PNG image. Useful for generating a thumbnail or static preview from an animated GIF. Download the frame at the original GIF dimensions.",
  "bmp-to-jpg": "Convert BMP images to JPEG for a dramatic reduction in file size. BMP files are uncompressed; JPEG adds efficient compression with minimal visible quality loss. Useful for sharing photos by email or posting them online.",
  "tiff-to-jpg": "Convert TIFF images to JPEG for smaller, more shareable files. TIFF is excellent for archival quality; JPEG makes sharing and email attachment practical. A quick way to cut file size without losing visible detail.",
  "tiff-to-png": "Convert TIFF images to PNG for broad compatibility without quality loss. PNG is lossless and accepted by virtually all image tools and services. Useful when TIFF files are too large to share or upload directly.",
  "jpg-to-pdf": "Convert JPEG images into a PDF with each image on its own page. Multiple photos can be combined into one file at once. Useful for submitting scanned documents or photo collections as a single attachment.",
  "png-to-pdf": "Convert PNG images into a PDF at full resolution. Each image is placed on its own page in the output document. Useful for sharing diagrams, screenshots, or illustrations in a universally readable format.",

  // Privacy
  "metadata-cleaner": "Strip hidden metadata from images and documents before sharing. Removes GPS location, camera model, author name, and other embedded information. Useful before publishing photos online or sharing personal files.",
  "ai-text-scrubber": "Remove invisible characters and patterns associated with AI text detection from any piece of text. Produces a clean version that reads exactly the same but without embedded signals. Useful for text submitted to detection-sensitive contexts.",
  "checksum": "Generate and verify SHA-1, SHA-256, and SHA-512 checksums for any file. Compare checksums to confirm a downloaded file hasn't been modified or tampered with. A standard and reliable method for verifying file integrity.",

  // Text & Code
  "json-formatter": "Format messy JSON into readable, indented output with a single click. Minify it back to one line when you need compact output for an API. Validates JSON syntax and highlights any errors inline.",
  "html-formatter": "Format or minify HTML markup cleanly and consistently. Useful for reading machine-generated code or preparing markup before deploying. Preserves document structure while adding correct indentation and line breaks.",
  "base64": "Encode text or binary files to Base64 and decode Base64 strings back to their original form. Useful for embedding images in CSS, constructing data URIs, and debugging API payloads. Handles both text and binary file input.",
  "url-encoder": "Encode or decode URL components to fix broken query strings. Converts special characters to their percent-encoded equivalents and back. Useful for debugging URLs and constructing well-formed API request parameters.",
  "word-counter": "Count words, characters, sentences, and paragraphs in any block of text. Provides an estimated reading time based on average reading speed. Useful for meeting content length requirements or tracking writing output.",
  "lorem-ipsum": "Generate placeholder text for wireframes, mockups, and design layouts. Choose the number of paragraphs, sentences, or words to output. Useful for filling space in a design before real content is ready.",

  // Calculators
  "password-generator": "Generate strong, random passwords using cryptographic randomness. See the entropy score in bits so you understand exactly how strong each password is. Supports custom length and character sets including symbols, numbers, and uppercase.",
  "percentage-calc": "Calculate X% of Y, find what percentage X is of Y, or compute the percentage change between two numbers. Three calculation modes cover the most common percentage problems in one tool. Useful for discounts, tips, tax calculations, and data analysis.",
  "unit-converter": "Convert between units across 13 categories including length, weight, temperature, speed, and volume. Type a value and instantly see the result in every unit within that category. Useful for cooking, travel, science, and everyday engineering tasks.",
  "currency-converter": "Convert between currencies using live exchange rates that update every hour. Falls back to cached rates automatically if the network is unavailable. Covers a wide range of global currencies with a single, straightforward conversion step.",
  "qr-code-generator": "Generate QR codes for URLs, plain text, Wi-Fi credentials, or contact cards. Set the output size and download as a PNG at any resolution you need. Useful for print materials, business cards, and event signage.",
  "tip-calculator": "Calculate the tip and total bill split by any number of people. Enter the bill amount, tip percentage, and headcount to get per-person amounts immediately. A fast way to settle restaurant bills without mental arithmetic.",
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
          padding: isMobile ? "20px 18px" : "28px 24px",
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
          gap: 16,
          textAlign: "left",
          height: "auto",
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
          width: isMobile ? 40 : 44,
          height: isMobile ? 40 : 44,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: cat.bg,
          color: cat.color,
          flexShrink: 0,
          position: "relative",
        }}>
          <Icon size={isMobile ? 18 : 20} strokeWidth={1.6} />
        </div>

        {/* Name + badge + description — left-aligned */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{
              fontSize: isMobile ? "13px" : "15px",
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
            fontSize: isMobile ? "12px" : "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.55,
            margin: 0,
            fontFamily: "var(--font-ui)",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
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
        gap: 24,
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
                gap: 24,
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
              gap: 24,
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
              gap: 24,
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
