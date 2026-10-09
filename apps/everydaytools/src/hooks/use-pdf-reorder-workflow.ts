import { useState, useCallback, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  PageThumb,
  getOriginalPageNumber,
  reorderArray,
  removePageAtIndex,
  reversePages as reversePagesHelper,
  isOrderModified as isOrderModifiedHelper,
  buildReorderedPdfFilename,
  reorderPdfDocument,
} from '@/lib/pdf-reorder-logic';

export interface ReorderResult {
  blob: Blob;
  filename: string;
  sizeAfter: number;
  sizeBefore?: number;
  pageCount: number;
}

export function usePdfReorderWorkflow(
  isFr: boolean,
  messages: {
    loadFailed: string;
    saveFailed: string;
    loadingThumbs: string;
  }
) {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<PageThumb[]>([]);
  const [originalPages, setOriginalPages] = useState<PageThumb[]>([]);
  const [isLoadingThumbs, setIsLoadingThumbs] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<{
    current: number;
    total: number;
  }>({ current: 0, total: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReorderResult | null>(null);

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);

  const file = files[0];

  const loadPdf = useCallback(
    async (f: File) => {
      setError(null);
      setIsLoadingThumbs(true);
      setPages([]);
      setOriginalPages([]);
      setResult(null);
      setLoadingProgress({ current: 0, total: 0 });

      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.mjs',
          import.meta.url
        ).href;
        const buf = await f.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        const numPages = pdf.numPages;
        setLoadingProgress({ current: 0, total: numPages });

        const thumbs: PageThumb[] = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const originalViewport = page.getViewport({ scale: 1.0 });
          const targetWidth = 260;
          const scale = Math.min(0.6, targetWidth / originalViewport.width);
          const vp = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          canvas.width = vp.width;
          canvas.height = vp.height;
          await page.render({
            canvasContext: canvas.getContext('2d')!,
            viewport: vp,
          } as any).promise;

          thumbs.push({
            pageNumber: i,
            dataUrl: canvas.toDataURL('image/jpeg', 0.85),
          });
          setLoadingProgress({ current: i, total: numPages });
        }

        setPages(thumbs);
        setOriginalPages(thumbs);
      } catch (e) {
        trackToolError('reorder-pdf', 'load-error');
        setError(e instanceof Error ? e.message : messages.loadFailed);
      } finally {
        setIsLoadingThumbs(false);
      }
    },
    [messages.loadFailed]
  );

  const handleSingleFileSelected = useCallback(
    (selectedFile: File) => {
      setFiles([selectedFile]);
      loadPdf(selectedFile);
    },
    [loadPdf]
  );

  // Auto-consume handoff file if transferred from another tool
  useEffect(() => {
    const staged = consumeHandoffFile();
    if (
      staged &&
      (staged.type === 'application/pdf' || staged.name.toLowerCase().endsWith('.pdf'))
    ) {
      handleSingleFileSelected(staged);
    }
  }, [handleSingleFileSelected]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = e.dataTransfer.files[0];
      if (
        dropped.type === 'application/pdf' ||
        dropped.name.toLowerCase().endsWith('.pdf')
      ) {
        handleSingleFileSelected(dropped);
      } else {
        setError(
          isFr
            ? 'Veuillez déposer un document au format PDF valide.'
            : 'Please upload a valid PDF document.'
        );
      }
    }
  };

  const handlePageDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) {
      setDragIdx(null);
      setDropIdx(null);
      return;
    }
    setPages((prev) => reorderArray(prev, dragIdx, targetIdx));
    setDragIdx(null);
    setDropIdx(null);
  };

  const movePage = (fromIdx: number, toIdx: number) => {
    setPages((prev) => reorderArray(prev, fromIdx, toIdx));
  };

  const removePage = (idx: number) => {
    setPages((prev) => removePageAtIndex(prev, idx));
  };

  const reversePages = () => {
    setPages((prev) => reversePagesHelper(prev));
  };

  const resetOrder = () => {
    setPages([...originalPages]);
  };

  const isOrderModified = isOrderModifiedHelper(pages, originalPages);

  const handleSave = async () => {
    if (!file || pages.length === 0) {
      setError(
        isFr
          ? 'Veuillez sélectionner un document PDF contenant au moins une page.'
          : 'Please select a PDF document containing at least one page.'
      );
      return;
    }
    trackToolUsed('reorder-pdf', 'pdf');
    setError(null);
    setIsSaving(true);

    try {
      const pageNumbers = pages.map((p, idx) => getOriginalPageNumber(p, idx));

      if (pageNumbers.length === 0) {
        throw new Error(
          isFr
            ? 'Veuillez conserver au moins une page dans le document.'
            : 'Please keep at least one page in the document.'
        );
      }

      const blob = await reorderPdfDocument(file, pageNumbers);

      setResult({
        blob,
        filename: buildReorderedPdfFilename(file.name),
        sizeAfter: blob.size,
        sizeBefore: file.size,
        pageCount: pageNumbers.length,
      });
    } catch (e) {
      trackToolError('reorder-pdf', 'save-error');
      const msg = e instanceof Error ? e.message : messages.saveFailed;
      setError(msg === 'true' ? messages.saveFailed : msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = useCallback(() => {
    setFiles([]);
    setPages([]);
    setOriginalPages([]);
    setResult(null);
    setError(null);
    setIsSaving(false);
    setIsLoadingThumbs(false);
    setIsNextActionOpen(false);
  }, []);

  // Keyboard shortcut: Escape resets staging if active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && file && !isSaving && !result) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, isSaving, result, handleReset]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  };

  return {
    file,
    pages,
    originalPages,
    isLoadingThumbs,
    loadingProgress,
    isSaving,
    isDraggingFile,
    isNextActionOpen,
    setIsNextActionOpen,
    error,
    setError,
    result,
    dragIdx,
    setDragIdx,
    dropIdx,
    setDropIdx,
    isOrderModified,
    handleSingleFileSelected,
    handleDragOver,
    handleDragLeave,
    handleFileDrop,
    handlePageDrop,
    movePage,
    removePage,
    reversePages,
    resetOrder,
    handleSave,
    handleReset,
    handleDownload,
  };
}

export type PdfReorderWorkflow = ReturnType<typeof usePdfReorderWorkflow>;
