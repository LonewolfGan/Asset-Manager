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
        `--env:UserInstallation=file://${profileDir}`,
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
 * LibreOffice names slides as: input.png, input1.png, input2.png, …
 * Returns them sorted in slide order with names slide-1.png, slide-2.png, …
 */
export async function convertPptxToImages(
  inputBuffer: Buffer,
): Promise<Array<{ name: string; data: Buffer }>> {
  const id = randomUUID();
  const workDir = loWorkDir(id);
  const profileDir = loProfileDir(id);
  await mkdir(workDir, { recursive: true });
  const inputPath = join(workDir, "input.pptx");
  await writeFile(inputPath, inputBuffer);

  try {
    await execFileAsync(
      "soffice",
      [
        "--headless",
        "--norestore",
        `--env:UserInstallation=file://${profileDir}`,
        "--convert-to", "png",
        "--outdir", workDir,
        inputPath,
      ],
      { timeout: LO_TIMEOUT_MS },
    );

    const allFiles = await readdir(workDir);
    const pngFiles = allFiles
      .filter((f) => /^input\d*\.png$/.test(f))
      .sort((a, b) => {
        const n = (s: string) => s === "input.png" ? 0 : parseInt(s.replace("input", "").replace(".png", "")) || 0;
        return n(a) - n(b);
      });

    const slides: Array<{ name: string; data: Buffer }> = [];
    for (let i = 0; i < pngFiles.length; i++) {
      slides.push({
        name: `slide-${i + 1}.png`,
        data: await readFile(join(workDir, pngFiles[i])),
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
