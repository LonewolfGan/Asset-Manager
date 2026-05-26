export type ProgressCallback = (progress: number) => void;

export const removeImageBackground = async (
  file: File,
  onProgress?: ProgressCallback
): Promise<Blob> => {
  const { removeBackground } = await import("@imgly/background-removal");
  
  return removeBackground(file, {
    model: "medium",
    output: { format: "image/png" },
    progress: (key, current, total) => {
      if (onProgress) {
        // Very rough progress approximation based on the parts of the loading process
        // In a real app we'd map the specific keys (fetch, compute, etc) to better %
        const percent = Math.round((current / total) * 100);
        onProgress(Math.min(100, Math.max(0, percent || 0)));
      }
    },
  });
};
