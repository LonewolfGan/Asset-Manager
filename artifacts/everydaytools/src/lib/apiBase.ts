/**
 * API base URL utility.
 *
 * Development:  VITE_API_BASE_URL is unset → empty string → Vite proxy
 *               forwards /api/* to localhost:8080 automatically.
 *
 * Production (Vercel frontend + Render backend):
 *   Set VITE_API_BASE_URL=https://your-app.onrender.com in Vercel
 *   environment variables. All /api/* calls will go to Render.
 */
const _host = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

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
 *                                   → 'https://x.onrender.com/api/tools/pdf-compress' (prod)
 */
export function apiUrl(path: string): string {
  return `${_host}${path}`;
}
