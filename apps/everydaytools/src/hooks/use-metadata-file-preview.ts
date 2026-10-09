import { useState, useEffect } from 'react';

export function useMetadataFilePreview(file: File | null) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [imageDims, setImageDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!file) {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setIsPreviewLoading(false);
      setImageDims(null);
      return undefined;
    }

    const isImage =
      file.type.startsWith('image/') ||
      /\.(jpg|jpeg|png|webp|tiff|tif|avif)$/i.test(file.name);
    const isPdf =
      file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

    let isMounted = true;
    let objectUrlToRevoke: string | null = null;

    if (isImage) {
      const url = URL.createObjectURL(file);
      objectUrlToRevoke = url;
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        if (isMounted) {
          setImageDims({ w: img.naturalWidth, h: img.naturalHeight });
        }
      };
      img.src = url;

      return () => {
        isMounted = false;
        if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
      };
    }

    if (isPdf) {
      setIsPreviewLoading(true);
      (async () => {
        try {
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.mjs',
            import.meta.url
          ).href;

          const buffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
          const page = await pdf.getPage(1);

          const unscaledViewport = page.getViewport({ scale: 1 });
          const targetWidth = 600;
          const scale = Math.max(
            0.7,
            Math.min(targetWidth / unscaledViewport.width, 1.8)
          );
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');

          if (ctx && isMounted) {
            await page.render({
              canvasContext: ctx,
              viewport,
            } as any).promise;

            if (isMounted) {
              const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
              setPreviewUrl(dataUrl);
            }
          }
        } catch (err) {
          console.error('Failed to render PDF page 1 preview:', err);
        } finally {
          if (isMounted) {
            setIsPreviewLoading(false);
          }
        }
      })();

      return () => {
        isMounted = false;
      };
    }

    setPreviewUrl(null);
    setIsPreviewLoading(false);
    setImageDims(null);
    return undefined;
  }, [file]);

  return { previewUrl, isPreviewLoading, imageDims };
}
