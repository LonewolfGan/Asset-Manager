import { Router } from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, rm, mkdir, readdir } from "fs/promises";
import { join } from "path";
import { upload } from "../../middlewares/upload.js";
import { BIN } from "../../lib/binaries.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";

const execFileAsync = promisify(execFile);
const router = Router();

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

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-ocr
// Extract text from scanned PDFs using Ghostscript + Tesseract OCR
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-ocr", defaultRateLimit, upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inputPath = join(workDir, "input.pdf");
  const langParam = String(req.body.lang ?? "eng+fra").toLowerCase();

  try {
    await writeFile(inputPath, req.file.buffer);

    // Step 1: Attempt native text extraction via Python pdfplumber / pypdf first
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
          const na = parseInt(a.replace("page-", "").replace(".png", "")) || 0;
          const nb = parseInt(b.replace("page-", "").replace(".png", "")) || 0;
          return na - nb;
        });

      if (pngPages.length === 0) {
        throw new Error("No pages could be rendered from PDF for OCR");
      }

      // Initialize Tesseract.js worker
      const { createWorker } = await import("tesseract.js");
      const tessLangs = langParam.includes("fra") && langParam.includes("eng")
        ? ["fra", "eng"]
        : langParam.includes("fra")
        ? ["fra"]
        : langParam.includes("deu")
        ? ["deu"]
        : langParam.includes("spa")
        ? ["spa"]
        : ["eng"];

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
    }

    res.json({
      text: fullText.trim(),
      totalPages: pagesText.length > 0 ? pagesText.length : 1,
      lang: langParam,
      method: ocrUsed ? "ocr" : "native",
    });
  } catch (err) {
    apiError(res, 500, "OCR_FAILED", err instanceof Error ? err.message : "PDF OCR failed");
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

export default router;
