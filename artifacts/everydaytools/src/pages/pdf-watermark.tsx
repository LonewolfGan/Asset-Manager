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

export default function PdfWatermark() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(60);
  const [opacity, setOpacity] = useState(0.3);
  const [colorStr, setColorStr] = useState("gray");

  const handleConvert = async () => {
    if (!files[0] || !text) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      trackToolUsed('pdf-watermark', 'pdf');
      const file = files[0];
      setProgress(30);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('text', text);
      fd.append('opacity', String(opacity));
      fd.append('color', colorStr);
      const res = await fetch(apiUrl('/api/tools/pdf-watermark'), { method: 'POST', body: fd });
      setProgress(80);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Processing failed');
      }
      const blob = await res.blob();
      setProgress(100);
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_watermarked.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('pdf-watermark', 'general-error');
      setError(e instanceof Error ? e.message : 'Processing failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'Watermark PDF']}
      title={t.tools['pdf-watermark']?.title ?? 'Watermark PDF'}
      description={t.tools['pdf-watermark']?.description ?? 'Add a diagonal text watermark to all pages of a PDF.'}
      seoSlug="pdf-watermark"
    >
      <ToolWorkspace>
        <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />

        {files.length > 0 && (
          <ToolCard title="WATERMARK SETTINGS">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>Watermark Text</label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>Font Size ({fontSize})</label>
                <input type="range" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>Opacity ({Math.round(opacity*100)}%)</label>
                <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>Color</label>
                <select value={colorStr} onChange={(e) => setColorStr(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
                  <option value="gray">Gray</option>
                  <option value="black">Black</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                </select>
              </div>
            </div>
          </ToolCard>
        )}

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing || !text}>
            Add Watermark
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Applying watermark..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
