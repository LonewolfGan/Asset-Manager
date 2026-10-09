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
import { BIN } from "./binaries.js";
import { convertWithGotenberg } from "./gotenberg.js";
import { logger } from "./logger.js";

const execFileAsync = promisify(execFile);
const LO_TIMEOUT_MS = 120_000;

function loWorkDir(id: string) { return join(tmpdir(), `lo-work-${id}`); }
function loProfileDir(id: string) { return join(tmpdir(), `lo-profile-${id}`); }

/**
 * Pre-generate a hardened LibreOffice user profile with disabled macros,
 * disabled Java runtime, disabled external plugins and lock checks.
 */
async function prepareHardenedProfile(profileDir: string): Promise<void> {
  const userConfigDir = join(profileDir, "user");
  await mkdir(userConfigDir, { recursive: true });

  const securityXcu = `<?xml version="1.0" encoding="UTF-8"?>
<oor:items xmlns:oor="http://openoffice.org/2001/registry" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <item oor:path="/org.openoffice.Office.Common/Security/Scripting">
    <prop oor:name="MacroSecurityLevel" oor:type="xs:int"><value>3</value></prop>
    <prop oor:name="ExecutePlugins" oor:type="xs:boolean"><value>false</value></prop>
    <prop oor:name="Warning" oor:type="xs:boolean"><value>false</value></prop>
    <prop oor:name="Confirmation" oor:type="xs:boolean"><value>false</value></prop>
  </item>
  <item oor:path="/org.openoffice.Office.Java">
    <prop oor:name="Enable" oor:type="xs:boolean"><value>false</value></prop>
  </item>
  <item oor:path="/org.openoffice.Office.Common/Misc">
    <prop oor:name="UseLocking" oor:type="xs:boolean"><value>false</value></prop>
  </item>
</oor:items>`;

  await writeFile(join(userConfigDir, "registrymodifications.xcu"), securityXcu, "utf-8");
}

/**
 * Standard hardened CLI flags for headless LibreOffice conversions.
 */
function getHardenedSofficeArgs(profileDir: string): string[] {
  return [
    "--headless",
    "--invisible",
    "--nologo",
    "--nodefault",
    "--nofirststartwizard",
    "--norestore",
    "--nolockcheck",
    `-env:UserInstallation=file://${profileDir}`,
  ];
}

/**
 * Convert a single document to a single output format.
 * Tries Gotenberg's persistent warm LibreOffice pool first for PDF targets (~200-400ms).
 * Transparently falls back to local soffice CLI if Gotenberg is unreachable or for non-PDF targets.
 */
export async function convertWithLibreOffice(
  inputBuffer: Buffer,
  inputExt: string,
  targetFormat: string,
): Promise<Buffer> {
  const normTarget = targetFormat.toLowerCase();
  const normInput = inputExt.toLowerCase().replace(/^\./, "");

  // Gotenberg accelerated path for Office -> PDF
  if (normTarget === "pdf" && normInput !== "pdf") {
    try {
      const filename = `document.${normInput}`;
      return await convertWithGotenberg(inputBuffer, filename);
    } catch (gotenbergErr) {
      logger.debug(
        { err: gotenbergErr instanceof Error ? gotenbergErr.message : String(gotenbergErr) },
        "Gotenberg unavailable or error, falling back to local LibreOffice CLI",
      );
    }
  }
  const id = randomUUID();
  const workDir = loWorkDir(id);
  const profileDir = loProfileDir(id);
  await Promise.all([
    mkdir(workDir, { recursive: true }),
    prepareHardenedProfile(profileDir),
  ]);
  const inputPath = join(workDir, `input.${inputExt}`);
  await writeFile(inputPath, inputBuffer);

  try {
    const args = getHardenedSofficeArgs(profileDir);

    if (inputExt.toLowerCase() === "pdf" && targetFormat.toLowerCase() === "pptx") {
      args.push("--infilter=impress_pdf_import", "--convert-to", "pptx:Impress MS PowerPoint 2007 XML");
    } else {
      args.push("--convert-to", targetFormat);
    }

    args.push("--outdir", workDir, inputPath);

    await execFileAsync(BIN.soffice, args, {
      timeout: LO_TIMEOUT_MS,
      env: {
        ...process.env,
        SAL_NO_EXT_HELP: "1",
        SAL_USE_VCLPLUGIN: "svp",
        // Neutralize outbound network proxy to prevent SSRF exfiltration
        http_proxy: "",
        https_proxy: "",
        all_proxy: "",
      },
    });

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
  await Promise.all([
    mkdir(workDir, { recursive: true }),
    prepareHardenedProfile(profileDir),
  ]);
  const inputPath = join(workDir, "input.pptx");
  const pdfPath = join(workDir, "input.pdf");
  await writeFile(inputPath, inputBuffer);

  try {
    // Step 1: PPTX → multi-page PDF (LibreOffice handles all slides)
    const loArgs = [
      ...getHardenedSofficeArgs(profileDir),
      "--convert-to", "pdf",
      "--outdir", workDir,
      inputPath,
    ];

    await execFileAsync(BIN.soffice, loArgs, {
      timeout: LO_TIMEOUT_MS,
      env: {
        ...process.env,
        SAL_NO_EXT_HELP: "1",
        SAL_USE_VCLPLUGIN: "svp",
        http_proxy: "",
        https_proxy: "",
        all_proxy: "",
      },
    });

    // Verify PDF was created
    const pdfExists = await readFile(pdfPath).then(() => true).catch(() => false);
    if (!pdfExists) {
      throw new Error("LibreOffice did not produce a PDF output");
    }

    // Step 2: Use Ghostscript to render each PDF page as PNG
    // gs outputs slide-1.png, slide-2.png, …
    const gsOutputPattern = join(workDir, "slide-%d.png");
    await execFileAsync(
      BIN.gs,
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
