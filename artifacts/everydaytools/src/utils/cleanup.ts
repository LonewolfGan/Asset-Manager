const activeObjectURLs: Set<string> = new Set();

export const trackObjectURL = (url: string): string => {
  activeObjectURLs.add(url);
  return url;
};

export const revokeObjectURL = (url: string | null | undefined): void => {
  if (!url) return;
  URL.revokeObjectURL(url);
  activeObjectURLs.delete(url);
};

export const revokeAllObjectURLs = (): void => {
  for (const url of activeObjectURLs) {
    URL.revokeObjectURL(url);
  }
  activeObjectURLs.clear();
};

export const clearArrayBuffer = (buf: ArrayBuffer | null | undefined): void => {
  if (!buf) return;
  try {
    new Uint8Array(buf).fill(0);
  } catch {
    // ignore — read-only or already detached
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', revokeAllObjectURLs);
}
