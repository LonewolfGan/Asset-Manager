import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function BackgroundRemover() {
  const { t } = useLocale();
  const tc = t.backgroundRemover;
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingEngine, setLoadingEngine] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0); setLoadingEngine(true);
    try {
      const file = files[0];
      setLoadingEngine(false);
      setProgress(10);

      const fd = new FormData();
      fd.append('file', file);

      setProgress(20);
      const res = await fetch('/api/remove-background', { method: 'POST', body: fd });
      setProgress(90);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Server error' }));
        throw new Error(err.error ?? 'Background removal failed');
      }

      const arrayBuffer = await res.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'image/png' });
      setProgress(100);
      setResult({ blob, filename: file.name.replace(/\.[^/.]+$/, '_nobg.png'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); setLoadingEngine(false); }
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Image Tools', 'Background Remover']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['background-remover']?.title ?? 'Background Remover'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['background-remover']?.description ?? 'Remove image backgrounds entirely in your browser using local AI.'}</p>

      <div style={{ padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 24, fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', lineHeight: 1.55 }}>
        {tc.note}
      </div>

      <FileUpload accept={['image/jpeg', 'image/png', 'image/webp']} maxSizeMB={10} onFiles={setFiles} />

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          {tc.removeBtn}
        </button>
      )}

      {isProcessing && <ProgressBar progress={progress} label={loadingEngine ? tc.loadingModel : tc.processingImage} />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14, fontFamily: 'var(--font-ui)' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, fontFamily: 'var(--font-ui)', color: 'var(--text-primary)' }}>{tc.original}</p>
              <img src={URL.createObjectURL(files[0])} style={{ width: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} alt={tc.original} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, fontFamily: 'var(--font-ui)', color: 'var(--text-primary)' }}>{tc.result}</p>
              <div style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h10v10H0zm10 10h10v10H10z\' fill=\'%23e5e5e5\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <img src={URL.createObjectURL(result.blob)} style={{ width: '100%', display: 'block' }} alt={tc.result} />
              </div>
            </div>
          </div>
          <ResultPanel {...result} />
        </div>
      )}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="background-remover" />
  </>
  );
}
