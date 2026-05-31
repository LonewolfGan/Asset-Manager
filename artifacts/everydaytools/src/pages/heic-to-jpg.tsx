import { useState } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function HeicToJpg() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      const heic2any = (await import('heic2any')).default;
      
      setProgress(50);
      
      const converted = await heic2any({
        blob: file,
        toType: format,
        quality: 0.9
      });
      
      const blob = Array.isArray(converted) ? converted[0] : converted;
      setProgress(100);
      trackToolUsed('heic-to-jpg', 'images');
      
      const ext = format === 'image/jpeg' ? '.jpg' : '.png';
      setResult({ blob, filename: file.name.replace(/\.heic$/i, ext).replace(/\.heif$/i, ext), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('heic-to-jpg', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Image Tools', 'HEIC to JPG']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['heic-to-jpg']?.title ?? 'HEIC to JPG'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['heic-to-jpg']?.description ?? 'Convert Apple iPhone HEIC/HEIF photos to universally compatible formats.'}</p>
      
      <FileUpload accept={['.heic', '.heif']} maxSizeMB={20} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Target Format</h3>
          <div style={{ display: 'flex', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="radio" checked={format === 'image/jpeg'} onChange={() => setFormat('image/jpeg')} style={{ accentColor: 'var(--accent)' }} />
              <span>JPEG (Smaller size)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="radio" checked={format === 'image/png'} onChange={() => setFormat('image/png')} style={{ accentColor: 'var(--accent)' }} />
              <span>PNG (Lossless)</span>
            </label>
          </div>
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Convert Photo
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Converting image..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="heic-to-jpg" />
  </>
  );
}
