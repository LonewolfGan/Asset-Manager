/**
 * Configurable system binary paths.
 *
 * Each binary can be overridden via an environment variable.
 * Defaults to bare command names so they are resolved via PATH —
 * this works on Ubuntu/Debian, Render, Railway, Fly.io, and any
 * standard Linux environment.
 *
 * Example (in .env or Docker ENV):
 *   SOFFICE_PATH=/usr/bin/soffice
 *   GS_PATH=/usr/bin/gs
 *   POTRACE_PATH=/usr/bin/potrace
 *   QPDF_PATH=/usr/bin/qpdf
 *   PYTHON3_PATH=/usr/bin/python3
 */
export const BIN = {
  soffice:   process.env["SOFFICE_PATH"]   ?? "soffice",
  gs:        process.env["GS_PATH"]        ?? "gs",
  potrace:   process.env["POTRACE_PATH"]   ?? "potrace",
  qpdf:      process.env["QPDF_PATH"]      ?? "qpdf",
  python3:   process.env["PYTHON3_PATH"]   ?? "python3",
  tesseract: process.env["TESSERACT_PATH"] ?? "tesseract",
} as const;
