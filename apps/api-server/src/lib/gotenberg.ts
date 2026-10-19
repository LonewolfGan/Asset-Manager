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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  try {
    const res = await fetch(`${GOTENBERG_URL}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
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

export interface GotenbergChromiumOptions {
  paperWidth?: string | number; // e.g. 8.27 (A4 in inches)
  paperHeight?: string | number; // e.g. 11.69 (A4 in inches)
  marginTop?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  marginRight?: string | number;
  landscape?: boolean;
  preferCssPageSize?: boolean;
  printBackground?: boolean;
  emulatedMediaType?: "screen" | "print";
  scale?: number;
  waitDelay?: string;
}

export async function convertHtmlWithGotenberg(
  html: string | Buffer,
  options?: GotenbergChromiumOptions,
): Promise<Buffer> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const formData = new FormData();
    const htmlBuffer = Buffer.isBuffer(html) ? html : Buffer.from(html, "utf-8");
    const blob = new Blob([new Uint8Array(htmlBuffer)], { type: "text/html" });
    formData.append("files", blob, "index.html");

    const printBackground = options?.printBackground ?? true;
    formData.append("printBackground", String(printBackground));

    const preferCssPageSize = options?.preferCssPageSize ?? true;
    formData.append("preferCssPageSize", String(preferCssPageSize));

    if (options?.paperWidth !== undefined) {
      formData.append("paperWidth", String(options.paperWidth));
    }
    if (options?.paperHeight !== undefined) {
      formData.append("paperHeight", String(options.paperHeight));
    }
    if (options?.marginTop !== undefined) {
      formData.append("marginTop", String(options.marginTop));
    }
    if (options?.marginBottom !== undefined) {
      formData.append("marginBottom", String(options.marginBottom));
    }
    if (options?.marginLeft !== undefined) {
      formData.append("marginLeft", String(options.marginLeft));
    }
    if (options?.marginRight !== undefined) {
      formData.append("marginRight", String(options.marginRight));
    }
    if (options?.landscape !== undefined) {
      formData.append("landscape", String(options.landscape));
    }
    if (options?.emulatedMediaType !== undefined) {
      formData.append("emulatedMediaType", options.emulatedMediaType);
    }
    if (options?.scale !== undefined) {
      formData.append("scale", String(options.scale));
    }
    if (options?.waitDelay !== undefined) {
      formData.append("waitDelay", options.waitDelay);
    }

    const res = await fetch(`${GOTENBERG_URL}/forms/chromium/convert/html`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Gotenberg Chromium HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }

    const arrayBuf = await res.arrayBuffer();
    return Buffer.from(arrayBuf);
  } finally {
    clearTimeout(timeout);
  }
}
