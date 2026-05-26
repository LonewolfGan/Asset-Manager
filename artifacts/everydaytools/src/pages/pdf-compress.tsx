import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';

type Level = 'screen' | 'ebook' | 'prepress';

const LEVELS: { id: Level; label: string; dpi: number; description: string; quality: number }[] = [
  { id: 'screen', label: 'Screen', dpi: 72, description: '72 DPI — smallest file, for on-screen reading only', quality: 0.60 },
  { id: 'ebook', label: 'Ebook', dpi: 150, description: '150 DPI — balanced, suitable for general sharing', quality: 0.80 },
  { id: 'prepress', label: 'Prepress', dpi: 300, description: '300 DPI — light compression, print-quality retention', quality: 0.92 },
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
    await page.render({ canvasContext: ctx as unknown as CanvasRenderingContext2D, viewport }).promise;

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
  return new Blob([bytes], { type: 'application/pdf' });
}

export default function PdfCompress() {
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
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, `_${level}.pdf`), sizeBefore: file.size, sizeAfter: blob.size });
    } catch (e) {
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
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Compress PDF']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>
        PDF Compressor
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>
        Reduce PDF file size by re-rendering pages at a target DPI and quality. All processing runs in your browser.
      </p>

      <FileUpload accept={['.pdf', 'application/pdf']} maxSizeMB={50} onFiles={setFiles} />

      {files.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 10, fontFamily: 'IBM Plex Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Compression Level
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
                  border: `1px solid ${level === l.id ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)',
                  background: level === l.id ? '#F0F6FF' : 'var(--surface)',
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
                  <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                    {l.label}
                  </span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--muted)', marginLeft: 8 }}>
                    {l.dpi} DPI · quality {Math.round(l.quality * 100)}%
                  </span>
                  <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                    {l.description}
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
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Compress PDF
        </button>
      )}

      {isProcessing && <ProgressBar progress={progress} label="Compressing PDF — rendering pages..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 24, padding: 20, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            {[
              { label: 'Original', value: formatBytes(result.sizeBefore) },
              { label: 'Compressed', value: formatBytes(result.sizeAfter) },
              { label: 'Reduction', value: `${reduction > 0 ? '-' : '+'}${Math.abs(reduction)}%` },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 22, fontWeight: 600, color: s.label === 'Reduction' && reduction > 0 ? 'var(--success)' : 'var(--text)', margin: 0 }}>
                  {s.value}
                </p>
                <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 12, color: 'var(--muted)', margin: '2px 0 0' }}>
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
              background: 'var(--text)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Download {result.filename}
          </button>
        </div>
      )}

      <div
        style={{
          marginTop: 24,
          padding: '12px 16px',
          background: '#FFFBF0',
          border: '1px solid #E8D98A',
          borderRadius: 'var(--radius)',
          fontSize: 13,
          color: '#6B5C1A',
          fontFamily: 'IBM Plex Sans, sans-serif',
          lineHeight: 1.55,
        }}
      >
        <strong>Note:</strong> Compression results depend on the original PDF content. PDFs that are already optimized or contain mostly vector content may see minimal size reduction. This tool re-renders pages as JPEG images — text will not be selectable in the output.
      </div>
      <AdSlot type="horizontal" />
    </div>
  );
}
