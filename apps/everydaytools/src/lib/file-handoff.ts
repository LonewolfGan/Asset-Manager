/**
 * File Handoff Bridge for Seamless Tool Chaining.
 *
 * Allows one tool (e.g. Word to PDF) to pass its resulting file
 * directly to the next tool (e.g. Compress PDF or Protect PDF)
 * without requiring the user to re-upload the document.
 *
 * Operates in-memory across client-side SPA navigation.
 */

let pendingHandoff: { file: File; timestamp: number } | null = null;

const EXT_TO_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  csv: 'text/csv',
  json: 'application/json',
  md: 'text/markdown',
  markdown: 'text/markdown',
  txt: 'text/plain',
  html: 'text/html',
  htm: 'text/html',
  epub: 'application/epub+zip',
};

/**
 * Stage a resulting file for the next tool in the workflow.
 */
export function setHandoffFile(fileOrBlob: File | Blob, filename: string): void {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const fallbackMime = EXT_TO_MIME[ext] || 'application/octet-stream';
  const effectiveMime =
    fileOrBlob.type && fileOrBlob.type !== 'application/octet-stream' && fileOrBlob.type !== ''
      ? fileOrBlob.type
      : fallbackMime;

  const file = new File([fileOrBlob], filename, {
    type: effectiveMime,
    lastModified: Date.now(),
  });

  pendingHandoff = {
    file,
    timestamp: Date.now(),
  };
}

/**
 * Consume the staged handoff file (if any).
 * Returns the File and clears the staging so it is used only once.
 * Expires automatically after 5 minutes if unconsumed.
 */
export function consumeHandoffFile(): File | null {
  if (!pendingHandoff) return null;

  const now = Date.now();
  // Expire after 5 minutes
  if (now - pendingHandoff.timestamp > 5 * 60 * 1000) {
    pendingHandoff = null;
    return null;
  }

  const staged = pendingHandoff.file;
  pendingHandoff = null;
  return staged;
}

/**
 * Check if a handoff file is currently staged without consuming it.
 */
export function hasHandoffFile(): boolean {
  if (!pendingHandoff) return false;
  if (Date.now() - pendingHandoff.timestamp > 5 * 60 * 1000) {
    pendingHandoff = null;
    return false;
  }
  return true;
}
