/**
 * Global file and asset download utilities (SSOT)
 */

/**
 * Triggers a browser file download using an anchor element
 */
export function triggerDownload(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Downloads an in-memory Blob and releases the object URL after triggering
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Downloads a base64 Data URL
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  triggerDownload(dataUrl, filename);
}

/**
 * Downloads raw string or JSON text as a file
 */
export function downloadText(
  content: string,
  filename: string,
  mimeType: string = 'text/plain;charset=utf-8'
): void {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}
