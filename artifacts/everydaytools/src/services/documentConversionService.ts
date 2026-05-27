import { apiUpload, apiFetch } from "@/lib/apiBase";

export type ConversionProgressCallback = (progress: number) => void;

export const convertPdfToText = async (
  file: File,
  onProgress?: ConversionProgressCallback
): Promise<string> => {
  onProgress?.(10);
  const fd = new FormData();
  fd.append("file", file);
  onProgress?.(30);
  const res = await apiUpload("/convert/pdf-to-text", fd);
  onProgress?.(80);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "PDF to text conversion failed");
  }
  const data = await res.json();
  onProgress?.(100);
  return data.text as string;
};

export const convertDocxToHtml = async (
  file: File,
  onProgress?: ConversionProgressCallback
): Promise<string> => {
  onProgress?.(20);
  const fd = new FormData();
  fd.append("file", file);
  onProgress?.(50);
  const res = await apiUpload("/convert/docx-to-html", fd);
  onProgress?.(90);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "DOCX to HTML conversion failed");
  }
  const data = await res.json();
  onProgress?.(100);
  return data.html as string;
};

export const convertDocxToText = async (
  file: File,
  onProgress?: ConversionProgressCallback
): Promise<string> => {
  onProgress?.(20);
  const fd = new FormData();
  fd.append("file", file);
  onProgress?.(50);
  const res = await apiUpload("/convert/docx-to-text", fd);
  onProgress?.(90);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "DOCX to text conversion failed");
  }
  const data = await res.json();
  onProgress?.(100);
  return data.text as string;
};

export const convertTextToPdf = async (
  text: string,
  onProgress?: ConversionProgressCallback
): Promise<Uint8Array> => {
  onProgress?.(10);
  const res = await apiFetch("/convert/text-to-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  onProgress?.(80);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Text to PDF conversion failed");
  }
  const arrayBuffer = await res.arrayBuffer();
  onProgress?.(100);
  return new Uint8Array(arrayBuffer);
};

export const unsupportedConversionError = (format: string): string => {
  return `Conversion to ${format} is layout-engine dependent and not supported. Please use a dedicated desktop application or cloud service for layout-preserving conversions.`;
};
