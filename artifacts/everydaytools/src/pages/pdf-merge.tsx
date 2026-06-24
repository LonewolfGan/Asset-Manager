import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolLoadingState from '@/components/ToolLoadingState';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

export default function PdfMerge() {
  const { t } = useLocale();
  const tc = t.pdfMerge;
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length < 2) { setError(tc.errorMin2); return; }
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      trackToolUsed('pdf-merge', 'pdf');
      const fd = new FormData();
      let totalSize = 0;
      for (const f of files) { fd.append('files', f); totalSize += f.size; }
      setProgress(20);
      const res = await fetch('/api/tools/pdf-merge', { method: 'POST', body: fd });
      setProgress(90);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Merge failed');
      }
      const blob = await res.blob();
      setResult({ blob, filename: 'merged_document.pdf', sizeAfter: blob.size, sizeBefore: totalSize });
      setProgress(100);
    } catch (e) {
      trackToolError('pdf-merge', 'general-error');
      setError(e instanceof Error ? e.message : 'Merge failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Merge PDFs']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['pdf-merge']?.title ?? 'Merge PDFs'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{t.tools['pdf-merge']?.description ?? 'Combine multiple PDF files into a single document instantly.'}</p>

      <FileUpload accept={['.pdf']} maxSizeMB={50} multiple={true} onFiles={setFiles} />

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing || files.length < 2}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: files.length < 2 ? 'not-allowed' : 'pointer', width: '100%', opacity: files.length < 2 ? 0.5 : 1 }}>
          {tc.mergeBtn(files.length)}
        </button>
      )}

      <ToolLoadingState
        status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
        progress={isProcessing ? progress : undefined}
        label={tc.mergingLabel}
        errorMessage={error ?? undefined}
        onRetry={error && files.length >= 2 ? handleConvert : undefined}
      />
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="pdf-merge" />
  </>
  );
}
