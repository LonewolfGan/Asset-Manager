import { useState, useCallback, useEffect } from 'react';

export interface UsePdfPagePreviewReturn {
  pagePreviewUrl: string | null;
  previewPage: number;
  totalPages: number | null;
  isLoadingPreview: boolean;
  renderPagePreview: (pdfFile: File, pageNum: number) => Promise<void>;
  handlePageChange: (newPage: number) => void;
  resetPreview: () => void;
}

export function usePdfPagePreview(file?: File, skipFirst = false): UsePdfPagePreviewReturn {
  const [pagePreviewUrl, setPagePreviewUrl] = useState<string | null>(null);
  const [previewPage, setPreviewPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);

  const renderPagePreview = useCallback(async (pdfFile: File, pageNum: number) => {
    setIsLoadingPreview(true);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.mjs',
        import.meta.url
      ).href;

      const buffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      setTotalPages(pdf.numPages);

      const targetPageNum = Math.min(Math.max(1, pageNum), pdf.numPages);
      const page = await pdf.getPage(targetPageNum);

      const unscaledViewport = page.getViewport({ scale: 1 });
      const targetWidth = 480;
      const scale = targetWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale: Math.max(0.6, Math.min(scale, 1.5)) });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        await (page.render({
          canvasContext: ctx,
          viewport,
        } as unknown as Parameters<typeof page.render>[0])).promise;

        setPagePreviewUrl(canvas.toDataURL('image/jpeg', 0.9));
      }
    } catch (err) {
      console.error('Failed to render PDF page preview:', err);
    } finally {
      setIsLoadingPreview(false);
    }
  }, []);

  useEffect(() => {
    if (file) {
      const initialPage = skipFirst && totalPages && totalPages > 1 ? 2 : 1;
      setPreviewPage(initialPage);
      renderPagePreview(file, initialPage);
    } else {
      setPagePreviewUrl(null);
      setPreviewPage(1);
      setTotalPages(null);
    }
  }, [file, renderPagePreview]);

  const handlePageChange = useCallback((newPage: number) => {
    if (!file || !totalPages) return;
    const clamped = Math.min(Math.max(1, newPage), totalPages);
    setPreviewPage(clamped);
    renderPagePreview(file, clamped);
  }, [file, renderPagePreview, totalPages]);

  const resetPreview = useCallback(() => {
    setPagePreviewUrl(null);
    setPreviewPage(1);
    setTotalPages(null);
    setIsLoadingPreview(false);
  }, []);

  return {
    pagePreviewUrl,
    previewPage,
    totalPages,
    isLoadingPreview,
    renderPagePreview,
    handlePageChange,
    resetPreview,
  };
}
