import { useState, useCallback, useRef, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import type {
  ToolEngineContract,
  ToolExecuteOptions,
  ToolProgress,
  ToolResult,
  ToolWorkflowStatus,
} from './tool-contract';

export interface UseToolWorkflowOptions<TInput = File, TOutput = Blob> {
  engine: ToolEngineContract<TInput, ToolExecuteOptions, TOutput>;
  acceptedMimeTypes?: string[];
  maxFileSizeBytes?: number;
  toolSlug?: string;
  category?: string;
  autoConsumeHandoff?: boolean;
  onSuccess?: (result: ToolResult<TOutput>) => void;
  onError?: (error: Error | string) => void;
}

export interface UseToolWorkflowReturn<TOutput = Blob> {
  status: ToolWorkflowStatus;
  inputFile: File | null;
  isProcessing: boolean;
  progress: ToolProgress;
  result: ToolResult<TOutput> | null;
  error: string | null;
  handleFileSelect: (file: File) => boolean;
  handleExecute: () => Promise<ToolResult<TOutput> | null>;
  handleCancel: () => void;
  handleReset: () => void;
  setInputFile: (file: File | null) => void;
  setResult: (result: ToolResult<TOutput> | null) => void;
  setError: (error: string | null) => void;
}

export function useToolWorkflow<TInput = File, TOutput = Blob>(
  options: UseToolWorkflowOptions<TInput, TOutput>
): UseToolWorkflowReturn<TOutput> {
  const {
    engine,
    acceptedMimeTypes,
    maxFileSizeBytes,
    toolSlug,
    category,
    autoConsumeHandoff,
    onSuccess,
    onError,
  } = options;

  const [status, setStatus] = useState<ToolWorkflowStatus>('idle');
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<ToolProgress>({ percent: 0 });
  const [result, setResult] = useState<ToolResult<TOutput> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputFileRef = useRef<File | null>(null);
  inputFileRef.current = inputFile;

  const isProcessingRef = useRef<boolean>(false);
  isProcessingRef.current = isProcessing;

  const abortControllerRef = useRef<AbortController | null>(null);
  const hasConsumedHandoffRef = useRef<boolean>(false);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const engineRef = useRef(engine);
  engineRef.current = engine;

  const handleFileSelect = useCallback(
    (file: File): boolean => {
      if (acceptedMimeTypes && acceptedMimeTypes.length > 0) {
        const isMimeValid = acceptedMimeTypes.some((type) => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.slice(0, -1));
          }
          return file.type === type;
        });

        if (!isMimeValid) {
          if (toolSlug) {
            trackToolError(toolSlug, 'invalid_mime_type');
          }
          setError('Format de fichier non pris en charge.');
          setStatus('idle');
          setInputFile(null);
          return false;
        }
      }

      if (maxFileSizeBytes && file.size > maxFileSizeBytes) {
        if (toolSlug) {
          trackToolError(toolSlug, 'file_too_large');
        }
        setError('Le fichier est trop volumineux.');
        setStatus('idle');
        setInputFile(null);
        return false;
      }

      setInputFile(file);
      setError(null);
      setResult(null);
      setProgress({ percent: 0 });
      setStatus('staged');
      return true;
    },
    [acceptedMimeTypes, maxFileSizeBytes, toolSlug]
  );

  const handleExecute = useCallback(async (): Promise<ToolResult<TOutput> | null> => {
    const currentFile = inputFileRef.current;
    if (!currentFile || isProcessingRef.current) {
      return null;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsProcessing(true);
    setStatus('processing');
    setError(null);
    setProgress({ percent: 0, stage: 'starting', message: 'Initialisation...' });

    try {
      const res = await engineRef.current.execute(currentFile as unknown as TInput, {
        signal: controller.signal,
        onProgress: (p: ToolProgress) => {
          setProgress(p);
        },
      });

      if (controller.signal.aborted) {
        return null;
      }

      setResult(res);
      setStatus('completed');
      setIsProcessing(false);
      setProgress({ percent: 100, stage: 'complete', message: 'Terminé' });

      if (toolSlug) {
        trackToolUsed(toolSlug, category ?? 'general');
      }

      onSuccessRef.current?.(res);
      return res;
    } catch (err: unknown) {
      if (controller.signal.aborted) {
        setIsProcessing(false);
        setStatus('staged');
        return null;
      }

      const errorMessage =
        err instanceof Error ? err.message : 'Une erreur inattendue est survenue lors du traitement.';

      setError(errorMessage);
      setStatus('error');
      setIsProcessing(false);

      if (toolSlug) {
        trackToolError(toolSlug, 'execution_error');
      }

      onErrorRef.current?.(err instanceof Error ? err : new Error(errorMessage));
      return null;
    } finally {
      abortControllerRef.current = null;
    }
  }, [category, toolSlug]);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    engineRef.current.abort?.();
    setIsProcessing(false);
    setStatus('staged');
    setResult(null);
  }, []);

  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    engineRef.current.abort?.();
    setInputFile(null);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setProgress({ percent: 0 });
    setStatus('idle');
  }, []);

  useEffect(() => {
    if (autoConsumeHandoff && !hasConsumedHandoffRef.current) {
      const stagedFile = consumeHandoffFile();
      if (stagedFile) {
        hasConsumedHandoffRef.current = true;
        handleFileSelect(stagedFile);
      }
    }
  }, [autoConsumeHandoff, handleFileSelect]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    status,
    inputFile,
    isProcessing,
    progress,
    result,
    error,
    handleFileSelect,
    handleExecute,
    handleCancel,
    handleReset,
    setInputFile,
    setResult,
    setError,
  };
}
