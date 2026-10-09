import { logger } from "./logger.js";

const DEFAULT_GOTENBERG_PORT = "3000";
const GOTENBERG_URL = process.env["GOTENBERG_URL"] ?? `http://127.0.0.1:${DEFAULT_GOTENBERG_PORT}`;
const REQUEST_TIMEOUT_MS = 60_000;

export interface GotenbergOptions {
  pdfa?: string;
  landscape?: boolean;
  nativePageRanges?: string;
}

/**
 * Check if the Gotenberg microservice is running and healthy.
 */
export async function isGotenbergHealthy(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${GOTENBERG_URL}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Convert an office document buffer to PDF using Gotenberg's persistent warm LibreOffice pool.
 * Typical conversion time: ~200-400ms (eliminates cold start).
 */
export async function convertWithGotenberg(
  inputBuffer: Buffer,
  filename: string,
  options?: GotenbergOptions,
): Promise<Buffer> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(inputBuffer)]);
    formData.append("files", blob, filename);

    if (options?.pdfa) {
      formData.append("pdfa", options.pdfa);
    }
    if (options?.landscape) {
      formData.append("landscape", "true");
    }
    if (options?.nativePageRanges) {
      formData.append("nativePageRanges", options.nativePageRanges);
    }

    const res = await fetch(`${GOTENBERG_URL}/forms/libreoffice/convert`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Gotenberg HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }

    const arrayBuf = await res.arrayBuffer();
    return Buffer.from(arrayBuf);
  } finally {
    clearTimeout(timeout);
  }
}

export function getGotenbergUrl(): string {
  return GOTENBERG_URL;
}
