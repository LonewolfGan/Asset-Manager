import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, FileSpreadsheet, Presentation, File } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { ActionTooltip } from '@/components/ui/tooltip';

export interface FileUploadProps {
  accept: string[];
  maxSizeMB: number;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  files?: File[];
  onClear?: () => void;
  className?: string;
}

interface FilePreviewItem {
  file: File;
  previewUrl?: string;
  isPdf?: boolean;
  isDoc?: boolean;
  isSheet?: boolean;
  isPresentation?: boolean;
}

export default function FileUpload({
  accept,
  maxSizeMB,
  multiple = false,
  onFiles,
  label,
  files: controlledFiles,
  onClear,
  className,
}: FileUploadProps) {
  const { t } = useLocale();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>(controlledFiles ?? []);
  const [previewItems, setPreviewItems] = useState<FilePreviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (controlledFiles !== undefined) {
      setSelectedFiles(controlledFiles);
    }
  }, [controlledFiles]);

  // Generate previews whenever selectedFiles change
  useEffect(() => {
    let isMounted = true;
    const generatedUrls: string[] = [];

    const loadPreviews = async () => {
      const items: FilePreviewItem[] = [];

      for (const file of selectedFiles) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const mime = file.type.toLowerCase();

        const isImage =
          mime.startsWith('image/') ||
          ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'bmp', 'svg'].includes(ext);
        const isPdf = mime === 'application/pdf' || ext === 'pdf';
        const isSheet = ['xlsx', 'xls', 'csv'].includes(ext) || mime.includes('spreadsheet') || mime.includes('excel');
        const isPres = ['pptx', 'ppt'].includes(ext) || mime.includes('presentation') || mime.includes('powerpoint');
        const isDoc = ['docx', 'doc', 'odt', 'rtf', 'txt', 'md'].includes(ext) || mime.includes('word') || mime.includes('document');

        if (isImage) {
          try {
            const url = URL.createObjectURL(file);
            generatedUrls.push(url);
            items.push({ file, previewUrl: url });
          } catch {
            items.push({ file });
          }
        } else if (isPdf) {
          try {
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
              'pdfjs-dist/build/pdf.worker.mjs',
              import.meta.url
            ).href;
            const buf = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.0 });
            const scale = 120 / Math.max(viewport.width, viewport.height);
            const scaledViewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              await page.render({ canvasContext: ctx, viewport: scaledViewport } as any).promise;
              const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
              items.push({ file, previewUrl: dataUrl, isPdf: true });
            } else {
              items.push({ file, isPdf: true });
            }
          } catch {
            items.push({ file, isPdf: true });
          }
        } else {
          items.push({
            file,
            isDoc,
            isSheet,
            isPresentation: isPres,
          });
        }
      }

      if (isMounted) {
        setPreviewItems(items);
      }
    };

    loadPreviews();

    return () => {
      isMounted = false;
      generatedUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [selectedFiles]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const validateAndSetFiles = (incoming: FileList | File[]) => {
    setError(null);
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const validExtensions = accept.map((a) => a.toLowerCase().replace('.', ''));
    const allAccept = accept.includes('*/*');

    for (let i = 0; i < incoming.length; i++) {
      const file = incoming[i];
      if (file.size > maxSizeBytes) {
        setError(`This file exceeds the ${maxSizeMB} MB limit. Please choose a smaller file.`);
        return;
      }
      if (!allAccept) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const mimeMatch = accept.some((a) => file.type && a.toLowerCase() === file.type.toLowerCase());
        const extMatch = validExtensions.includes(ext);
        if (!mimeMatch && !extMatch) {
          setError(`Unsupported file format. Please choose a supported file.`);
          return;
        }
      }
      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) {
      const updated = multiple ? [...selectedFiles, ...validFiles] : validFiles;
      setSelectedFiles(updated);
      onFiles(updated);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      validateAndSetFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.length) {
      validateAndSetFiles(e.target.files);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const openPicker = () => inputRef.current?.click();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  };

  const removeFile = (index: number) => {
    const next = [...selectedFiles];
    next.splice(index, 1);
    setSelectedFiles(next);
    onFiles(next);
    if (next.length === 0 && onClear) {
      onClear();
    }
  };

  const displayFormats =
    accept
      .filter((a) => a.startsWith('.'))
      .map((a) => a.toUpperCase().slice(1))
      .join(', ') || accept.join(', ');

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const hasFiles = previewItems.length > 0;

  return (
    <div className={`w-full ${className || ''}`}>
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        accept={accept.join(',')}
        multiple={multiple}
        onChange={handleChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {!hasFiles ? (
        <div
          role="button"
          tabIndex={0}
          aria-label={
            label
              ? `${label}. Drag and drop or press Enter to browse. Accepts ${displayFormats}, up to ${maxSizeMB} MB.`
              : `Upload file. Drag and drop or press Enter to browse. Accepts ${displayFormats}, up to ${maxSizeMB} MB.`
          }
          data-testid="drop-zone"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openPicker}
          onKeyDown={handleKeyDown}
          style={{
            padding: '48px 24px',
            border: `1.5px dashed ${dragActive ? 'var(--accent)' : 'var(--border-strong)'}`,
            borderRadius: 'var(--radius-card)',
            background: dragActive ? 'var(--accent-subtle)' : 'var(--bg-surface)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'background-color 150ms ease, border-color 150ms ease',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
          className="outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-base)] select-none"
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-card)',
              background: dragActive ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: dragActive ? 'var(--accent)' : 'var(--text-tertiary)',
              transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
            }}
          >
            <Upload size={20} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                margin: '0 0 4px',
              }}
            >
              {t?.ui?.dropzone || 'Choose a file or drag it here'}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                margin: 0,
              }}
            >
              {displayFormats} · Max {maxSizeMB} MB
            </p>
          </div>
        </div>
      ) : (
        /* Preview container inside the dropzone specifications */
        <div
          style={{
            padding: '24px',
            border: '1.5px dashed var(--border-strong)',
            borderRadius: 'var(--radius-card)',
            background: 'var(--bg-surface)',
            position: 'relative',
          }}
          data-testid="drop-zone-selected"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: previewItems.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {previewItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                }}
              >
                {/* Visual Thumbnail */}
                {item.previewUrl ? (
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: item.isPdf ? 'contain' : 'cover',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--radius)',
                      flexShrink: 0,
                      background: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border)',
                      color: item.isPdf
                        ? 'var(--accent)'
                        : item.isSheet
                        ? 'var(--text-secondary)'
                        : item.isDoc
                        ? '#3b82f6'
                        : 'var(--text-tertiary)',
                    }}
                  >
                    {item.isPdf ? (
                      <FileText size={28} strokeWidth={1.5} />
                    ) : item.isSheet ? (
                      <FileSpreadsheet size={28} strokeWidth={1.5} />
                    ) : item.isPresentation ? (
                      <Presentation size={28} strokeWidth={1.5} />
                    ) : item.isDoc ? (
                      <FileText size={28} strokeWidth={1.5} />
                    ) : (
                      <File size={28} strokeWidth={1.5} />
                    )}
                  </div>
                )}

                {/* File Information */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <ActionTooltip label={item.file.name}>
                    <p
                      data-testid="file-name"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      className="cursor-default"
                    >
                      {item.file.name}
                    </p>
                  </ActionTooltip>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      margin: '4px 0 0',
                    }}
                  >
                    {formatSize(item.file.size)}
                  </p>
                </div>

                {/* Discreet X button */}
                <ActionTooltip label="Retirer ce fichier">
                  <button
                    onClick={() => removeFile(idx)}
                    aria-label={`Remove ${item.file.name}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-tertiary)',
                      padding: '8px',
                      minWidth: '40px',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius)',
                      transition: 'color 150ms ease, background-color 150ms ease',
                    }}
                    className="hover:text-[var(--danger)] hover:bg-[var(--bg-surface)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </ActionTooltip>
              </div>
            ))}
          </div>

          {multiple && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={openPicker}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 500,
                  padding: '8px 12px',
                }}
                className="hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 rounded-[var(--radius)]"
              >
                + Add more files
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p
          role="alert"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--danger)',
            marginTop: 8,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

