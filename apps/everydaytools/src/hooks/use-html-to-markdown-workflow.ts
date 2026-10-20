import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateHtmlInputFile,
  buildMarkdownFilename,
  convertHtmlToMarkdown,
  triggerDownload,
} from '@/lib/html-to-markdown-logic';
import type { ConversionFormat } from '@/components/conversion/types';

export interface HtmlToMarkdownResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
  textOutput: string;
}

export interface UseHtmlToMarkdownOptions {
  isFr?: boolean;
}

export interface UseHtmlToMarkdownWorkflowReturn {
  t: any;
  tc: Record<string, any>;
  isFr: boolean;
  sourceFormat: ConversionFormat;
  targetFormat: ConversionFormat;
  mode: 'upload' | 'paste';
  setMode: (mode: 'upload' | 'paste') => void;
  files: File[];
  file: File | undefined;
  htmlInput: string;
  setHtmlInput: (val: string) => void;
  isPastedStaged: boolean;
  setIsPastedStaged: (staged: boolean) => void;
  result: HtmlToMarkdownResult | null;
  isProcessing: boolean;
  isDragging: boolean;
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
  isNextActionOpen: boolean;
  setIsNextActionOpen: (open: boolean) => void;
  isStaged: boolean;
  stagedFile: File | null;
  validateAndSetFile: (selectedFile: File) => Promise<void>;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleReset: () => void;
  handleConvert: () => Promise<void>;
  handleDownload: () => void;
}

function useSafeLocale(options?: UseHtmlToMarkdownOptions) {
  try {
    const localeCtx = useLocale();
    return {
      t: localeCtx.t,
      tc: ((localeCtx.t as any).htmlToMarkdown ?? {}) as Record<string, any>,
      isFr: options?.isFr ?? localeCtx.isFr,
    };
  } catch {
    const isFr = options?.isFr ?? false;
    return {
      t: {
        nav: { breadcrumb: { home: isFr ? 'Accueil' : 'Home', documents: 'Documents' } },
        tools: {
          'html-to-markdown': {
            title: isFr ? 'HTML en Markdown' : 'HTML to Markdown',
            description: isFr
              ? 'Convertissez vos pages HTML en Markdown.'
              : 'Convert HTML code into clean Markdown documents.',
          },
        },
        htmlToMarkdown: {},
      },
      tc: {} as Record<string, any>,
      isFr,
    };
  }
}

export function useHtmlToMarkdownWorkflow(
  options?: UseHtmlToMarkdownOptions
): UseHtmlToMarkdownWorkflowReturn {
  const { t, tc, isFr } = useSafeLocale(options);

  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [htmlInput, setHtmlInput] = useState('');
  const [isPastedStaged, setIsPastedStaged] = useState(false);

  const [result, setResult] = useState<HtmlToMarkdownResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const hasConsumedHandoffRef = useRef(false);

  const file = files[0];

  const validateAndSetFile = useCallback(
    async (selectedFile: File) => {
      const validation = validateHtmlInputFile(selectedFile, isFr);
      if (!validation.isValid) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Format ou taille invalide' : 'Invalid format or size',
          description: validation.error,
        });
        return;
      }

      try {
        const text = await selectedFile.text();
        setHtmlInput(text);
        setFiles([selectedFile]);
        setResult(null);
      } catch {
        toast({
          variant: 'destructive',
          title: isFr ? 'Erreur de lecture' : 'Read error',
          description: isFr
            ? 'Impossible de lire le contenu du fichier sélectionné.'
            : 'Unable to read the content of the selected file.',
        });
      }
    },
    [isFr]
  );

  useEffect(() => {
    if (hasConsumedHandoffRef.current) return;
    hasConsumedHandoffRef.current = true;
    const staged = consumeHandoffFile();
    if (staged) {
      validateAndSetFile(staged);
    }
  }, [validateAndSetFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndSetFile(e.dataTransfer.files[0]);
      }
    },
    [validateAndSetFile]
  );

  const handleReset = useCallback(() => {
    setFiles([]);
    setHtmlInput('');
    setIsPastedStaged(false);
    setResult(null);
    setIsProcessing(false);
    setPreviewOpen(false);
    setIsNextActionOpen(false);
  }, []);

  // Global Escape shortcut when resting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Escape' &&
        !isProcessing &&
        (file || result || isPastedStaged || htmlInput.trim())
      ) {
        if (previewOpen || isNextActionOpen) return;
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') return;
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, handleReset, htmlInput, isNextActionOpen, isPastedStaged, isProcessing, previewOpen, result]);

  const handleConvert = useCallback(async () => {
    const rawHtml = htmlInput;
    if (!rawHtml.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      trackToolUsed('html-to-markdown', 'textCode');

      const mdOutput = await convertHtmlToMarkdown(rawHtml);

      const filename = buildMarkdownFilename(
        mode === 'upload' && file ? file.name : stagedFile?.name
      );
      const blob = new Blob([mdOutput], { type: 'text/markdown;charset=utf-8' });
      const sizeBefore =
        mode === 'upload' && file ? file.size : new Blob([rawHtml]).size;

      setResult({
        blob,
        filename,
        sizeAfter: blob.size,
        sizeBefore,
        textOutput: mdOutput,
      });
    } catch (err) {
      trackToolError('html-to-markdown', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : isFr
            ? 'Échec de la conversion du code HTML en Markdown. Veuillez vérifier votre syntaxe.'
            : 'Failed to convert HTML code to Markdown. Please check your syntax.';
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [htmlInput, isProcessing, mode, file, isFr]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);
    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  }, [result]);

  const isStaged = (mode === 'upload' && Boolean(file)) || (mode === 'paste' && isPastedStaged);

  const stagedFile =
    mode === 'upload' && file
      ? file
      : mode === 'paste' && isPastedStaged
        ? new File([htmlInput], isFr ? 'code-html.html' : 'html-code.html', { type: 'text/html' })
        : null;

  return {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    mode,
    setMode,
    files,
    file,
    htmlInput,
    setHtmlInput,
    isPastedStaged,
    setIsPastedStaged,
    result,
    isProcessing,
    isDragging,
    previewOpen,
    setPreviewOpen,
    isNextActionOpen,
    setIsNextActionOpen,
    isStaged,
    stagedFile,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  };
}
