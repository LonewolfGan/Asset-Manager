import { useState, useCallback, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  type ImageTargetFormat,
  getSourceFormat,
  getTargetFormats,
  validatePptxFile,
  convertSlideFormat,
  buildSlideFilename,
  buildSlideZipFilename,
} from '@/lib/pptx-conversion-logic';

export interface PptxSlide {
  dataUrl: string;
  name: string;
}

export interface PptxConversionResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
  format: ImageTargetFormat;
}

export function usePptxToImagesWorkflow(isFr: boolean, errorMessageFallback?: string) {
  const sourceFormat = getSourceFormat(isFr);
  const targetFormats = getTargetFormats(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ImageTargetFormat>('png');
  const [slides, setSlides] = useState<PptxSlide[]>([]);
  const [result, setResult] = useState<PptxConversionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const [downloadedSlide, setDownloadedSlide] = useState<File | null>(null);

  const file = files[0];
  const activeTargetFormat = targetFormats[selectedFormat];

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validatePptxFile(selectedFile);
      if (!validation.valid) {
        if (validation.error === 'unsupported_format') {
          toast({
            variant: 'destructive',
            title: isFr ? 'Format non supporté' : 'Unsupported format',
            description: isFr
              ? 'Veuillez sélectionner une présentation PowerPoint (.pptx, .ppt) valide.'
              : 'Please select a valid PowerPoint presentation (.pptx, .ppt).',
          });
        } else if (validation.error === 'file_too_large') {
          toast({
            variant: 'destructive',
            title: isFr ? 'Fichier trop volumineux' : 'File too large',
            description: isFr
              ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
              : 'File exceeds the maximum allowed size of 50 MB.',
          });
        }
        return;
      }
      setFiles([selectedFile]);
      setSlides([]);
      setResult(null);
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
    setSlides([]);
    setResult(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
    setDownloadedSlide(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file || isProcessing) return;
    setIsProcessing(true);
    setSlides([]);

    try {
      trackToolUsed('pptx-to-images', 'documents');
      const form = new FormData();
      form.append('file', file);

      const [res] = await Promise.all([
        fetch(apiUrl('/api/tools/pptx-to-images'), {
          method: 'POST',
          body: form,
        }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? errorMessageFallback);
      }

      const zipBlob = await res.blob();
      const JSZip = (await import('jszip')).default;
      const rawZip = await JSZip.loadAsync(zipBlob);

      const slideNames = Object.keys(rawZip.files)
        .filter((n) => n.endsWith('.png'))
        .sort((a, b) => {
          const num = (s: string) => parseInt(s.match(/\d+/)?.[0] ?? '0', 10);
          return num(a) - num(b);
        });

      if (slideNames.length === 0) {
        throw new Error(
          errorMessageFallback ??
            (isFr ? 'Aucune diapositive générée.' : 'No slides generated.')
        );
      }

      const outputZip = new JSZip();
      const generated: PptxSlide[] = [];
      const baseName = file.name.replace(/\.pptx?$/i, '');

      for (let i = 0; i < slideNames.length; i++) {
        const rawName = slideNames[i];
        const rawBase64 = await rawZip.files[rawName].async('base64');
        const rawDataUrl = `data:image/png;base64,${rawBase64}`;

        const converted = await convertSlideFormat(rawDataUrl, selectedFormat);
        const slideFileName = buildSlideFilename(baseName, i + 1, selectedFormat);

        generated.push({ dataUrl: converted.dataUrl, name: slideFileName });
        outputZip.file(slideFileName, converted.blob);
      }

      const finalZipBlob = await outputZip.generateAsync({ type: 'blob' });
      const filename = buildSlideZipFilename(baseName, selectedFormat);

      setSlides(generated);
      setResult({
        blob: finalZipBlob,
        filename,
        sizeBefore: file.size,
        sizeAfter: finalZipBlob.size,
        format: selectedFormat,
      });
    } catch (err) {
      console.error('PPTX to Images conversion error:', err);
      trackToolError('pptx-to-images', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : errorMessageFallback ??
            (isFr
              ? 'Échec de la conversion de la présentation PowerPoint.'
              : 'Failed to convert PowerPoint presentation.');
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, selectedFormat, isFr, errorMessageFallback]);

  const handleDownloadSlide = useCallback(
    (slide: PptxSlide) => {
      const a = document.createElement('a');
      a.href = slide.dataUrl;
      a.download = slide.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      fetch(slide.dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const slideFile = new File([blob], slide.name, {
            type:
              selectedFormat === 'jpg'
                ? 'image/jpeg'
                : selectedFormat === 'webp'
                ? 'image/webp'
                : 'image/png',
          });
          setDownloadedSlide(slideFile);
          setTimeout(() => setIsNextActionOpen(true), 450);
        })
        .catch(() => {});
    },
    [selectedFormat]
  );

  const handleDownloadZip = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (slides.length === 1) {
      fetch(slides[0].dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const singleFile = new File([blob], slides[0].name, {
            type:
              selectedFormat === 'jpg'
                ? 'image/jpeg'
                : selectedFormat === 'webp'
                ? 'image/webp'
                : 'image/png',
          });
          setDownloadedSlide(singleFile);
          setTimeout(() => setIsNextActionOpen(true), 450);
        })
        .catch(() => {});
    }
  }, [result, slides, selectedFormat]);

  return {
    file,
    sourceFormat,
    targetFormats,
    activeTargetFormat,
    selectedFormat,
    setSelectedFormat,
    slides,
    result,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    downloadedSlide,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownloadSlide,
    handleDownloadZip,
  };
}

export type PptxToImagesWorkflow = ReturnType<typeof usePptxToImagesWorkflow>;
