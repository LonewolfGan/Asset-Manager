import { useState, useEffect, useCallback, useRef } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import type { QueueItem } from '@/lib/background-remover-logic';

export function useBackgroundRemoverQueue(isFr: boolean) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const cancelledRef = useRef(false);

  const queueRef = useRef<QueueItem[]>(queue);
  queueRef.current = queue;

  useEffect(() => {
    return () => {
      queueRef.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
      });
    };
  }, []);

  const updateItem = useCallback((index: number, patch: Partial<QueueItem>) => {
    setQueue((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], ...patch };
      }
      return next;
    });
  }, []);

  const processQueue = useCallback(async (itemsToProcess: QueueItem[]) => {
    cancelledRef.current = false;
    setIsProcessing(true);

    let completed = 0;

    for (let i = 0; i < itemsToProcess.length; i++) {
      if (cancelledRef.current) break;
      if (itemsToProcess[i].status === 'done') {
        completed++;
        continue;
      }

      updateItem(i, { status: 'processing', error: undefined });

      try {
        const formData = new FormData();
        formData.append('file', itemsToProcess[i].file);

        const response = await fetch(apiUrl('/api/remove-background'), {
          method: 'POST',
          body: formData,
        });

        if (cancelledRef.current) break;

        if (!response.ok) {
          let msg = isFr ? 'Échec du détourage' : 'Background removal failed';
          try {
            const j = (await response.json()) as { error?: string };
            if (j?.error) msg = j.error;
          } catch {}
          updateItem(i, { status: 'error', error: msg });
          trackToolError('background-remover', 'general-error');
          continue;
        }

        const blob = await response.blob();
        const resultUrl = URL.createObjectURL(blob);

        if (cancelledRef.current) {
          URL.revokeObjectURL(resultUrl);
          break;
        }

        updateItem(i, { status: 'done', resultBlob: blob, resultUrl });
        trackToolUsed('background-remover', 'images');
        completed++;
        setDoneCount(completed);
      } catch (e) {
        if (cancelledRef.current) break;
        const msg = e instanceof Error ? e.message : (isFr ? 'Erreur réseau' : 'Network error');
        updateItem(i, { status: 'error', error: msg });
      }
    }

    setIsProcessing(false);
  }, [isFr, updateItem]);

  const handleFiles = useCallback((files: File[]) => {
    const valid = files.filter((f) => f.type.startsWith('image/'));
    if (valid.length === 0) return;

    const newItems: QueueItem[] = valid.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      const item: QueueItem = {
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        status: 'pending',
        previewUrl,
      };

      const img = new Image();
      img.onload = () => {
        item.dims = { w: img.naturalWidth, h: img.naturalHeight };
        setQueue((prev) => [...prev]);
      };
      img.src = previewUrl;

      return item;
    });

    setQueue(newItems);
    setDoneCount(0);

    setTimeout(() => {
      processQueue(newItems);
    }, 50);
  }, [processQueue]);

  const handleCancel = useCallback(() => {
    cancelledRef.current = true;
    setIsProcessing(false);
  }, []);

  const clearQueue = useCallback(() => {
    queue.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });
    setQueue([]);
    setDoneCount(0);
    setIsProcessing(false);
  }, [queue]);

  const retryItem = useCallback(async (index: number) => {
    if (index < 0 || index >= queue.length) return;
    cancelledRef.current = false;
    setIsProcessing(true);
    updateItem(index, { status: 'processing', error: undefined });

    try {
      const formData = new FormData();
      formData.append('file', queue[index].file);

      const response = await fetch(apiUrl('/api/remove-background'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let msg = isFr ? 'Échec du détourage' : 'Background removal failed';
        try {
          const j = (await response.json()) as { error?: string };
          if (j?.error) msg = j.error;
        } catch {}
        updateItem(index, { status: 'error', error: msg });
      } else {
        const blob = await response.blob();
        const resultUrl = URL.createObjectURL(blob);
        updateItem(index, { status: 'done', resultBlob: blob, resultUrl });
        trackToolUsed('background-remover', 'images');
        setDoneCount((prev) => prev + 1);
      }
    } catch (e) {
      updateItem(index, {
        status: 'error',
        error: e instanceof Error ? e.message : (isFr ? 'Erreur réseau' : 'Network error'),
      });
    }

    setIsProcessing(false);
  }, [isFr, queue, updateItem]);

  return {
    queue,
    setQueue,
    isProcessing,
    doneCount,
    handleFiles,
    handleCancel,
    clearQueue,
    retryItem,
  };
}
