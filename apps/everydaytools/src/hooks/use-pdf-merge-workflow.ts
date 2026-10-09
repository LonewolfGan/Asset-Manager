import { useState, useMemo, useCallback } from 'react';
import { apiUrl } from '@/lib/apiBase';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import {
  type StagedFile,
  moveItem as moveItemLogic,
  reorderItem as reorderItemLogic,
  sortAZFiles,
  reverseFiles,
  sanitizeOutputFilename,
} from '@/lib/pdf-merge-logic';

export interface MergeResultData {
  blob: Blob;
  filename: string;
  sizeAfter: number;
  sizeBefore?: number;
  count: number;
}

export function usePdfMergeWorkflow(isFr: boolean, errorMin2Text?: string) {
  const [files, setFiles] = useState<StagedFile[]>([]);
  const [outputFilename, setOutputFilename] = useState<string>(
    isFr ? 'document_fusionne.pdf' : 'merged_document.pdf'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [result, setResult] = useState<MergeResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Drag and drop reordering
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const totalSize = useMemo(() => {
    return files.reduce((acc, f) => acc + f.file.size, 0);
  }, [files]);

  const handleFilesAdded = useCallback(
    (incoming: File[]) => {
      const validPdfs = incoming.filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      );

      if (validPdfs.length === 0) {
        setError(isFr ? 'Veuillez sélectionner des fichiers PDF valides.' : 'Please select valid PDF files.');
        return;
      }

      setError(null);
      setResult(null);
      setFiles((prev) => {
        const incomingStaged: StagedFile[] = validPdfs.map((file, i) => ({
          id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
          file,
        }));
        const combined = [...prev, ...incomingStaged];
        if (combined.length > 20) {
          setError(
            isFr
              ? 'Vous pouvez assembler jusqu’à 20 documents à la fois.'
              : 'You can merge up to 20 documents at a time.'
          );
          return combined.slice(0, 20);
        }
        return combined;
      });
    },
    [isFr]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const moveItem = useCallback((index: number, direction: 'prev' | 'next') => {
    setFiles((prev) => moveItemLogic(prev, index, direction));
  }, []);

  const sortAZ = useCallback(() => {
    setFiles((prev) => sortAZFiles(prev));
  }, []);

  const reverseOrder = useCallback(() => {
    setFiles((prev) => reverseFiles(prev));
  }, []);

  const resetWorkflow = useCallback(() => {
    setFiles([]);
    setOutputFilename(isFr ? 'document_fusionne.pdf' : 'merged_document.pdf');
    setResult(null);
    setError(null);
    setIsProcessing(false);
  }, [isFr]);

  const handleItemDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  }, []);

  const handleItemDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverIndex !== index) {
        setDragOverIndex(index);
      }
    },
    [dragOverIndex]
  );

  const handleItemDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleItemDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      const sourceIndex = draggedIndex;
      setDraggedIndex(null);
      setDragOverIndex(null);

      // If external files dropped on item
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && sourceIndex === null) {
        handleFilesAdded(Array.from(e.dataTransfer.files));
        return;
      }

      if (sourceIndex === null || sourceIndex === targetIndex) return;
      setFiles((prev) => reorderItemLogic(prev, sourceIndex, targetIndex));
    },
    [draggedIndex, handleFilesAdded]
  );

  const handleMerge = useCallback(async () => {
    if (files.length < 2) {
      setError(
        errorMin2Text ??
          (isFr
            ? 'Veuillez ajouter au moins 2 fichiers PDF pour lancer la fusion.'
            : 'Please select at least 2 PDF files to merge.')
      );
      return false;
    }
    setError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-merge', 'pdf');
      const fd = new FormData();
      for (const item of files) {
        fd.append('files', item.file);
      }

      const [res] = await Promise.all([
        fetch(apiUrl('/api/tools/pdf-merge'), {
          method: 'POST',
          body: fd,
        }),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(
          err.message ?? err.error ?? (isFr ? 'Échec de la fusion des documents.' : 'Failed to merge documents.')
        );
      }

      const blob = await res.blob();
      const defaultFilename = isFr ? 'document_fusionne.pdf' : 'merged_document.pdf';
      const sanitizedName = sanitizeOutputFilename(outputFilename, defaultFilename);

      setResult({
        blob,
        filename: sanitizedName,
        sizeAfter: blob.size,
        sizeBefore: totalSize,
        count: files.length,
      });
      return true;
    } catch (e) {
      trackToolError('pdf-merge', 'general-error');
      setError(e instanceof Error ? e.message : (isFr ? 'La fusion a échoué. Vérifiez vos documents et réessayez.' : 'Merge failed. Check your documents and try again.'));
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [files, errorMin2Text, isFr, outputFilename, totalSize]);

  return {
    files,
    setFiles,
    outputFilename,
    setOutputFilename,
    viewMode,
    setViewMode,
    result,
    setResult,
    error,
    setError,
    isProcessing,
    draggedIndex,
    dragOverIndex,
    totalSize,
    handleFilesAdded,
    removeFile,
    moveItem,
    sortAZ,
    reverseOrder,
    resetWorkflow,
    handleItemDragStart,
    handleItemDragOver,
    handleItemDragEnd,
    handleItemDrop,
    handleMerge,
  };
}
