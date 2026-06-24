import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolLoadingState from '@/components/ToolLoadingState';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { apiUrl } from '@/lib/apiBase';

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
      const res = await fetch(apiUrl('/api/tools/pdf-merge'), { method: 'POST', body: fd });
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
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Merge PDFs']} />
      <PageTitle>{t.tools['pdf-merge']?.title ?? 'Merge PDFs'}</PageTitle>
      <PageSubtitle>{t.tools['pdf-merge']?.description ?? 'Combine multiple PDF files into a single document instantly.'}</PageSubtitle>

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
