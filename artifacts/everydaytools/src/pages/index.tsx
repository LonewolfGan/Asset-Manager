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
  "pdf-to-word": "Got a PDF you need to actually edit? Drop it in and get a proper Word document back, with your text, headings, and layout intact. Works well for contracts, reports, and anything you've been stuck copying and pasting by hand.",
  "pdf-to-text": "Sometimes you just need the words. No boxes, no columns, no formatting getting in the way. Paste the text wherever you need it, or save it as a plain .txt file.",
  "pdf-to-html": "Converts your PDF into real HTML you can drop straight into a web page or CMS. The output uses clean semantic tags rather than a pile of divs, so it's actually useful. Good for repurposing reports, manuals, or anything you want online.",
  "pdf-to-epub": "Turn any PDF into an EPUB that reads properly on phones, tablets, and e-readers. PDFs on small screens are miserable; EPUBs reflow the text to fit. Worth trying if you have long documents you want to read comfortably.",
  "pdf-compress": "Cuts PDF file sizes down without making them look noticeably worse. Useful when a file is too big to email, or when you're uploading to a form with a size limit. No quality settings to fiddle with.",
  "pdf-merge": "Drag in two or more PDFs and get one combined file back in the order you dropped them. Handy for assembling reports, contracts with attachments, or scanning jobs that came out as separate files.",
  "pdf-split": "Pull out specific pages or split a big PDF into smaller chunks. If you only need pages 5-12 of a 40-page document, this saves you from sending the whole thing or trying to print select pages.",
  "pdf-rotate": "Fixes pages that came out sideways from a scanner or a camera photo. Rotate one page or every page at once. You can mix rotations if different pages need different fixes.",
  "pdf-unlock": "Removes the password restriction from a PDF so you can open, print, or copy from it normally. You'll need the current password to do this. It's not a bypass, just a way to strip the lock off once you're done needing it.",
  "pdf-protect": "Adds a password to any PDF so it can't be opened without it. Good for sensitive documents you're emailing to someone specific, or anything you want to store securely.",
  "pdf-page-numbers": "Stamps page numbers onto every page of your PDF. You can choose the position, font size, and starting number. Useful for documents that go to print or anywhere readers need to navigate by page.",
  "pdf-watermark": "Adds a text watermark across the pages of your PDF. Handy for marking something as DRAFT, CONFIDENTIAL, or with your name before sharing it. You control the text, opacity, and angle.",
  "pdf-to-image": "Exports each page of your PDF as a PNG or JPEG image. Useful when you need to share a page as a screenshot, embed it in a presentation, or post it somewhere that doesn't accept PDFs.",
  "pdf-to-excel": "Finds tables in your PDF and converts them into a real spreadsheet with editable cells. Works best on PDFs with clean, structured tables. Scanned tables with OCR are trickier but often come out usable.",
  "reorder-pdf": "Drag your PDF pages into any order, delete the ones you don't need, and download the result. Useful after scanning a stack of pages in the wrong sequence, or when building a document from multiple sources.",
  "ocr": "Turns a scanned image or photo of text into real, selectable, copyable text. Works on photos taken with your phone, scanned documents, screenshots of text, basically anything that looks like words but isn't. Processing happens on your device.",

  // Word & Docs
  "word-to-pdf": "Converts a Word document to PDF and keeps the formatting as-is. Fonts, spacing, tables, headers, all of it. Much more reliable than printing to PDF from Word, especially if you're on a different machine than where the file was made.",
  "word-to-text": "Strips styles, formatting, and tracked changes out of a DOCX and gives you back the raw text. Good for pasting into another tool without dragging along hidden formatting, or for feeding text into a script.",
  "word-to-html": "Converts your Word document into clean HTML. The output skips the bloated Microsoft markup and gives you something you'd actually write yourself. Proper headings, paragraphs, and lists. Ready to paste into a CMS or code editor.",
  "word-to-epub": "Turns your Word document into an EPUB file you can load onto a Kindle, Kobo, or reading app. The text reflows to fit the screen properly, unlike a PDF. Useful for anything long-form you want to read on a device.",
  "word-to-markdown": "Converts your Word document to Markdown, keeping headings, bold, italic, lists, and links. Saves a lot of manual reformatting if you write in Word but need to publish in a Markdown-based system like GitHub, Hugo, or Notion.",
  "html-to-markdown": "Takes any HTML and strips it down to clean Markdown. Good for migrating content from a website, or when you've gotten HTML from a rich text editor and need something human-readable. Keeps the structure, drops the tags.",
  "markdown-to-pdf": "Renders your Markdown into a properly formatted PDF with real headings, code blocks, and paragraphs. Better than copying into a word processor and fighting with styles. Works well for READMEs, documentation, or notes you want to share.",
  "markdown-to-docx": "Converts Markdown files into Word documents. Headings become proper heading styles, bold stays bold, lists stay lists. Useful when you've written something in Markdown but need to hand it off to someone who lives in Word.",
  "html-to-pdf": "Renders HTML into a PDF, including styles. Paste a snippet or a full page and download a clean PDF. Useful for capturing web content, generating reports from HTML templates, or archiving pages that might change.",
  "txt-to-pdf": "Takes a plain text file and wraps it in a clean PDF document with proper margins and line spacing. Good for sharing notes, logs, or anything written in a text editor that you want to look a bit more presentable.",
  "txt-to-docx": "Converts plain text files into proper Word documents you can format, edit, and share. If you've been writing in a text editor and need to hand something off as a DOCX, this is the fastest path.",

  // Excel & Spreadsheets
  "excel-to-pdf": "Converts your Excel spreadsheet to PDF while keeping tables, formatting, and charts exactly as they look in the spreadsheet. Good for sharing data with people who shouldn't be able to edit it, or for archiving a snapshot of a file.",
  "excel-to-csv": "Exports your Excel sheet as a plain CSV file that any tool, database, or script can read. Strips out the Excel-specific stuff and gives you just the data. Works on any sheet in the workbook.",
  "csv-to-excel": "Takes a CSV file and turns it into a proper Excel spreadsheet with formatted columns and cells. Saves you from importing manually or fighting with the text-import wizard. Drop it in and download the XLSX.",
  "csv-to-json": "Converts CSV data to JSON, or JSON back to CSV. Useful when one tool expects CSV and another expects JSON, or when you're preparing data for an API. Handles nested fields and arrays where the format allows.",
  "csv-viewer": "Opens and displays a CSV file in a clean, sortable table. No spreadsheet app required. Useful for quickly checking what's in a file before importing it somewhere.",

  // PowerPoint
  "pptx-to-pdf": "Converts PowerPoint presentations to PDF so anyone can open them without needing PowerPoint installed. Slides come out as they look in the presentation, with fonts, layouts, and images intact.",
  "pptx-to-images": "Exports every slide from your PowerPoint file as a separate PNG image and packages them in a ZIP. Handy when you need to use slides in a design tool, post them as images, or include them in a document.",
  "pdf-to-pptx": "Turns PDF pages into PowerPoint slides you can actually edit. Each page becomes a slide with the content placed as editable elements. Useful for repurposing presentations that only exist as PDFs.",

  // Image Tools
  "image-converter": "Converts images between PNG, JPEG, WebP, AVIF, BMP, GIF, TIFF, ICO, and SVG. You can convert up to 20 files at once and download the results as a ZIP. All conversion happens in the browser.",
  "heic-to-jpg": "Converts iPhone HEIC photos to JPEG so they open on Windows, Android, and anywhere else that doesn't support Apple's format. Drag in multiple files and download them all at once.",
  "heic-to-png": "Converts HEIC photos to PNG for lossless quality with wide compatibility. Good when you want to keep the image quality high and still share the file without HEIC compatibility headaches.",
  "heic-to-webp": "Converts HEIC photos to WebP format, which is well-supported in modern browsers and gives you smaller file sizes than JPEG. Good for web use when you're starting with iPhone photos.",
  "heic-to-pdf": "Combines one or more HEIC photos into a single PDF document. Useful for sharing photos from your iPhone in a format anyone can open without needing a special viewer.",
  "image-compress": "Reduces image file sizes without making the quality loss obvious. Good for shrinking photos before uploading to a website, emailing, or submitting to a form with a file size limit.",
  "image-resize": "Resizes images to a specific width and height in pixels, or scales them by percentage. You can lock the aspect ratio to avoid distortion. Works on single images or a batch.",
  "image-crop": "Crops images to a specific area using drag handles in the browser. You can use preset aspect ratios like 1:1, 16:9, or 4:3, or set a custom crop area. What you see is what you get.",
  "image-to-pdf": "Takes one or more images and combines them into a single PDF document. Useful for sending a batch of photos as one attachment, or for assembling scanned pages into a readable document.",
  "background-remover": "Removes the background from any photo using AI that runs entirely on your device. Works on portraits, product shots, and most images with a reasonably distinct subject.",
  "flip-rotate-image": "Flips images horizontally or vertically, or rotates them by any angle. Fixes photos that came out sideways from a camera or a scan, or mirrors images for design purposes.",
  "watermark-image": "Stamps your photos with a custom text watermark. You choose the text, position, opacity, and size. Good for protecting photos you're sharing online or marking work as your own.",
  "favicon-generator": "Takes an image and generates favicons in all the standard sizes web browsers and devices expect. Downloads as a ZIP with every size included: 16x16, 32x32, 180x180, and more.",
  "png-to-webp": "Converts PNG images to WebP format for smaller file sizes with the same visual quality. WebP is supported in all modern browsers and is the standard choice for web images now.",
  "jpg-to-webp": "Converts JPEG images to WebP, which gives better compression at similar quality levels. Useful when optimizing images for a website and you want to cut down on load times.",
  "gif-to-webp": "Converts GIF files to WebP, which supports animation and delivers much smaller file sizes. Most modern browsers handle WebP animations natively.",
  "bmp-to-webp": "Converts BMP files, a format that's large and rarely needed today, to WebP for practical use on the web.",
  "tiff-to-webp": "Converts TIFF images, common in photography and print work, to WebP for web-friendly delivery.",
  "webp-to-png": "Converts WebP images back to PNG when you need a format that older tools, apps, or systems still expect.",
  "webp-to-jpg": "Converts WebP images to JPEG for maximum compatibility with apps, printers, and systems that haven't caught up with WebP yet.",
  "webp-to-pdf": "Converts one or more WebP images into a PDF document. Useful for combining web images into something you can send or archive as a single file.",
  "webp-to-avif": "Converts WebP images to AVIF, which gets even better compression ratios at equivalent visual quality. Worth trying if file size is a priority and you're targeting modern browsers.",
  "jpg-to-avif": "Converts JPEG photos to AVIF format for noticeably smaller files without visible quality loss. AVIF is now supported in Chrome, Firefox, and Safari.",
  "png-to-avif": "Converts PNG images to AVIF, which handles both lossy and lossless compression and often beats WebP on file size.",
  "avif-to-jpg": "Converts AVIF images to JPEG when you need something that works everywhere, not just in modern browsers.",
  "avif-to-png": "Converts AVIF images to PNG for full compatibility with apps and tools that don't yet support the AVIF format.",
  "jpg-to-png": "Converts JPEG images to PNG for lossless quality and transparency support. Useful when you're editing an image and don't want any additional compression artifacts.",
  "png-to-jpg": "Converts PNG images to JPEG for smaller file sizes. Gives up transparency and lossless quality, but fine for photos where those aren't needed.",
  "png-to-svg": "Wraps your PNG image inside an SVG container. Useful for situations where SVG is required by a tool or platform but you're starting with a raster image.",
  "svg-to-png": "Renders SVG vector graphics to a PNG image at the pixel dimensions you specify. Handy when you need a raster version of an icon or illustration for use in places that don't support SVG.",
  "gif-to-png": "Extracts the first frame of a GIF as a still PNG image. Useful when you want a thumbnail or preview from an animated GIF.",
  "bmp-to-jpg": "Converts BMP files to JPEG to get the file size down to something reasonable for sharing or storing.",
  "tiff-to-jpg": "Converts TIFF images to JPEG, reducing file size for easier sharing online or by email.",
  "tiff-to-png": "Converts TIFF images to PNG for good compatibility without losing quality.",
  "jpg-to-pdf": "Converts a JPEG image into a PDF document. You can combine multiple images into one PDF, which is useful for sending several photos as a single, tidy file.",
  "png-to-pdf": "Converts PNG images into a PDF document, either individually or combined into one file. The image quality is preserved without recompression.",

  // Privacy
  "metadata-cleaner": "Strips hidden metadata from images and documents, including GPS location, camera model, creation date, author name, and more. Worth doing before sharing files publicly, especially photos taken on your phone.",
  "ai-text-scrubber": "Removes invisible Unicode characters and zero-width characters that AI-detection tools look for, and evens out the kind of statistical patterns that make text look machine-generated. Run your text through and get something that reads like you wrote it.",
  "checksum": "Generates and verifies SHA-1, SHA-256, and SHA-512 checksums for any file. Paste in an expected checksum to confirm a download hasn't been tampered with.",

  // Text & Code
  "json-formatter": "Formats messy JSON into something readable, or minifies it back down for production. Also validates your JSON and highlights any errors with a clear error message. Paste in anything from a log dump to an API response.",
  "html-formatter": "Formats unindented or compressed HTML into clean, readable markup, or minifies it for deployment. Handles nested elements and attributes without mangling the structure.",
  "base64": "Encodes text or files to Base64 and decodes Base64 strings back to their original form. Useful for embedding images in CSS, working with data URIs, or debugging encoded API payloads.",
  "url-encoder": "Encodes special characters in URL strings so they work properly in links and query parameters, and decodes them back to readable text. Handy when building or debugging URLs with dynamic parameters.",
  "word-counter": "Counts words, characters (with and without spaces), sentences, and paragraphs, and estimates reading time. Good for checking against word limits in articles, essays, or submission forms.",
  "lorem-ipsum": "Generates placeholder text for mockups and design prototypes in any quantity. Paragraphs, sentences, or words. The output is the classic Lorem Ipsum that designers and developers have been using for decades.",

  // Calculators
  "password-generator": "Generates strong passwords using your browser's built-in cryptographic random number generator. You can see the entropy score update in real time as you adjust the length and character set, so you know exactly how strong your password is.",
  "percentage-calc": "Handles the percentage calculations that always trip people up. What is X% of Y, what percentage is X of Y, what's the percentage change between two numbers. Gives you the answer and shows the formula.",
  "unit-converter": "Converts between units across 13 categories including length, weight, temperature, pressure, speed, data, and more. Covers both common and obscure units, from miles to light-years, from bytes to petabytes.",
  "currency-converter": "Converts between currencies using live exchange rates that refresh automatically. Rates are cached for an hour so you're not hitting a limit. Falls back to static rates if the network isn't available.",
  "qr-code-generator": "Generates QR codes for URLs, plain text, Wi-Fi credentials, or contact cards. Download the result as a PNG at whatever size you need. Everything generates instantly in the browser.",
  "tip-calculator": "Works out the tip and splits the total across any number of people. Enter the bill, pick a tip percentage, say how many people are sharing and it tells you what each person owes.",
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
        gap: 12,
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
                gap: 12,
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
              gap: 12,
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
              gap: 12,
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
