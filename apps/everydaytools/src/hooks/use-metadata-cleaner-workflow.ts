import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { inspectFileMetadata, type InspectionResult } from '@/lib/metadata-inspector';
import {
  type CleanResult,
  getSourceDropzoneFormat,
  getFileTargetFormat,
  filterInspectionTags,
  computeTelemetryDetails,
  cleanPdfMetadata,
  cleanImageMetadata,
} from '@/lib/metadata-cleaner-logic';
import { useMetadataFilePreview } from './use-metadata-file-preview';

export function useMetadataCleanerWorkflow(isFr: boolean) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspection, setInspection] = useState<InspectionResult | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sensitive'>('all');

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CleanResult | null>(null);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0] ?? null;
  const { previewUrl, isPreviewLoading, imageDims } = useMetadataFilePreview(file);

  // Auto-consume handoff file from previous workflow step
  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      setFiles([staged]);
      setResult(null);
      setError(null);
    }
  }, []);

  // Inspect metadata live on file change
  useEffect(() => {
    if (!file) {
      setInspection(null);
      return;
    }

    let isMounted = true;
    setIsInspecting(true);

    inspectFileMetadata(file, isFr)
      .then((res) => {
        if (isMounted) {
          setInspection(res);
          setIsInspecting(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setInspection(null);
          setIsInspecting(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [file, isFr]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setInspection(null);
    setActiveFilter('all');
    setIsNextActionOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && files.length > 0 && !isProcessing) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files.length, isProcessing, handleReset]);

  const handleClean = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    trackToolUsed('metadata-cleaner', 'privacy');

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let blob: Blob;

      if (ext === 'pdf') {
        blob = await cleanPdfMetadata(file);
      } else {
        blob = await cleanImageMetadata(file, isFr);
      }

      const outputFilename = `anonymized_${file.name}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outputFilename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setResult({
        blob,
        filename: outputFilename,
        sizeBefore: file.size,
        sizeAfter: blob.size,
        tagsBeforeCount: inspection?.totalTags || 0,
      });
    } catch (e) {
      trackToolError('metadata-cleaner', 'general-error');
      setError(
        e instanceof Error
          ? e.message
          : isFr
          ? 'Une erreur est survenue lors du nettoyage'
          : 'An error occurred during cleaning'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFiles([droppedFile]);
      setResult(null);
      setError(null);
    }
  };

  const telemetryDetails = useMemo(() => {
    return computeTelemetryDetails(file, imageDims, inspection?.pageCount);
  }, [file, imageDims, inspection]);

  const visibleTags = useMemo(() => {
    if (!inspection) return [];
    return filterInspectionTags(inspection.tags, activeFilter);
  }, [inspection, activeFilter]);

  const targetFormat = useMemo(() => {
    if (!file) return getSourceDropzoneFormat(isFr);
    return getFileTargetFormat(file, isFr);
  }, [file, isFr]);

  return {
    files,
    file,
    isDragging,
    isInspecting,
    inspection,
    activeFilter,
    previewUrl,
    isPreviewLoading,
    isProcessing,
    error,
    result,
    isNextActionOpen,
    targetFormat,
    telemetryDetails,
    visibleTags,
    setFiles,
    setActiveFilter,
    setIsNextActionOpen,
    handleReset,
    handleClean,
    handleDownload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
