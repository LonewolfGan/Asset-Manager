import { useState, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace, ToolButton } from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';
import ResultPanel from '@/components/ResultPanel';
import FileUpload from '@/components/FileUpload';
import { apiUrl } from '@/lib/apiBase';

export default function PdfToPptx() {
  const { t } = useLocale();
  const title = t.tools['pdf-to-pptx']?.title ?? 'PDF to PowerPoint';
  const desc = t.tools['pdf-to-pptx']?.description ?? 'Convert each PDF page into a PowerPoint slide.';
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const convert = async () => {
    if (!files[0]) return;
    trackToolUsed('pdf-to-pptx', 'documents');
    setStatus('processing'); setProgress(20); setError('');
    try {
      const file = files[0];
      const fd = new FormData();
      fd.append('file', file);

      setProgress(40);
      const res = await fetch(apiUrl('/api/tools/pdf-to-pptx'), { method: 'POST', body: fd });
      setProgress(90);

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Conversion failed');
      }

      const blob = await res.blob();
      setProgress(100);
      setStatus('done');
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '.pptx'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('pdf-to-pptx', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setStatus('error');
    }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PowerPoint', title]}
      title={title}
      description={desc}
      seoSlug="pdf-to-pptx"
    >
      <ToolWorkspace>
        <div style={{ padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 20, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Converted using LibreOffice for maximum fidelity. Text and layout are preserved where possible.
        </div>
        <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
        {files.length > 0 && status !== 'processing' && (
          <ToolButton variant="primary" fullWidth onClick={convert}>
            Convert to PPTX
          </ToolButton>
        )}
        <ToolLoadingState
          status={status === 'processing' ? 'loading' : status === 'error' ? 'error' : 'idle'}
          progress={status === 'processing' ? progress : undefined}
          label="Converting with LibreOffice..."
          errorMessage={error || undefined}
          onRetry={status === 'error' && files.length > 0 ? convert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
