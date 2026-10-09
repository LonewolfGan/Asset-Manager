import { apiUpload } from "@/lib/apiBase";

export type ProgressCallback = (progress: number) => void;

export const removeImageBackground = async (
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> => {
  onProgress?.(5);

  const fd = new FormData();
  fd.append("file", file);

  onProgress?.(15);

  const res = await apiUpload("/remove-background", fd);

  onProgress?.(90);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Background removal failed");
  }

  const arrayBuffer = await res.arrayBuffer();
  onProgress?.(100);
  return new Blob([arrayBuffer], { type: "image/png" });
};
