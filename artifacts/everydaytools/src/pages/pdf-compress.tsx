import { useState } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import FileUpload from '@/components/FileUpload';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { ToolLoadingState } from '@/components/ToolContent';

type Level = 'screen' | 'ebook' | 'prepress';

const LEVELS: { id: Level; label: string; labelFR: string; dpi: number; description: string; descriptionFR: string; quality: number }[] = [
  { id: 'screen', label: 'Screen', labelFR: 'Écran', dpi: 72, description: '72 DPI — smallest file, for on-screen reading only', descriptionFR: '72 PPP — fichier minimal, lecture à l\'écran uniquement', quality: 0.60 },
  { id: 'ebook', label: 'Ebook', labelFR: 'E-book', dpi: 150, description: '150 DPI — balanced, suitable for general sharing', descriptionFR: '150 PPP — équilibré, adapté au partage général', quality: 0.80 },
  { id: 'prepress', label: 'Prepress', labelFR: 'Impression', dpi: 300, description: '300 DPI — light compression, print-quality retention', descriptionFR: '300 PPP — compression légère, qualité d\'impression préservée', quality: 0.92 },
];

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

async function compressPdf(
  arrayBuffer: ArrayBuffer,
  level: Level,
  onProgress: (p: number) => void,
): Promise<Blob> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url,
  ).href;

  const cfg = LEVELS.find((l) => l.id === level)!;
  const scale = cfg.dpi / 96;

  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const { PDFDocument } = await import('pdf-lib');
  const newPdf = await PDFDocument.create();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext('2d')!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render({ canvasContext: ctx, viewport } as any).promise;

    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))),
        'image/jpeg',
        cfg.quality,
      ),
    );

    const jpgBytes = new Uint8Array(await blob.arrayBuffer());
    const img = await newPdf.embedJpg(jpgBytes);
    const newPage = newPdf.addPage([canvas.width, canvas.height]);
    newPage.drawImage(img, { x: 0, y: 0, width: canvas.width, height: canvas.height });

    onProgress(Math.round((i / pdf.numPages) * 88));
  }

  const bytes = await newPdf.save();
  onProgress(100);
  return new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
}

export default function PdfCompress() {
  const { t, locale } = useLocale();
  const tc = t.pdfCompress;
  const isFR = locale === 'FR';
  const [files, setFiles] = useState<File[]>([]);
  const [level, setLevel] = useState<Level>('ebook');
  const [result, setResult] = useState<{ blob: Blob; filename: string; sizeBefore: number; sizeAfter: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompress = async () => {
    if (!files[0]) return;
    setError(null);
    setResult(null);
    setIsProcessing(true);
    setProgress(0);
    try {
      const file = files[0];
      const ab = await file.arrayBuffer();
      setProgress(5);
      const blob = await compressPdf(ab, level, setProgress);
      trackToolUsed('pdf-compress', 'pdf');
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, `_${level}.pdf`), sizeBefore: file.size, sizeAfter: blob.size });
    } catch (e) {
      trackToolError('pdf-compress', 'general-error');
      setError(e instanceof Error ? e.message : 'Compression failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reduction = result ? Math.round((1 - result.sizeAfter / result.sizeBefore) * 100) : 0;

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Compress PDF']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>
        {t.tools['pdf-compress']?.title ?? 'PDF Compressor'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{t.tools['pdf-compress']?.description ?? 'Reduce PDF file size by re-rendering pages at a target DPI and quality. All processing runs in your browser.'}</p>

      <FileUpload accept={['.pdf', 'application/pdf']} maxSizeMB={50} onFiles={setFiles} />

      {files.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 10, fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {tc.compressionLevel}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LEVELS.map((l) => (
              <label
                key={l.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  border: `1px solid ${level === l.id ? 'var(--border-strong)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)',
                  background: level === l.id ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <input
                  type="radio"
                  name="level"
                  value={l.id}
                  checked={level === l.id}
                  onChange={() => setLevel(l.id)}
                  style={{ accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }}
                />
                <div>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {isFR ? l.labelFR : l.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginLeft: 8 }}>
                    {l.dpi} DPI · quality {Math.round(l.quality * 100)}%
                  </span>
                  <p style={{ margin: '2px 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>
                    {isFR ? l.descriptionFR : l.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button
          onClick={handleCompress}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '12px 24px',
            background: 'var(--accent)',
            color: 'var(--accent-text)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {tc.compressBtn}
        </button>
      )}

      <ToolLoadingState
        status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
        progress={isProcessing ? progress : undefined}
        label={tc.compressingLabel}
        errorMessage={error ?? undefined}
        onRetry={error && files.length > 0 ? handleCompress : undefined}
      />

      {result && (
        <div style={{ marginTop: 24, padding: 20, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            {[
              { label: tc.statsOriginal, value: formatBytes(result.sizeBefore) },
              { label: tc.statsCompressed, value: formatBytes(result.sizeAfter) },
              { label: tc.statsReduction, value: `${reduction > 0 ? '-' : '+'}${Math.abs(reduction)}%` },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 600, color: s.label === tc.statsReduction && reduction > 0 ? 'var(--success)' : 'var(--text-primary)', margin: 0 }}>
                  {s.value}
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={download}
            style={{
              width: '100%',
              padding: '10px 0',
              background: 'var(--accent)',
              color: 'var(--accent-text)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {tc.downloadBtn(result.filename)}
          </button>
        </div>
      )}

      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="pdf-compress" />
  </>
  );
}
