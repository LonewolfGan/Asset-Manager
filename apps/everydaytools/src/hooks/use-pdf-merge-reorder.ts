import { useState, useCallback, useMemo } from 'react';
import type { StagedFile } from '@/lib/pdf-merge-logic';
import {
  moveItem as moveItemLogic,
  reorderItem as reorderItemLogic,
  sortAZFiles,
  reverseFiles,
} from '@/lib/pdf-merge-logic';

export interface UsePdfMergeFilesOptions {
  isFr: boolean;
  setError: (err: string | null) => void;
}

export function usePdfMergeFiles({ isFr, setError }: UsePdfMergeFilesOptions) {
  const [files, setFiles] = useState<StagedFile[]>([]);
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
    [isFr, setError]
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

  const resetFiles = useCallback(() => {
    setFiles([]);
  }, []);

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

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && sourceIndex === null) {
        handleFilesAdded(Array.from(e.dataTransfer.files));
        return;
      }

      if (sourceIndex === null || sourceIndex === targetIndex) return;
      setFiles((prev) => reorderItemLogic(prev, sourceIndex, targetIndex));
    },
    [draggedIndex, handleFilesAdded]
  );

  return {
    files,
    setFiles,
    totalSize,
    draggedIndex,
    dragOverIndex,
    handleFilesAdded,
    removeFile,
    moveItem,
    sortAZ,
    reverseOrder,
    resetFiles,
    handleItemDragStart,
    handleItemDragOver,
    handleItemDragEnd,
    handleItemDrop,
  };
}
