import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument, degrees } from 'pdf-lib';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

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
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
        setProgress(Math.round(((i + 1) / pages.length) * 50));
      }
      
      const pdfBytes = await pdfDoc.save();
      setProgress(100);
      
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_rotated.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('pdf-rotate', 'general-error');
      setError(e instanceof Error ? e.message : 'Rotation failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Rotate PDF']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['pdf-rotate']?.title ?? 'Rotate PDF'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{t.tools['pdf-rotate']?.description ?? 'Rotate all pages in a PDF file permanently.'}</p>
      
      <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 500, marginBottom: 16 }}>Rotation Angle</h3>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {([
              { value: 90,  label: 'Right (90°)' },
              { value: 180, label: 'Upside Down (180°)' },
              { value: 270, label: 'Left (270°)' },
            ] as const).map(({ value, label }) => (
              <label
                key={value}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 8, transition: 'background 120ms ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <input type="radio" checked={rotation === value} onChange={() => setRotation(value)} style={{ width: 15, height: 15 }} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Rotate PDF
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Applying rotation..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 'var(--text-sm)' }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="pdf-rotate" />
  </>
  );
}
