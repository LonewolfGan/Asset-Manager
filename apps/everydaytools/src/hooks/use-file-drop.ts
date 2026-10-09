import { useState, useCallback, useRef } from 'react';

export interface UseFileDropOptions {
  onFilesSelected?: (files: File[]) => void;
  onFileSelected?: (file: File) => void;
  accept?: string | string[];
  disabled?: boolean;
}

/**
 * Filter files based on accept rules (.ext, mime/*, exact mime)
 */
export function isFileAccepted(file: File, accept?: string | string[]): boolean {
  if (!accept) return true;
  const acceptList = Array.isArray(accept)
    ? accept
    : accept.split(',').map((s) => s.trim().toLowerCase());
  if (acceptList.length === 0 || acceptList.includes('*') || acceptList.includes('*/*')) return true;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return acceptList.some((pattern) => {
    if (pattern.startsWith('.')) {
      return fileName.endsWith(pattern);
    }
    if (pattern.endsWith('/*')) {
      const category = pattern.slice(0, -2);
      return fileType.startsWith(category);
    }
    return fileType === pattern;
  });
}

/**
 * Reusable hook for drag & drop file zones with nested flicker prevention (dragCounter)
 */
export function useFileDrop(options: UseFileDropOptions = {}) {
  const { onFilesSelected, onFileSelected, accept, disabled = false } = options;
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragCounter.current += 1;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [disabled, isDragging]
  );

  const handleDragLeave = useCallback(
    (e?: React.DragEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (disabled) return;
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDragging(false);
      }
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragging(false);
      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const rawFiles = Array.from(e.dataTransfer.files);
        const filteredFiles = rawFiles.filter((f) => isFileAccepted(f, accept));
        if (filteredFiles.length > 0) {
          if (onFilesSelected) {
            onFilesSelected(filteredFiles);
          }
          if (onFileSelected) {
            onFileSelected(filteredFiles[0]);
          }
        }
      }
    },
    [disabled, accept, onFilesSelected, onFileSelected]
  );

  const reset = useCallback(() => {
    dragCounter.current = 0;
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    reset,
    dropProps: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
