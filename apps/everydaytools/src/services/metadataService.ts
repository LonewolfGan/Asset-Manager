import { apiUpload } from "@/lib/apiBase";

export const getJpegMetadata = async (file: File): Promise<any> => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await apiUpload("/metadata/read", fd);
  if (!res.ok) return null;
  const data = await res.json();
  return data.metadata ?? null;
};

export const cleanJpegMetadata = async (file: File): Promise<Blob> => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await apiUpload("/metadata/clean", fd);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Metadata cleaning failed");
  }
  const arrayBuffer = await res.arrayBuffer();
  return new Blob([arrayBuffer], { type: "image/jpeg" });
};

export const cleanPdfMetadata = async (file: File): Promise<Uint8Array> => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await apiUpload("/metadata/clean", fd);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Metadata cleaning failed");
  }
  const arrayBuffer = await res.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};
