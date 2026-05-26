export type ProgressCallback = (progress: number) => void;

const ORT_VERSION = "1.26.0";
const ORT_CDN = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;

export const removeImageBackground = async (
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> => {
  const { removeBackground } = await import("@imgly/background-removal");

  return removeBackground(file, {
    model: "medium",
    output: { format: "image/png" },
    publicPath: `https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/dist/`,
    env: {
      ort: {
        wasm: {
          wasmPaths: ORT_CDN,
        },
      },
    },
    progress: (key, current, total) => {
      if (onProgress) {
        const percent = Math.round((current / total) * 100);
        onProgress(Math.min(100, Math.max(0, percent || 0)));
      }
    },
  });
};
