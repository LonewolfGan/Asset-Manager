import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, rm, mkdir, readdir } from "fs/promises";
import { join } from "path";
import { BIN } from "../../lib/binaries.js";

const execFileAsync = promisify(execFile);

export interface OcrResult {
  text: string;
  totalPages: number;
  lang: string;
  method: "ocr" | "native";
}

export interface OcrOptions {
  lang?: string;
}

export function resolveTesseractLanguages(langParam: string): string[] {
  const clean = langParam.toLowerCase();
  const langs = new Set<string>();
  if (clean.includes("fra") || clean.includes("fre") || clean.includes("fr")) langs.add("fra");
  if (clean.includes("deu") || clean.includes("ger") || clean.includes("de")) langs.add("deu");
  if (clean.includes("spa") || clean.includes("es")) langs.add("spa");
  if (clean.includes("eng") || clean.includes("en") || langs.size === 0) langs.add("eng");
  return Array.from(langs);
}

function assertValidPdfBuffer(buffer: Buffer): void {
  if (!buffer || buffer.length === 0 || !buffer.subarray(0, 5).toString("ascii").startsWith("%PDF-")) {
    throw new Error("Empty or invalid PDF buffer provided");
  }
}

export async function extractPdfTextWithPython(
  pdfPath: string,
): Promise<{ pageNum: number; text: string }[]> {
  try {
    const { stdout } = await execFileAsync(
      BIN.python3,
      [
        "-c",
        `import sys, json, pypdf
try:
    reader = pypdf.PdfReader(sys.argv[1])
    results = []
    for idx, page in enumerate(reader.pages):
        txt = (page.extract_text() or "").strip()
        results.append({"pageNum": idx + 1, "text": txt})
    print(json.dumps(results))
except Exception:
    print(json.dumps([]))`,
        pdfPath,
      ],
      { timeout: 30_000, maxBuffer: 10 * 1024 * 1024 },
    );
    return JSON.parse(stdout.trim());
  } catch {
    return [];
  }
}

export async function performPdfOcr(
  pdfBuffer: Buffer,
  options: OcrOptions = {},
): Promise<OcrResult> {
  assertValidPdfBuffer(pdfBuffer);

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inputPath = join(workDir, "input.pdf");
  const langParam = String(options.lang ?? "eng+fra").toLowerCase().trim();

  try {
    await writeFile(inputPath, pdfBuffer);

    // Step 1: Attempt native text extraction via Python pypdf first
    const pagesText = await extractPdfTextWithPython(inputPath);

    // Check if pages need OCR (scanned pages or sparse text)
    const needsOcr = pagesText.length === 0 || pagesText.some((p) => p.text.length < 15);

    let fullText = "";
    let ocrUsed = false;

    if (!needsOcr && pagesText.length > 0) {
      // Native text is fully available
      fullText = pagesText
        .map((p) => `--- Page ${p.pageNum} ---\n${p.text}`)
        .join("\n\n");
    } else {
      // OCR required for scanned pages
      ocrUsed = true;

      // Render pages as 200 DPI PNGs via Ghostscript
      const pagePattern = join(workDir, "page-%d.png");
      await execFileAsync(
        BIN.gs,
        [
          "-dNOPAUSE", "-dBATCH", "-dSAFER",
          "-sDEVICE=png16m",
          "-r200",
          `-sOutputFile=${pagePattern}`,
          inputPath,
        ],
        { timeout: 120_000 },
      );

      const files = await readdir(workDir);
      const pngPages = files
        .filter((f) => /^page-\d+\.png$/.test(f))
        .sort((a, b) => {
          const na = parseInt(a.replace("page-", "").replace(".png", ""), 10) || 0;
          const nb = parseInt(b.replace("page-", "").replace(".png", ""), 10) || 0;
          return na - nb;
        });

      if (pngPages.length === 0) {
        throw new Error("No pages could be rendered from PDF for OCR");
      }

      const pngPagesCount = pngPages.length;

      // Initialize Tesseract.js worker
      const { createWorker } = await import("tesseract.js");
      const tessLangs = resolveTesseractLanguages(langParam);

      let worker: any = null;
      try {
        worker = await createWorker(tessLangs);

        for (let i = 0; i < Math.min(pngPages.length, 30); i++) {
          const pageNum = i + 1;
          const existing = pagesText.find((p) => p.pageNum === pageNum);

          if (existing && existing.text.length >= 50) {
            // High confidence native text
            fullText += `--- Page ${pageNum} ---\n` + existing.text + "\n\n";
          } else {
            // OCR image
            const pageFile = join(workDir, pngPages[i]);
            try {
              const { data } = await worker.recognize(pageFile);
              fullText += `--- Page ${pageNum} ---\n` + data.text.trim() + "\n\n";
            } catch {
              fullText += `--- Page ${pageNum} ---\n${existing?.text ?? "[OCR text not recognized]"}\n\n`;
            }
          }
        }
      } finally {
        if (worker) {
          await worker.terminate().catch(() => {});
        }
      }

      return {
        text: fullText.trim(),
        totalPages: pagesText.length > 0 ? pagesText.length : (pngPagesCount || 1),
        lang: langParam,
        method: "ocr",
      };
    }

    return {
      text: fullText.trim(),
      totalPages: pagesText.length > 0 ? pagesText.length : 1,
      lang: langParam,
      method: "native",
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}
