import { apiFetch } from "@/lib/apiBase";

export const cleanTextScrubInvisibles = async (
  text: string
): Promise<{ cleaned: string; removedCount: number }> => {
  const res = await apiFetch("/text/scrub", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, options: { invisibles: true, stylistic: false } }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Scrub failed");
  }
  return res.json();
};

export const applyStylisticScrub = async (text: string): Promise<string> => {
  const res = await apiFetch("/text/scrub", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, options: { invisibles: false, stylistic: true } }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Scrub failed");
  }
  const data = await res.json();
  return data.cleaned as string;
};
