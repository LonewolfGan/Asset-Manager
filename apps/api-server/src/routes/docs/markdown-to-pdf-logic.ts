import { marked } from "marked";
import { isGotenbergHealthy, convertHtmlWithGotenberg } from "../../lib/gotenberg.js";
import { htmlToPdfBuffer } from "../../lib/html-to-pdf.js";
import { logger } from "../../lib/logger.js";

/**
 * Wraps raw HTML in a complete HTML5 document with an editorial-grade GitHub print stylesheet.
 */
export function buildMarkdownHtmlDocument(rawHtml: string, title?: string): string {
  const docTitle = title && title.trim() ? title.trim() : "Document";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(docTitle)}</title>
  <style>
    @page { size: A4; margin: 20mm 15mm; }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #24292f;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      line-height: 1.25;
      color: #1f2328;
      page-break-after: avoid;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    p, ul, ol, dl, table, blockquote, pre {
      margin-top: 0;
      margin-bottom: 16px;
    }
    a { color: #0969da; text-decoration: none; }
    code {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
      font-size: 85%;
      background-color: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 6px;
    }
    pre {
      background-color: #f6f8fa;
      border-radius: 6px;
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      page-break-inside: avoid;
    }
    pre code {
      background: transparent;
      padding: 0;
      border-radius: 0;
      font-size: 100%;
    }
    blockquote {
      margin: 0 0 16px;
      padding: 0 1em;
      color: #57606a;
      border-left: 0.25em solid #d0d7de;
      page-break-inside: avoid;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    table th, table td {
      padding: 6px 13px;
      border: 1px solid #d0d7de;
    }
    table th {
      font-weight: 600;
      background-color: #f6f8fa;
    }
    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
    img {
      max-width: 100%;
      height: auto;
      page-break-inside: avoid;
    }
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: #d0d7de;
      border: 0;
    }
  </style>
</head>
<body>
${rawHtml}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Render Markdown to PDF Buffer using Gotenberg Chromium with automatic fallback to PDFKit.
 */
export async function renderMarkdownToPdfBuffer(
  markdownText: string,
  title?: string,
): Promise<Buffer> {
  const rawHtml = await marked(markdownText);
  const sanitizedHtml = String(rawHtml).replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );
  const fullHtml = buildMarkdownHtmlDocument(sanitizedHtml, title);

  if (await isGotenbergHealthy()) {
    try {
      return await convertHtmlWithGotenberg(fullHtml);
    } catch (err) {
      logger.warn({ err }, "Gotenberg Chromium markdown rendering failed, falling back to PDFKit");
      return await htmlToPdfBuffer(fullHtml);
    }
  }

  return await htmlToPdfBuffer(fullHtml);
}
