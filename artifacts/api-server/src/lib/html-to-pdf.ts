import PDFDocument from "pdfkit";

interface Block {
  type:
    | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    | "p" | "li_bullet" | "li_number"
    | "code" | "quote" | "hr"
    | "table_header" | "table_row";
  text: string;
  cells?: string[];
  listIndex?: number;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function stripTags(html: string): string {
  return decodeEntities(
    html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
  )
    .replace(/\s+/g, " ")
    .trim();
}

// Extracts top-level block elements in source order, nesting-aware
function extractTopLevel(html: string): Array<{ tag: string; content: string }> {
  const result: Array<{ tag: string; content: string }> = [];
  const BLOCK_TAGS = "h[1-6]|p|ul|ol|table|pre|blockquote|hr|div";
  const tagOpen = new RegExp(`<(${BLOCK_TAGS})([^>]*)>`, "i");

  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf("<", i);
    if (lt === -1) break;

    // Self-closing hr
    const hrMatch = html.slice(lt).match(/^<hr[^>]*\/?>/i);
    if (hrMatch) {
      result.push({ tag: "hr", content: "" });
      i = lt + hrMatch[0].length;
      continue;
    }

    const openMatch = html.slice(lt).match(tagOpen);
    if (!openMatch) { i = lt + 1; continue; }

    const tagName = openMatch[1].toLowerCase();
    const openLen = openMatch[0].length;
    const closeStr = `</${tagName}>`;
    const openRe = new RegExp(`<${tagName}[^>]*>`, "gi");

    let depth = 1;
    let pos = lt + openLen;

    while (depth > 0 && pos < html.length) {
      const nextClose = html.indexOf(closeStr, pos);
      if (nextClose === -1) { pos = html.length; break; }

      const segment = html.slice(pos, nextClose);
      const nestedOpens = (segment.match(openRe) || []).length;
      depth += nestedOpens - 1;

      if (depth <= 0) {
        result.push({ tag: tagName, content: html.slice(lt + openLen, nextClose) });
        i = nextClose + closeStr.length;
        break;
      }
      pos = nextClose + closeStr.length;
    }
    if (depth > 0) i = lt + 1;
  }
  return result;
}

export function parseHtmlToBlocks(html: string): Block[] {
  const blocks: Block[] = [];

  html = html.replace(/<(script|style|head)[^>]*>[\s\S]*?<\/\1>/gi, "");
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/\r\n?/g, "\n");

  const topLevel = extractTopLevel(html);

  for (const { tag, content } of topLevel) {
    if (tag === "hr") {
      blocks.push({ type: "hr", text: "" });
      continue;
    }

    if (/^h[1-6]$/.test(tag)) {
      const text = stripTags(content);
      if (text) blocks.push({ type: tag as Block["type"], text });
      continue;
    }

    if (tag === "p" || tag === "div") {
      const text = stripTags(content);
      if (text) blocks.push({ type: "p", text });
      continue;
    }

    if (tag === "pre") {
      const text = stripTags(content);
      if (text) blocks.push({ type: "code", text });
      continue;
    }

    if (tag === "blockquote") {
      const text = stripTags(content);
      if (text) blocks.push({ type: "quote", text });
      continue;
    }

    if (tag === "ul") {
      const items = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
      for (const [, item] of items) {
        const text = stripTags(item);
        if (text) blocks.push({ type: "li_bullet", text });
      }
      continue;
    }

    if (tag === "ol") {
      const items = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
      items.forEach(([, item], idx) => {
        const text = stripTags(item);
        if (text) blocks.push({ type: "li_number", text, listIndex: idx + 1 });
      });
      continue;
    }

    if (tag === "table") {
      const rows = [...content.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      let isFirst = true;
      for (const [, rowHtml] of rows) {
        const hasHeader = /<th/i.test(rowHtml);
        const cells = [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(
          ([, c]) => stripTags(c).slice(0, 100)
        );
        if (cells.length) {
          blocks.push({
            type: isFirst && hasHeader ? "table_header" : "table_row",
            text: cells.join(" | "),
            cells,
          });
          isFirst = false;
        }
      }
    }
  }

  return blocks;
}

export async function blocksToPdf(blocks: Block[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      margin: 60,
      size: "A4",
      info: { Producer: "EverydayTools Hub" },
    });

    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const margins = 60;
    let prevType = "";

    function spacing(cur: Block["type"]) {
      if (!prevType) return;
      const isHeading = /^h[1-6]$/.test(cur);
      const wasHeading = /^h[1-6]$/.test(prevType);
      if (isHeading) doc.moveDown(0.8);
      else if (wasHeading) doc.moveDown(0.3);
      else if (cur === "hr" || prevType === "hr") doc.moveDown(0.3);
      else if (cur === "code" || prevType === "code") doc.moveDown(0.4);
      else doc.moveDown(0.3);
    }

    for (const block of blocks) {
      spacing(block.type);
      prevType = block.type;

      switch (block.type) {
        case "h1":
          doc.fontSize(22).font("Helvetica-Bold").text(block.text, { lineGap: 3 });
          break;
        case "h2":
          doc.fontSize(18).font("Helvetica-Bold").text(block.text, { lineGap: 3 });
          break;
        case "h3":
          doc.fontSize(15).font("Helvetica-Bold").text(block.text, { lineGap: 2 });
          break;
        case "h4":
        case "h5":
        case "h6":
          doc.fontSize(13).font("Helvetica-Bold").text(block.text, { lineGap: 2 });
          break;
        case "p":
          doc.fontSize(11).font("Helvetica").text(block.text, { align: "justify", lineGap: 3 });
          break;
        case "li_bullet":
          doc.fontSize(11).font("Helvetica").text(`\u2022  ${block.text}`, {
            indent: 16,
            lineGap: 2,
          });
          break;
        case "li_number":
          doc.fontSize(11).font("Helvetica").text(`${block.listIndex}.  ${block.text}`, {
            indent: 16,
            lineGap: 2,
          });
          break;
        case "code":
          doc.fontSize(9).font("Courier").text(block.text, { lineGap: 1 });
          break;
        case "quote":
          doc.fontSize(11).font("Helvetica-Oblique").text(block.text, {
            indent: 20,
            lineGap: 3,
          });
          break;
        case "hr":
          doc.moveDown(0.2);
          doc
            .lineWidth(0.5)
            .moveTo(margins, doc.y)
            .lineTo(doc.page.width - margins, doc.y)
            .stroke("#bbbbbb");
          doc.moveDown(0.2);
          break;
        case "table_header": {
          const cells = block.cells ?? [block.text];
          const headerText = cells.join("   |   ");
          doc.fontSize(10).font("Helvetica-Bold").text(headerText, { lineGap: 2 });
          const y = doc.y;
          doc.lineWidth(1).moveTo(margins, y).lineTo(doc.page.width - margins, y).stroke("#333333");
          doc.y = y + 3;
          break;
        }
        case "table_row": {
          const cells = block.cells ?? [block.text];
          const rowText = cells.join("   |   ");
          doc.fontSize(9).font("Helvetica").text(rowText, { lineGap: 1 });
          break;
        }
      }
    }

    doc.end();
  });
}

export async function htmlToPdfBuffer(html: string): Promise<Buffer> {
  const blocks = parseHtmlToBlocks(html);
  return blocksToPdf(blocks);
}
