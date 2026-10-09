import { useState, useCallback } from 'react';

export interface PageThumb {
  pageNumber: number;
  dataUrl?: string;
}

export function usePdfThumbnails() {
  const [pages, setPages] = useState<PageThumb[]>([]);
  const [isLoadingThumbs, setIsLoadingThumbs] = useState<boolean>(false);

  const loadPdfThumbnails = useCallback(async (pdfFile: File) => {
    setIsLoadingThumbs(true);
    setPages([]);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.mjs',
        import.meta.url
      ).href;

      const buffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const numPages = pdf.numPages;

      // Placeholders rendered immediately
      const placeholderThumbs: PageThumb[] = Array.from(
        { length: numPages },
        (_, i) => ({ pageNumber: i + 1 })
      );
      setPages(placeholderThumbs);

      // Render actual canvas previews
      const renderedThumbs: PageThumb[] = [];
      for (let i = 1; i <= numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.35 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            await page.render({
              canvasContext: ctx,
              viewport,
            } as any).promise;
            renderedThumbs.push({
              pageNumber: i,
              dataUrl: canvas.toDataURL('image/jpeg', 0.85),
            });
          } else {
            renderedThumbs.push({ pageNumber: i });
          }
        } catch {
          renderedThumbs.push({ pageNumber: i });
        }
      }

      setPages(renderedThumbs);
      return numPages;
    } catch (e) {
      console.warn('Could not load PDF thumbnails', e);
      setPages([{ pageNumber: 1 }]);
      return 1;
    } finally {
      setIsLoadingThumbs(false);
    }
  }, []);

  const resetThumbnails = useCallback(() => {
    setPages([]);
    setIsLoadingThumbs(false);
  }, []);

  return {
    pages,
    isLoadingThumbs,
    loadPdfThumbnails,
    resetThumbnails,
  };
}
