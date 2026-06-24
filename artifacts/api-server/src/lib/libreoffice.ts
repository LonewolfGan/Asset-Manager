/**
 * LibreOffice headless conversion utilities.
 * Spawns soffice with an isolated per-request UserInstallation to avoid
 * profile conflicts when multiple requests run concurrently.
 */
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, readdir, rm, mkdir } from "fs/promises";
import { join } from "path";

const execFileAsync = promisify(execFile);
const LO_TIMEOUT_MS = 120_000;

function loWorkDir(id: string) { return join(tmpdir(), `lo-work-${id}`); }
function loProfileDir(id: string) { return join(tmpdir(), `lo-profile-${id}`); }

/**
 * Convert a single document to a single output format.
 * LibreOffice writes `input.<targetFormat>` into the workDir.
 */
export async function convertWithLibreOffice(
  inputBuffer: Buffer,
  inputExt: string,
  targetFormat: string,
): Promise<Buffer> {
  const id = randomUUID();
  const workDir = loWorkDir(id);
  const profileDir = loProfileDir(id);
  await mkdir(workDir, { recursive: true });
  const inputPath = join(workDir, `input.${inputExt}`);
  await writeFile(inputPath, inputBuffer);

  try {
    await execFileAsync(
      "soffice",
      [
        "--headless",
        "--norestore",
        `-env:UserInstallation=file://${profileDir}`,
        "--convert-to", targetFormat,
        "--outdir", workDir,
        inputPath,
      ],
      { timeout: LO_TIMEOUT_MS },
    );

    const outputPath = join(workDir, `input.${targetFormat}`);
    return await readFile(outputPath);
  } finally {
    await Promise.all([
      rm(workDir, { recursive: true, force: true }),
      rm(profileDir, { recursive: true, force: true }),
    ]).catch(() => {});
  }
}

/**
 * Convert a PPTX file to per-slide PNG images.
 * Uses a two-step process:
 *   1. LibreOffice converts PPTX → multi-page PDF (handles full fidelity)
 *   2. Ghostscript renders each PDF page as a separate PNG
 * Returns them sorted in slide order.
 */
export async function convertPptxToImages(
  inputBuffer: Buffer,
): Promise<Array<{ name: string; data: Buffer }>> {
  const id = randomUUID();
  const workDir = loWorkDir(id);
  const profileDir = loProfileDir(id);
  await mkdir(workDir, { recursive: true });
  const inputPath = join(workDir, "input.pptx");
  const pdfPath = join(workDir, "input.pdf");
  await writeFile(inputPath, inputBuffer);

  try {
    // Step 1: PPTX → multi-page PDF (LibreOffice handles all slides)
    await execFileAsync(
      "soffice",
      [
        "--headless",
        "--norestore",
        `-env:UserInstallation=file://${profileDir}`,
        "--convert-to", "pdf",
        "--outdir", workDir,
        inputPath,
      ],
      { timeout: LO_TIMEOUT_MS },
    );

    // Verify PDF was created
    const pdfExists = await readFile(pdfPath).then(() => true).catch(() => false);
    if (!pdfExists) {
      throw new Error("LibreOffice did not produce a PDF output");
    }

    // Step 2: Use Ghostscript to render each PDF page as PNG
    // gs outputs slide-1.png, slide-2.png, …
    const gsOutputPattern = join(workDir, "slide-%d.png");
    await execFileAsync(
      "gs",
      [
        "-dNOPAUSE", "-dBATCH", "-dSAFER",
        "-sDEVICE=png16m",
        "-r150",
        `-sOutputFile=${gsOutputPattern}`,
        pdfPath,
      ],
      { timeout: LO_TIMEOUT_MS },
    );

    // Collect all generated PNGs
    const allFiles = await readdir(workDir);
    const pngFiles = allFiles
      .filter((f) => /^slide-\d+\.png$/.test(f))
      .sort((a, b) => {
        const n = (s: string) => parseInt(s.replace("slide-", "").replace(".png", "")) || 0;
        return n(a) - n(b);
      });

    if (pngFiles.length === 0) {
      throw new Error("Ghostscript did not produce any PNG output");
    }

    const slides: Array<{ name: string; data: Buffer }> = [];
    for (const f of pngFiles) {
      slides.push({
        name: f,
        data: await readFile(join(workDir, f)),
      });
    }
    return slides;
  } finally {
    await Promise.all([
      rm(workDir, { recursive: true, force: true }),
      rm(profileDir, { recursive: true, force: true }),
    ]).catch(() => {});
  }
}
