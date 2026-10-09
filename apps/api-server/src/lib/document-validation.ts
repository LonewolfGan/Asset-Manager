export const ALLOWED_DOCUMENT_FORMATS = new Set([
  "pdf",
  "docx",
  "doc",
  "odt",
  "rtf",
  "txt",
  "html",
  "epub",
  "pptx",
  "xlsx",
]);

export const MIME_MAP: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  odt: "application/vnd.oasis.opendocument.text",
  rtf: "application/rtf",
  txt: "text/plain; charset=utf-8",
  html: "text/html; charset=utf-8",
  epub: "application/epub+zip",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export function isValidTargetFormat(format: string): boolean {
  if (!format || typeof format !== "string") return false;
  const clean = format.toLowerCase().trim().replace(/^\./, "");
  return ALLOWED_DOCUMENT_FORMATS.has(clean);
}

export function isValidInputExt(ext: string): boolean {
  if (!ext || typeof ext !== "string") return false;
  const clean = ext.toLowerCase().trim().replace(/^\./, "");
  return /^[a-zA-Z0-9]{2,10}$/.test(clean);
}
