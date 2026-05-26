import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

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
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFiles = (files: FileList | File[]) => {
    setError(null);
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    // Quick extensions check - not perfect but good for UI feedback
    const validExtensions = accept.map(a => a.toLowerCase().replace('.', ''));
    const allAccept = accept.includes('*/*');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSizeBytes) {
        setError(`File ${file.name} exceeds ${maxSizeMB}MB limit.`);
        return;
      }
      
      if (!allAccept) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (!validExtensions.includes(ext) && !accept.includes(file.type)) {
          setError(`File ${file.name} format not accepted.`);
          return;
        }
      }

      validFiles.push(file);
      if (!multiple) break; // only take first file if not multiple
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      onFiles(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onFiles(newFiles);
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-[var(--radius)] p-8 text-center transition-colors cursor-pointer
          ${dragActive ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border)] hover:border-[var(--muted)]'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept.join(',')}
          multiple={multiple}
          onChange={handleChange}
        />
        <Upload className={`w-10 h-10 mx-auto mb-4 ${dragActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`} />
        <p className="text-[var(--text)] font-medium text-lg mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-[var(--muted)] text-sm">
          Accepted: {accept.join(', ')} • Max size: {maxSizeMB} MB per file
        </p>
      </div>

      {error && (
        <p className="text-[var(--danger)] text-sm mt-3 font-medium">{error}</p>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, i) => (
            <div key={i} className="flex items-center justify-between bg-white border border-[var(--border)] rounded-md p-3 shadow-sm">
              <div className="flex flex-col truncate pr-4">
                <span className="text-sm font-medium text-[var(--text)] truncate">{file.name}</span>
                <span className="text-xs text-[var(--muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="p-1 text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-full transition-colors flex-shrink-0"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
