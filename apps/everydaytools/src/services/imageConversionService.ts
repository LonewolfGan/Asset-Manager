import { apiUpload } from "@/lib/apiBase";

export type ImageConversionOptions = {
  format: string;
  quality: number;
  width?: number;
  height?: number;
};

const SERVER_FORMATS = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/tiff",
]);

const convertImageClientSide = (
  file: File,
  options: ImageConversionOptions
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        canvas.width = options.width || img.width;
        canvas.height = options.height || img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to convert image"));
          },
          options.format,
          options.quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export const convertImage = async (
  file: File,
  options: ImageConversionOptions
): Promise<Blob> => {
  if (!SERVER_FORMATS.has(options.format)) {
    return convertImageClientSide(file, options);
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("format", options.format);
  fd.append("quality", String(options.quality));
  if (options.width) fd.append("width", String(options.width));
  if (options.height) fd.append("height", String(options.height));

  const res = await apiUpload("/convert/image", fd);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed", clientFallback: false }));
    if (err.clientFallback) {
      return convertImageClientSide(file, options);
    }
    throw new Error(err.error ?? "Image conversion failed");
  }

  const arrayBuffer = await res.arrayBuffer();
  return new Blob([arrayBuffer], { type: options.format });
};
