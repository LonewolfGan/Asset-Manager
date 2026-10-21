import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile, rm, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { BIN, getPythonScriptPath } from "../lib/binaries.js";

const execFileAsync = promisify(execFile);

describe("Python Worker: pdf_to_markdown.py", () => {
  it("converts a PDF file to markdown via CLI", async () => {
    const workDir = join(tmpdir(), "pdf-to-md-test-" + randomUUID());
    await mkdir(workDir, { recursive: true });

    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const page = doc.addPage([400, 400]);
      page.drawText("# Hello PyMuPDF4LLM", { x: 50, y: 350, size: 14, font });
      const pdfBytes = await doc.save();

      const inputPdf = join(workDir, "input.pdf");
      const outputMd = join(workDir, "output.md");
      await writeFile(inputPdf, Buffer.from(pdfBytes));

      const scriptPath = getPythonScriptPath("pdf_to_markdown.py");
      await execFileAsync(BIN.python3, [scriptPath, "--pdf", inputPdf, "--output", outputMd]);

      const content = await readFile(outputMd, "utf-8");
      assert.ok(content.length > 0, "Output markdown should not be empty");
      assert.match(content, /Hello PyMuPDF4LLM/);
    } finally {
      await rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
  });
});
