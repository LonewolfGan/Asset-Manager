import { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

interface FileUploadProps {
  accept: string[];
  maxSizeMB: number;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
}

export default function FileUpload({ accept, maxSizeMB, multiple = false, onFiles, label }: FileUploadProps) {
  const { t } = useLocale();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const validateAndSetFiles = (files: FileList | File[]) => {
    setError(null);
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const validExtensions = accept.map(a => a.toLowerCase().replace('.', ''));
    const allAccept = accept.includes('*/*');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSizeBytes) { setError(`${file.name} exceeds the ${maxSizeMB} MB limit.`); return; }
      if (!allAccept) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (!validExtensions.includes(ext) && !accept.includes(file.type)) { setError(`${file.name} — format not accepted.`); return; }
      }
      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) { setSelectedFiles(validFiles); onFiles(validFiles); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) validateAndSetFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) validateAndSetFiles(e.target.files);
  };

  const openPicker = () => inputRef.current?.click();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  };

  const removeFile = (index: number) => {
    const next = [...selectedFiles]; next.splice(index, 1); setSelectedFiles(next); onFiles(next);
  };

  const ariaLabel = label
    ? `${label}. Drag and drop or press Enter to browse. Accepts ${accept.join(', ')}, up to ${maxSizeMB} MB.`
    : `Upload file. Drag and drop or press Enter to browse. Accepts ${accept.join(', ')}, up to ${maxSizeMB} MB.`;

  return (
    <div style={{ width: '100%' }}>
      <div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        data-testid="drop-zone"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
        style={{
          border: `1.5px dashed ${dragActive ? 'var(--accent)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius-card)',
          background: dragActive ? 'var(--accent-subtle)' : 'var(--bg-surface)',
          padding: '56px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 200ms ease, background 200ms ease',
          boxShadow: dragActive ? 'none' : 'var(--shadow-card)',
          minHeight: 140,
        }}
      >
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: dragActive ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: dragActive ? 'var(--accent)' : 'var(--text-tertiary)',
            transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease',
          }}>
            <Upload size={20} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 4px' }}>
              {t.ui.dropzone}
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: 0 }}>
              {t.ui.dropzoneHint(accept.join(', '), maxSizeMB)}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--danger)', marginTop: 8 }}>{error}</p>
      )}

      {selectedFiles.length > 0 && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {selectedFiles.map((file, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '10px 14px', gap: 12,
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p data-testid="file-name" style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                aria-label={`Remove ${file.name}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, minWidth: 44, minHeight: 44, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'color 150ms ease', borderRadius: 6 }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--danger)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)'}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
