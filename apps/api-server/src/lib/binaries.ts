/**
 * Configurable system binary paths.
 *
 * Each binary can be overridden via an environment variable.
 * Spec names (LIBREOFFICE_PATH, GHOSTSCRIPT_PATH, PYTHON_PATH) are the canonical form.
 * Legacy names (SOFFICE_PATH, GS_PATH, PYTHON3_PATH) are also accepted for compatibility.
 *
 * Example (.env or Docker ENV):
 *   LIBREOFFICE_PATH=/usr/bin/soffice
 *   GHOSTSCRIPT_PATH=/usr/bin/gs
 *   POTRACE_PATH=/usr/bin/potrace
 *   QPDF_PATH=/usr/bin/qpdf
 *   PYTHON_PATH=/usr/bin/python3
 *   TESSERACT_PATH=/usr/bin/tesseract
 */
import { join, resolve } from "path";
import { existsSync } from "fs";

export const BIN = {
  /** LibreOffice headless (soffice) */
  soffice:   process.env["LIBREOFFICE_PATH"] ?? process.env["SOFFICE_PATH"]  ?? "soffice",
  /** Ghostscript */
  gs:        process.env["GHOSTSCRIPT_PATH"] ?? process.env["GS_PATH"]       ?? "gs",
  /** Potrace (SVG vectorization) */
  potrace:   process.env["POTRACE_PATH"]     ?? "potrace",
  /** qpdf (PDF encryption / unlock) */
  qpdf:      process.env["QPDF_PATH"]        ?? "qpdf",
  /** Python 3 interpreter */
  python3:   process.env["PYTHON_PATH"]      ?? process.env["PYTHON3_PATH"]  ?? "python3",
  /** Tesseract OCR */
  tesseract: process.env["TESSERACT_PATH"]   ?? "tesseract",
} as const;

/**
 * Resolves the absolute path to a Python helper script.
 * Prioritizes PYTHON_SCRIPTS_DIR (or /app/python in container) and falls back
 * gracefully to local development paths when running in dev mode.
 */
export function getPythonScriptPath(scriptName: string): string {
  const envDir = process.env["PYTHON_SCRIPTS_DIR"];
  if (envDir && existsSync(join(envDir, scriptName))) {
    return join(envDir, scriptName);
  }
  if (existsSync(join("/app/python", scriptName))) {
    return join("/app/python", scriptName);
  }
  const searchDirs = [
    resolve(process.cwd(), "src/python"),
    resolve(process.cwd(), "python"),
    resolve(process.cwd(), "artifacts/api-server/src/python"),
    resolve(process.cwd(), "artifacts/api-server/python"),
  ];
  for (const dir of searchDirs) {
    const full = join(dir, scriptName);
    if (existsSync(full)) return full;
  }
  return join(envDir ?? "/app/python", scriptName);
}

