import { useState, useRef } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';

interface FileResult {
  id: string;
  file: File;
  originalUrl: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  blob?: Blob;
  compressedUrl?: string;
  error?: string;
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

function sizeDelta(before: number, after: number) {
  const pct = Math.round((1 - after / before) * 100);
  if (pct > 0) return { label: `-${pct}%`, color: 'var(--success, #16a34a)' };
  if (pct < 0) return { label: `+${Math.abs(pct)}%`, color: 'var(--danger, #dc2626)' };
  return { label: '0%', color: 'var(--text-secondary)' };
}

async function loadImageOnCanvas(src: string): Promise<HTMLCanvasElement> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error('Image load failed'));
    img.src = src;
  });
  const c = document.createElement('canvas');
  c.width = img.naturalWidth || img.width;
  c.height = img.naturalHeight || img.height;
  c.getContext('2d')!.drawImage(img, 0, 0);
  return c;
}

async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const mime = file.type.toLowerCase();
  if (mime === 'image/heic' || mime === 'image/heif' || file.name.match(/\.(heic|heif)$/i)) {
    const heic2any = (await import('heic2any')).default;
    const converted = await heic2any({ blob: file, toType: 'image/png', quality: 1 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    const url = URL.createObjectURL(blob);
    const c = await loadImageOnCanvas(url);
    URL.revokeObjectURL(url);
    return c;
  }
  if (mime === 'image/avif') {
    const avif = await import('@jsquash/avif');
    const buf = await file.arrayBuffer();
    const imageData = await avif.decode(buf);
    if (!imageData) throw new Error('AVIF decode returned null');
    const c = document.createElement('canvas');
    c.width = imageData.width;
    c.height = imageData.height;
    c.getContext('2d')!.putImageData(imageData as ImageData, 0, 0);
    return c;
  }
  const url = URL.createObjectURL(file);
  const c = await loadImageOnCanvas(url);
  URL.revokeObjectURL(url);
  return c;
}

async function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality = 0.92): Promise<Blob> {
  if (mime === 'image/avif') {
    try {
      const result = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, 'image/avif', quality)
      );
      if (result && result.size > 0) return result;
    } catch { /* fall through to jsquash */ }
    const avif = await import('@jsquash/avif');
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const buf = await avif.encode(imageData, { quality: Math.round(quality * 100) });
    return new Blob([buf], { type: 'image/avif' });
  }
  if (mime === 'application/pdf') {
    const jsPDF = (await import('jspdf')).jsPDF;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(dataUrl, 'JPEG', 0, 0, canvas.width, canvas.height);
    return pdf.output('blob');
  }
  if (mime === 'image/svg+xml') {
    const dataUrl = canvas.toDataURL('image/png');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/></svg>`;
    return new Blob([svg], { type: 'image/svg+xml' });
  }
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(
      (b) => (b ? res(b) : rej(new Error('Canvas export failed'))),
      mime,
      quality,
    )
  );
}

function extForMime(mime: string) {
  const map: Record<string, string> = {
    'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png',
    'image/avif': 'avif', 'image/gif': 'gif', 'image/svg+xml': 'svg',
    'image/bmp': 'bmp', 'image/tiff': 'tiff', 'application/pdf': 'pdf',
  };
  return map[mime] ?? 'img';
}

interface Props {
  fromLabel: string;
  fromExts: string[];
  fromMimes: string[];
  toMime: string;
  slug: string;
  breadcrumbParent?: string;
  trackUsed?: (toolSlug: string, category: string) => void;
  trackError?: (toolSlug: string, errorType: string) => void;
}

export default function ImageConvertPage({ fromLabel, fromExts, fromMimes, toMime, slug, breadcrumbParent = 'Image Tools', trackUsed, trackError }: Props) {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const toolTitle = t.tools[slug]?.title ?? slug;
  const toolDesc = t.tools[slug]?.description ?? '';
  const toExt = extForMime(toMime);

  const [files, setFiles] = useState<FileResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(92);
  const inputRef = useRef<HTMLInputElement>(null);

  const showQuality = ['image/jpeg', 'image/webp', 'image/avif'].includes(toMime);

  const addFiles = (incoming: File[]) => {
    const valid = incoming.filter((f) => {
      const m = f.type.toLowerCase();
      const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
      return fromMimes.some((fm) => m === fm) ||
        fromExts.some((fe) => fe.replace('.', '') === ext);
    });
    const entries: FileResult[] = valid.slice(0, 20 - files.length).map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      originalUrl: URL.createObjectURL(f),
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...entries]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f) { URL.revokeObjectURL(f.originalUrl); if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl); }
      return prev.filter((x) => x.id !== id);
    });
  };

  const processAll = async () => {
    setIsProcessing(true);
    const updated = [...files];
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === 'done') continue;
      updated[i] = { ...updated[i], status: 'processing' };
      setFiles([...updated]);
      try {
        const canvas = await fileToCanvas(updated[i].file);
        const blob = await canvasToBlob(canvas, toMime, quality / 100);
        const compressedUrl = URL.createObjectURL(blob);
        updated[i] = { ...updated[i], status: 'done', blob, compressedUrl };
        trackToolUsed(slug, 'images');
      } catch (err) {
        trackToolError(slug, 'general-error');
        updated[i] = { ...updated[i], status: 'error', error: err instanceof Error ? err.message : 'Conversion failed' };
      }
      setFiles([...updated]);
    }
    setIsProcessing(false);
  };

  const downloadOne = (entry: FileResult) => {
    if (!entry.blob) return;
    const url = URL.createObjectURL(entry.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = entry.file.name.replace(/\.[^.]+$/, `.${toExt}`);
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    const done = files.filter((f) => f.status === 'done' && f.blob);
    if (done.length === 1) { downloadOne(done[0]); return; }
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    for (const f of done) zip.file(f.file.name.replace(/\.[^.]+$/, `.${toExt}`), f.blob!);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `converted.zip`; a.click();
    URL.revokeObjectURL(url);
  };

  const doneCount = files.filter((f) => f.status === 'done').length;

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', breadcrumbParent, toolTitle]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{toolTitle}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{toolDesc || `Convert ${fromLabel} files to ${toExt.toUpperCase()} — all in your browser.`}</p>

        <div
          data-testid="drop-zone"
          role="button"
          tabIndex={0}
          aria-label={`Upload ${fromLabel} files. Drag and drop or click to browse.`}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(Array.from(e.dataTransfer.files)); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '36px 24px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-surface)', transition: 'border-color 0.15s' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
        >
          <input ref={inputRef} type="file" multiple accept={fromExts.join(',')} style={{ display: 'none' }}
            onChange={(e) => addFiles(Array.from(e.target.files ?? []))} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
            {t.common.dropFilesHere(fromLabel)}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>
            {fromExts.join(' · ').toUpperCase()} · up to 20 files · max 50 MB each
          </p>
        </div>

        {files.length > 0 && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {showQuality && (
              <div style={{ padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', minWidth: 60 }}>{t.common.quality}</span>
                <input type="range" min="1" max="100" value={quality} onChange={(e) => setQuality(+e.target.value)} style={{ flex: 1, accentColor: 'var(--accent)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', minWidth: 36 }}>{quality}%</span>
              </div>
            )}

            <button
              onClick={processAll}
              disabled={isProcessing}
              style={{ padding: '12px 24px', background: isProcessing ? 'var(--bg-elevated)' : 'var(--accent)', color: isProcessing ? 'var(--text-tertiary)' : 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
            >
              {isProcessing ? t.common.converting : t.common.convertFiles(files.length, toExt.toUpperCase())}
            </button>

            {files.map((entry) => (
              <div key={entry.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                  <div style={{ flex: 1, padding: '12px 14px', borderRight: isMobile ? 'none' : '1px solid var(--border)', borderBottom: isMobile ? '1px solid var(--border)' : 'none' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0 0 6px', textTransform: 'uppercase' }}>{t.common.original}</p>
                    {entry.file.type.startsWith('image/') || entry.file.type === '' ? (
                      <img src={entry.originalUrl} alt="original" style={{ width: '100%', maxHeight: 120, objectFit: 'contain', background: 'var(--bg-elevated)', display: 'block' }} />
                    ) : (
                      <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', borderRadius: 4 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{entry.file.type || 'image'}</span>
                      </div>
                    )}
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '6px 0 0' }}>{formatBytes(entry.file.size)}</p>
                  </div>
                  <div style={{ flex: 1, padding: '12px 14px' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0 0 6px', textTransform: 'uppercase' }}>{t.common.converted}</p>
                    {entry.status === 'done' && entry.compressedUrl && entry.blob ? (
                      <>
                        {toMime.startsWith('image/') && toMime !== 'image/svg+xml' ? (
                          <img src={entry.compressedUrl} alt="converted" style={{ width: '100%', maxHeight: 120, objectFit: 'contain', background: 'var(--bg-elevated)', display: 'block' }} />
                        ) : (
                          <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', borderRadius: 4 }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>{toExt.toUpperCase()}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{formatBytes(entry.blob.size)}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: sizeDelta(entry.file.size, entry.blob.size).color }}>
                            {sizeDelta(entry.file.size, entry.blob.size).label}
                          </span>
                        </div>
                      </>
                    ) : entry.status === 'processing' ? (
                      <div role="status" aria-live="polite" style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{t.common.converting}</div>
                    ) : entry.status === 'error' ? (
                      <div role="alert" style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger, #dc2626)', fontSize: 'var(--text-sm)', padding: 8, textAlign: 'center', fontFamily: 'var(--font-ui)' }}>{entry.error}</div>
                    ) : (
                      <div style={{ height: 100, background: 'var(--bg-elevated)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>—</div>
                    )}
                  </div>
                </div>
                <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={entry.file.name}>{entry.file.name}</span>
                  {entry.status === 'done' && (
                    <button aria-label={`Download ${entry.file.name}`} onClick={() => downloadOne(entry)} style={{ padding: '4px 12px', background: 'var(--text-primary)', color: 'var(--bg-base)', border: 'none', borderRadius: 5, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>{t.common.download}</button>
                  )}
                  <button aria-label={`Remove ${entry.file.name}`} onClick={() => removeFile(entry.id)} style={{ padding: '4px 10px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 5, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>{t.common.remove}</button>
                </div>
              </div>
            ))}

            {doneCount > 1 && (
              <button onClick={downloadAll} style={{ padding: '10px 24px', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer' }}>
                {t.common.downloadAll(doneCount)}
              </button>
            )}
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
    </>
  );
}
