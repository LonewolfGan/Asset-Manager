import { useState, useCallback, useEffect } from 'react';
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
} from '@/lib/html-to-markdown-logic';

export interface HtmlToMarkdownResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
  textOutput: string;
}

export function useHtmlToMarkdownWorkflow() {
  const { t, isFr } = useLocale();
  const tc = (t as any).htmlToMarkdown ?? {};

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
      } catch (err) {
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
  }, []);

  const handleConvert = useCallback(async () => {
    const rawHtml = htmlInput;
    if (!rawHtml.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      trackToolUsed('html-to-markdown', 'textCode');

      const [mdOutput] = await Promise.all([
        convertHtmlToMarkdown(rawHtml),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);

      const filename = buildMarkdownFilename(mode === 'upload' && file ? file.name : undefined);
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
      console.error('HTML to Markdown conversion error:', err);
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
