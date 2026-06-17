import { useState } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
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
  const [statusLabel, setStatusLabel] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null);
    setResult(null);
    setIsProcessing(true);
    setProgress(0);
    setStatusLabel('Loading...');

    try {
      const file = files[0];

      const { removeBackground } = await import('@imgly/background-removal');

      setProgress(5);
      setStatusLabel('Downloading model...');

      let fetchDone = false;

      const blob = await removeBackground(file, {
        publicPath: 'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/',
        model: 'isnet_quint8',
        output: { format: 'image/png' },
        progress: (key: string, current: number, total: number) => {
          if (key.startsWith('fetch:')) {
            if (!fetchDone) {
              const pct = total > 0 ? Math.round((current / total) * 50) : 0;
              setProgress(5 + pct);
              setStatusLabel('Downloading model...');
              if (current >= total && total > 0) fetchDone = true;
            }
          } else if (key.startsWith('compute:')) {
            if (!fetchDone) { fetchDone = true; }
            const pct = total > 0 ? Math.round((current / total) * 44) : 0;
            setProgress(55 + pct);
            setStatusLabel('Processing...');
          }
        },
      });

      setProgress(100);
      setStatusLabel('Done');
      trackToolUsed('background-remover', 'images');
      setResult({
        blob,
        filename: file.name.replace(/\.[^/.]+$/, '_nobg.png'),
        sizeAfter: blob.size,
        sizeBefore: file.size,
      });
    } catch (e) {
      trackToolError('background-remover', 'general-error');
      setError(e instanceof Error ? e.message : 'Background removal failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setStatusLabel('');
    }
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Image Tools', 'Background Remover']} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>
          {t.tools['background-remover']?.title ?? 'Background Remover'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>
          {t.tools['background-remover']?.description ?? 'Remove backgrounds from photos instantly. Free, no account required.'}
        </p>

        <FileUpload accept={['image/jpeg', 'image/png', 'image/webp']} maxSizeMB={10} onFiles={setFiles} />

        {files.length > 0 && !isProcessing && (
          <button
            onClick={handleConvert}
            disabled={isProcessing}
            style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', width: '100%' }}
          >
            {tc.removeBtn}
          </button>
        )}

        {isProcessing && (
          <div style={{ marginTop: 16 }}>
            <ProgressBar progress={progress} />
            {statusLabel && (
              <p style={{ marginTop: 8, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)', textAlign: 'center' }}>
                {statusLabel}
              </p>
            )}
          </div>
        )}

        {error && (
          <div style={{
            marginTop: 16,
            padding: '14px 16px',
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.22)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="8" cy="8" r="7" stroke="var(--danger)" strokeWidth="1.5" />
              <path d="M8 4.5v4" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="var(--danger)" />
            </svg>
            <span style={{ color: 'var(--danger)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)', lineHeight: 1.55 }}>
              {error}
            </span>
          </div>
        )}

        {result && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 8, fontFamily: 'var(--font-ui)', color: 'var(--text-primary)' }}>{tc.original}</p>
                <img src={URL.createObjectURL(files[0])} style={{ width: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} alt={tc.original} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 8, fontFamily: 'var(--font-ui)', color: 'var(--text-primary)' }}>{tc.result}</p>
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
