import { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  type QueueItem,
  compositeImage,
  getOutputFilename,
  triggerDownload,
} from '@/lib/background-remover-logic';
import { useBackgroundRemoverQueue } from './use-background-remover-queue';
import { useBackgroundRemoverBackdrop } from './use-background-remover-backdrop';

export function useBackgroundRemoverWorkflow(isFr: boolean) {
  const queueState = useBackgroundRemoverQueue(isFr);
  const backdrop = useBackgroundRemoverBackdrop();

  const [inspectedIndex, setInspectedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompositing, setIsCompositing] = useState(false);
  const [downloadedResult, setDownloadedResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      queueState.handleFiles([staged]);
    }
  }, [queueState]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      queueState.handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFullReset = useCallback(() => {
    queueState.clearQueue();
    backdrop.resetBackdrop();
    setInspectedIndex(null);
    setIsNextActionOpen(false);
    setDownloadedResult(null);
  }, [queueState, backdrop]);

  const handleDownloadItem = async (item: QueueItem) => {
    if (!item.resultBlob) return;

    if (backdrop.backdropType === 'transparent') {
      const filename = getOutputFilename(item.file.name, 'transparent');
      triggerDownload(item.resultBlob, filename);
      setDownloadedResult({ blob: item.resultBlob, filename });
      setTimeout(() => setIsNextActionOpen(true), 450);
      return;
    }

    setIsCompositing(true);
    try {
      if (backdrop.backdropType === 'image' && backdrop.customBgFile) {
        const composedBlob = await compositeImage(item.resultBlob, {
          type: 'image',
          source: backdrop.customBgFile,
        });
        const filename = getOutputFilename(item.file.name, 'image');
        triggerDownload(composedBlob, filename);
        setDownloadedResult({ blob: composedBlob, filename });
        setTimeout(() => setIsNextActionOpen(true), 450);
        return;
      }

      let color = '#ffffff';
      if (backdrop.backdropType === 'white') color = '#ffffff';
      else if (backdrop.backdropType === 'dark') color = '#18181b';
      else if (backdrop.backdropType === 'neutral') color = '#f4f4f5';
      else if (backdrop.backdropType === 'custom') color = backdrop.customColor;

      const composedBlob = await compositeImage(item.resultBlob, color);
      const filename = getOutputFilename(item.file.name, 'color');
      triggerDownload(composedBlob, filename);
      setDownloadedResult({ blob: composedBlob, filename });
      setTimeout(() => setIsNextActionOpen(true), 450);
    } catch {
      const filename = getOutputFilename(item.file.name, 'transparent');
      triggerDownload(item.resultBlob, filename);
      setDownloadedResult({ blob: item.resultBlob, filename });
      setTimeout(() => setIsNextActionOpen(true), 450);
    } finally {
      setIsCompositing(false);
    }
  };

  const handleDownloadBatchZip = async () => {
    const doneItems = queueState.queue.filter((q) => q.status === 'done' && q.resultBlob);
    if (doneItems.length === 0) return;

    if (doneItems.length === 1) {
      handleDownloadItem(doneItems[0]);
      return;
    }

    const zip = new JSZip();
    for (const item of doneItems) {
      const filename = getOutputFilename(item.file.name, 'transparent');
      zip.file(filename, item.resultBlob!);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(zipBlob, isFr ? 'photos_detourees.zip' : 'cutout_photos.zip');
  };

  const isSingle = queueState.queue.length === 1;
  const singleItem = isSingle ? queueState.queue[0] : null;
  const isInspecting = inspectedIndex !== null && queueState.queue[inspectedIndex] !== undefined;
  const activeStudioItem = isInspecting ? queueState.queue[inspectedIndex!] : singleItem;

  const doneCountTotal = queueState.queue.filter((q) => q.status === 'done').length;
  const allBatchFinished =
    queueState.queue.length > 1 &&
    !queueState.isProcessing &&
    queueState.queue.every((q) => q.status === 'done' || q.status === 'error');

  return {
    queueState,
    backdrop,
    inspectedIndex,
    setInspectedIndex,
    isDragging,
    isCompositing,
    downloadedResult,
    isNextActionOpen,
    setIsNextActionOpen,
    isSingle,
    singleItem,
    isInspecting,
    activeStudioItem,
    doneCountTotal,
    allBatchFinished,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFullReset,
    handleDownloadItem,
    handleDownloadBatchZip,
  };
}
