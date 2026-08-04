import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace, ToolCard, ToolButton } from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';
import { apiUrl } from '@/lib/apiBase';

export default function PdfToImage() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [dpi, setDpi] = useState<72 | 150 | 300>(150);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(10);
    try {
      trackToolUsed('pdf-to-image', 'images');
      const file = files[0];
      const fd = new FormData();
      fd.append('file', file);
      fd.append('format', format);
      fd.append('dpi', String(dpi));

      setProgress(30);
      const res = await fetch(apiUrl('/api/tools/pdf-to-images'), { method: 'POST', body: fd });
      setProgress(90);

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Conversion failed');
      }

      const blob = await res.blob();
      setProgress(100);
      const ext = format === 'png' ? 'png' : 'jpg';
      const isZip = blob.type === 'application/zip';
      const filename = isZip
        ? file.name.replace(/\.pdf$/i, '_images.zip')
        : file.name.replace(/\.pdf$/i, `_page_1.${ext}`);
      setResult({ blob, filename, sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('pdf-to-image', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Image Tools', 'PDF to Image']}
      title={t.tools['pdf-to-image']?.title ?? 'PDF to Image'}
      description={t.tools['pdf-to-image']?.description ?? 'Convert PDF pages into high-quality JPEG or PNG images.'}
      seoSlug="pdf-to-image"
    >
      <ToolWorkspace>
        <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />

        {files.length > 0 && (
          <ToolCard title="FORMAT & RESOLUTION">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--panel-label-weight)' as React.CSSProperties['fontWeight'], marginBottom: 12 }}>Format</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {([{ value: 'jpeg', label: 'JPEG' }, { value: 'png', label: 'PNG' }] as const).map(({ value, label }) => (
                    <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                      <input type="radio" checked={format === value} onChange={() => setFormat(value)} style={{ width: 15, height: 15 }} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--panel-label-weight)' as React.CSSProperties['fontWeight'], marginBottom: 12 }}>Resolution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {([{ value: 72, label: 'Standard (72 DPI)' }, { value: 150, label: 'High (150 DPI)' }, { value: 300, label: 'Maximum (300 DPI)' }] as const).map(({ value, label }) => (
                    <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="radio" checked={dpi === value} onChange={() => setDpi(value)} style={{ accentColor: 'var(--accent)' }} />
                      <span style={{ fontSize: 'var(--text-sm)' }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </ToolCard>
        )}

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Extract Images
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Rendering PDF pages..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
