import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolEmptyState,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';
import { apiUrl } from '@/lib/apiBase';

export default function PdfRotate() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      trackToolUsed('pdf-rotate', 'pdf');
      const file = files[0];
      setProgress(30);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('rotation', String(rotation));
      const res = await fetch(apiUrl('/api/tools/pdf-rotate'), { method: 'POST', body: fd });
      setProgress(80);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Rotation failed');
      }
      const blob = await res.blob();
      setProgress(100);
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_rotated.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('pdf-rotate', 'general-error');
      setError(e instanceof Error ? e.message : 'Rotation failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'Rotate PDF']}
      title={t.tools['pdf-rotate']?.title ?? 'Rotate PDF'}
      description={t.tools['pdf-rotate']?.description ?? 'Rotate all pages in a PDF file permanently.'}
      seoSlug="pdf-rotate"
    >
      <ToolWorkspace>
        <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />

        {files.length > 0 && (
          <ToolCard title="ROTATION">
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {([
                { value: 90,  label: 'Right (90°)' },
                { value: 180, label: 'Upside Down (180°)' },
                { value: 270, label: 'Left (270°)' },
              ] as const).map(({ value, label }) => (
                <label
                  key={value}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 'var(--radius-md)', transition: 'background 120ms ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <input type="radio" checked={rotation === value} onChange={() => setRotation(value)} style={{ width: 15, height: 15 }} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </ToolCard>
        )}

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Rotate PDF
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Applying rotation..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
