import { Router, type Request, type Response } from "express";
import mammoth from "mammoth";
import { marked } from "marked";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { BIN, getPythonScriptPath } from "../../lib/binaries.js";
import { apiError } from "../../lib/errors.js";

const execFileAsync = promisify(execFile);
const router = Router();

// ─────────────────────────────────────────────────────────
// POST /convert/txt-to-docx
// ─────────────────────────────────────────────────────────
router.post("/convert/txt-to-docx", defaultRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  let textContent = "";
  let filename = "document.docx";

  if (req.file) {
    textContent = req.file.buffer.toString("utf-8");
    filename = (req.file.originalname ?? "document").replace(/\.txt$/i, "") + ".docx";
  } else if (typeof req.body?.text === "string") {
    textContent = req.body.text as string;
  } else {
    apiError(res, 400, "MISSING_FILE", "Provide a .txt file upload or a text body field");
    return;
  }

  if (textContent.length > 1_000_000) {
    apiError(res, 413, "FILE_TOO_LARGE", "Text too large. Maximum 1,000,000 characters.");
    return;
  }

  try {
    const paragraphs = textContent.split("\n").map(
      (line) => new Paragraph({ children: [new TextRun(line)], spacing: { after: 80 } }),
    );
    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    const buffer = await Packer.toBuffer(doc);
    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "TXT to DOCX failed");
  }
});

const headingMap: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
  5: HeadingLevel.HEADING_5,
  6: HeadingLevel.HEADING_6,
};

export function markdownToDocxParagraphs(markdown: string): InstanceType<typeof Paragraph>[] {
  const tokens = marked.lexer(markdown);
  const paragraphs: InstanceType<typeof Paragraph>[] = [];

  for (const token of tokens) {
    if (token.type === "heading") {
      paragraphs.push(
        new Paragraph({
          heading: headingMap[token.depth] ?? HeadingLevel.HEADING_1,
          children: [new TextRun({ text: token.text, bold: true })],
          spacing: { before: 120, after: 60 },
        }),
      );
    } else if (token.type === "paragraph") {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(token.text)],
          spacing: { after: 80 },
        }),
      );
    } else if (token.type === "list") {
      for (const item of token.items) {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun(item.text)],
            spacing: { after: 40 },
          }),
        );
      }
    } else if (token.type === "code") {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: token.text, font: "Courier New" })],
          spacing: { after: 80 },
        }),
      );
    } else if (token.type === "blockquote") {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: token.text, italics: true })],
          spacing: { after: 80 },
        }),
      );
    }
  }

  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({ children: [new TextRun("")] }));
  }

  return paragraphs;
}

// ─────────────────────────────────────────────────────────
// POST /convert/markdown-to-docx
// ─────────────────────────────────────────────────────────
router.post("/convert/markdown-to-docx", defaultRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  let markdown = "";
  let filename = "document.docx";

  if (req.file) {
    markdown = req.file.buffer.toString("utf-8");
    filename = (req.file.originalname ?? "document").replace(/\.(md|markdown|txt)$/i, "") + ".docx";
  } else if (typeof req.body?.markdown === "string") {
    markdown = req.body.markdown as string;
  } else {
    apiError(res, 400, "MISSING_FILE", "Provide a markdown file or a markdown body field");
    return;
  }

  if (markdown.length > 1_000_000) {
    apiError(res, 413, "FILE_TOO_LARGE", "Markdown too large. Maximum 1,000,000 characters.");
    return;
  }

  try {
    const paragraphs = markdownToDocxParagraphs(markdown);
    const doc = new Document({ sections: [{ children: paragraphs }] });
    const buffer = await Packer.toBuffer(doc);
    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Markdown to DOCX failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/word-to-markdown
// ─────────────────────────────────────────────────────────
router.post("/convert/word-to-markdown", defaultRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  const mime = req.file.mimetype;
  const isDocx = mime.includes("wordprocessingml") || mime.includes("msword") ||
    /\.docx?$/i.test(req.file.originalname ?? "");
  if (!isDocx) { apiError(res, 415, "UNSUPPORTED_TYPE", "Please upload a .docx or .doc file"); return; }
  if (req.file.size > 30 * 1024 * 1024) { apiError(res, 413, "FILE_TOO_LARGE", "File too large. Maximum 30 MB."); return; }

  try {
    const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
    const TurndownService = (await import("turndown")).default;
    const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
    const markdown = td.turndown(result.value);
    const baseName = (req.file.originalname ?? "document").replace(/\.docx?$/i, "");
    res.set({
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${baseName}.md"`,
      "Cache-Control": "no-store",
    });
    res.send(markdown);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Word to Markdown failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-markdown
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-markdown", defaultRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  if (req.file.mimetype !== "application/pdf" && !req.file.originalname?.match(/\.pdf$/i)) {
    apiError(res, 415, "UNSUPPORTED_TYPE", "Please upload a PDF file");
    return;
  }

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const pdfPath = join(workDir, "input.pdf");

  try {
    await writeFile(pdfPath, req.file.buffer);
    const pdfExtractScript = getPythonScriptPath("pdf_extract.py");
    const { stdout } = await execFileAsync(
      BIN.python3,
      [pdfExtractScript, "--pdf", pdfPath, "--mode", "text"],
      { timeout: 120_000, maxBuffer: 50 * 1024 * 1024 },
    );
    const extracted = JSON.parse(stdout) as { text?: string; error?: string };
    if (extracted.error) throw new Error(extracted.error);

    const baseName = (req.file.originalname ?? "document").replace(/\.pdf$/i, "");
    const rawText = extracted.text ?? "";

    res.set({
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${baseName}.md"`,
      "Cache-Control": "no-store",
    });
    res.send(rawText);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "PDF to Markdown failed");
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

export default router;
