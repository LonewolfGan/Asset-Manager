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
