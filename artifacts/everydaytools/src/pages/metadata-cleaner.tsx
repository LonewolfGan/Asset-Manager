import { useState, useRef } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { useLocale } from '@/hooks/use-locale';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace, ToolCard, ToolButton, ToolBadge } from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MetadataCleaner() {
  const { t } = useLocale();
  const title = t.tools['metadata-cleaner']?.title ?? 'Metadata Cleaner';
  const desc = t.tools['metadata-cleaner']?.description ?? 'Remove hidden metadata from PDFs, images, and documents.';
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ blob: Blob; cleaned: string[] } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f); setStatus('idle'); setError(''); setResult(null); setProgress(0);
  };

  const clean = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(10);
    trackToolUsed('metadata-cleaner', 'privacy');
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') {
        const { PDFDocument } = await import('pdf-lib');
        const ab = await file.arrayBuffer();
        const srcDoc = await PDFDocument.load(ab);
        const found = [srcDoc.getTitle() && 'Title', srcDoc.getAuthor() && 'Author', srcDoc.getSubject() && 'Subject'].filter(Boolean) as string[];
        setProgress(50);
        const newDoc = await PDFDocument.create();
        const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
        pages.forEach((p) => newDoc.addPage(p));
        setProgress(80);
        const bytes = await newDoc.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        setResult({ blob, cleaned: found.length ? found : ['No metadata found'] });
      } else {
        // Use API server: sharp re-encodes the image in the same format, stripping
        // all EXIF, XMP and ICC metadata. This preserves the original format (JPEG→JPEG,
        // WebP→WebP etc.) and quality — unlike Canvas which always outputs PNG.
        setProgress(30);
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/tools/image-metadata-clean', {
          method: 'POST',
          body: formData,
        });

        setProgress(70);

        if (!res.ok) {
          const data = await res.json().catch(() => ({})) as { error?: string };
          throw new Error(data.error ?? `Server error ${res.status}`);
        }

        const blob = await res.blob();
        setProgress(100);
        setResult({ blob, cleaned: ['EXIF data', 'XMP metadata', 'ICC profile'] });
      }
      setProgress(100);
      setStatus('done');
    } catch (e) {
      trackToolError('metadata-cleaner', 'general-error');
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Cleaning failed');
    }
  };

  const download = () => {
    if (!result || !file) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned_${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout breadcrumb={['Home', 'Privacy Tools', title]} title={title} description={desc} seoSlug="metadata-cleaner">
      <ToolWorkspace>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-card)', padding: '44px 28px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)', transition: 'all 0.15s' }}
        >
          <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.tiff,.tif" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)', margin: 0 }}>
            Drop a file here, or click to browse
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>PDF · JPEG · PNG · WebP · TIFF — up to 50 MB</p>
        </div>

        {file && (
          <ToolCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>{file.name}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{formatBytes(file.size)}</p>
              </div>
              <ToolButton variant="ghost" onClick={() => { setFile(null); setStatus('idle'); setResult(null); }}>Remove</ToolButton>
            </div>
          </ToolCard>
        )}

        {file && status !== 'processing' && (
          <ToolButton variant="primary" fullWidth onClick={clean}>Clean Metadata</ToolButton>
        )}

        <ToolLoadingState
          status={status === 'processing' ? 'loading' : status === 'error' ? 'error' : 'idle'}
          progress={status === 'processing' ? progress : undefined}
          label="Cleaning metadata..."
          errorMessage={error || undefined}
          onRetry={status === 'error' && file ? () => clean() : undefined}
        />

        {status === 'done' && result && (
          <ToolCard variant="result">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>Cleaned file ready</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{formatBytes(result.blob.size)}</p>
              </div>
              <ToolButton variant="primary" onClick={download}>Download</ToolButton>
            </div>
            {result.cleaned.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {result.cleaned.map((k) => <ToolBadge key={k}>{k}</ToolBadge>)}
              </div>
            )}
          </ToolCard>
        )}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
