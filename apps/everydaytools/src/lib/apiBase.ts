/**
 * API base URL utility.
 *
 * Development:  VITE_API_BASE_URL (or VITE_API_URL) is unset
 *               → empty string → Vite proxy forwards /api/* to localhost:3001.
 *
 * Production (Vercel frontend + separate backend):
 *   Set VITE_API_URL=https://api.everydaytools.qzz.io in your Vercel
 *   environment variables. All /api/* calls will go to the production backend.
 *   VITE_API_BASE_URL is kept as a legacy alias.
 */
const _host = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const API_BASE = `${_host}/api`;

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${path}`, init);
}

export async function apiUpload(path: string, formData: FormData): Promise<Response> {
  return fetch(`${API_BASE}${path}`, { method: "POST", body: formData });
}

/**
 * Use for pages with direct fetch('/api/...') calls.
 * apiUrl('/api/tools/pdf-compress') → '' + '/api/tools/pdf-compress' (dev)
 *                                   → 'https://api.everydaytools.qzz.io/api/tools/...' (prod)
 */
export function apiUrl(path: string): string {
  return `${_host}${path}`;
}

/**
 * Safely extracts human-readable error messages from a response without throwing on empty or HTML bodies.
 */
export async function getResponseError(res: Response, defaultMsg = "Operation failed"): Promise<string> {
  try {
    const data = await res.clone().json();
    if (typeof data === "object" && data !== null) {
      if ("message" in data && typeof (data as any).message === "string") return (data as any).message;
      if ("error" in data && typeof (data as any).error === "string") return (data as any).error;
    }
  } catch {
    try {
      const text = await res.clone().text();
      if (text && text.trim().length > 0 && text.length < 300 && !text.includes("<html")) {
        return text.trim();
      }
    } catch {
      // ignore
    }
  }
  return res.statusText ? `Error (${res.status}): ${res.statusText}` : `${defaultMsg} (${res.status})`;
}

/**
 * Formats client-side fetch errors (e.g. NetworkError, server offline, ECONNREFUSED)
 * into a clear, actionable user-facing message.
 */
export function formatFetchError(err: unknown, isFr = false): string {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (
      msg.includes("networkerror") ||
      msg.includes("failed to fetch") ||
      msg.includes("load failed") ||
      msg.includes("econnrefused")
    ) {
      return isFr
        ? "Impossible de joindre le serveur API. Vérifiez votre connexion ou assurez-vous que le serveur local est actif (Port 3001)."
        : "Unable to reach the API server. Please check your network connection or verify that the local server is running (Port 3001).";
    }
    return err.message;
  }
  return isFr ? "Une erreur inattendue est survenue." : "An unexpected error occurred.";
}
