import { useState, useRef } from 'react';
import { X } from 'lucide-react';

interface FileUploadProps {
  accept: string[];
  maxSizeMB: number;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
}

export default function FileUpload({ accept, maxSizeMB, multiple = false, onFiles }: FileUploadProps) {
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

  const removeFile = (index: number) => {
    const next = [...selectedFiles]; next.splice(index, 1); setSelectedFiles(next); onFiles(next);
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border-strong)'}`,
          background: dragActive ? 'var(--bg-subtle)' : 'var(--bg-surface)',
          padding: '36px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 120ms ease, background 120ms ease',
        }}
      >
        <input ref={inputRef} type="file" style={{ display: 'none' }} accept={accept.join(',')} multiple={multiple} onChange={handleChange} />
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 4px' }}>
          Drop file here or click to browse
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: 0 }}>
          {accept.join(', ')} · max {maxSizeMB} MB
        </p>
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--danger)', marginTop: 8 }}>{error}</p>
      )}

      {selectedFiles.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {selectedFiles.map((file, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '8px 12px', gap: 12 }}>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                aria-label="Remove file"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 120ms ease' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--danger)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)'}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
