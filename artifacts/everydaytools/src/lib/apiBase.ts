/**
 * API base URL utility.
 *
 * Development:  VITE_API_BASE_URL (or VITE_API_URL) is unset
 *               → empty string → Vite proxy forwards /api/* to localhost:8080.
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
