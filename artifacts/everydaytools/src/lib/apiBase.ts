export const API_BASE = "/api";

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, init);
  return res;
}

export async function apiUpload(
  path: string,
  formData: FormData
): Promise<Response> {
  return fetch(`${API_BASE}${path}`, { method: "POST", body: formData });
}
