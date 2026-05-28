import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

type Mode = 'quality' | 'target';
type ResizeMode = 'none' | 'percent' | 'dimensions';

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

function reduction(orig: number, compressed: number) {
  const pct = Math.round((1 - compressed / orig) * 100);
  return pct > 0 ? `-${pct}%` : `+${Math.abs(pct)}%`;
}

async function drawToCanvas(
  file: File,
  resizeMode: ResizeMode,
  resizePct: number,
  resizeW: number,
  resizeH: number,
): Promise<HTMLCanvasElement> {
  const img = new Image();
  const url = URL.createObjectURL(file);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
  URL.revokeObjectURL(url);

  let w = img.width;
  let h = img.height;

  if (resizeMode === 'percent' && resizePct > 0 && resizePct !== 100) {
    w = Math.round(w * resizePct / 100);
    h = Math.round(h * resizePct / 100);
  } else if (resizeMode === 'dimensions') {
    if (resizeW > 0 && resizeH > 0) {
      const ratio = Math.min(resizeW / w, resizeH / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    } else if (resizeW > 0) {
      h = Math.round(h * (resizeW / w));
      w = resizeW;
    } else if (resizeH > 0) {
      w = Math.round(w * (resizeH / h));
      h = resizeH;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

function getMime(file: File): string {
  if (file.type === 'image/png') return 'image/png';
  if (file.type === 'image/webp') return 'image/webp';
  if (file.type === 'image/avif') return 'image/avif';
  return 'image/jpeg';
}

async function blobAtQuality(canvas: HTMLCanvasElement, mime: string, q: number): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))),
      mime,
      q,
    ),
  );
}

async function binarySearchQuality(
  canvas: HTMLCanvasElement,
  mime: string,
  targetBytes: number,
): Promise<Blob> {
  let lo = 0.01;
  let hi = 1.0;
  let best: Blob | null = null;

  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    const blob = await blobAtQuality(canvas, mime, mid);
    if (blob.size <= targetBytes) {
      best = blob;
      lo = mid;
    } else {
      hi = mid;
    }
    if (hi - lo < 0.005) break;
  }

  return best ?? (await blobAtQuality(canvas, mime, 0.01));
}

async function stripExif(blob: Blob, file: File): Promise<Blob> {
  if (!file.type.startsWith('image/jpeg')) return blob;
  try {
    const piexif = (await import('piexifjs')).default;
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((res, rej) => {
      reader.onload = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(blob);
    });
    const stripped = piexif.remove(dataUrl);
    const byteString = atob(stripped.split(',')[1]);
    const arr = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) arr[i] = byteString.charCodeAt(i);
    return new Blob([arr], { type: 'image/jpeg' });
  } catch {
    return blob;
  }
}

export default function ImageCompress() {
  const { t } = useLocale();
  const [files, setFiles] = useState<FileResult[]>([]);
  const [mode, setMode] = useState<Mode>('quality');
  const [quality, setQuality] = useState(80);
  const [targetKB, setTargetKB] = useState('200');
  const [resizeMode, setResizeMode] = useState<ResizeMode>('none');
  const [resizePct, setResizePct] = useState(75);
  const [resizeW, setResizeW] = useState('');
  const [resizeH, setResizeH] = useState('');
  const [stripMeta, setStripMeta] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: File[]) => {
    const valid = incoming
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 20 - files.length);
    const entries: FileResult[] = valid.map((f) => ({
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
      if (f) {
        URL.revokeObjectURL(f.originalUrl);
        if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
      }
      return prev.filter((x) => x.id !== id);
    });
  };

  const processAll = async () => {
    setIsProcessing(true);
    const targetBytes = mode === 'target' ? parseFloat(targetKB) * 1024 : 0;
    const w = parseInt(resizeW) || 0;
    const h = parseInt(resizeH) || 0;

    const updated = [...files];

    for (let i = 0; i < updated.length; i++) {
      const entry = updated[i];
      if (entry.status === 'done') continue;
      updated[i] = { ...entry, status: 'processing' };
      setFiles([...updated]);

      try {
        const canvas = await drawToCanvas(entry.file, resizeMode, resizePct, w, h);
        const mime = getMime(entry.file);

        let blob: Blob;
        if (mode === 'quality') {
          blob = await blobAtQuality(canvas, mime, quality / 100);
        } else {
          blob = await binarySearchQuality(canvas, mime, targetBytes);
        }

        if (stripMeta) blob = await stripExif(blob, entry.file);

        const compressedUrl = URL.createObjectURL(blob);
        updated[i] = { ...updated[i], status: 'done', blob, compressedUrl };
      } catch (err) {
        updated[i] = {
          ...updated[i],
          status: 'error',
          error: err instanceof Error ? err.message : 'Failed',
        };
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
    a.download = entry.file.name.replace(/(\.[^.]+)$/, '_compressed$1');
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    const done = files.filter((f) => f.status === 'done' && f.blob);
    if (!done.length) return;
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    for (const f of done) {
      zip.file(f.file.name.replace(/(\.[^.]+)$/, '_compressed$1'), f.blob!);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed_images.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const doneCount = files.filter((f) => f.status === 'done').length;

  return (
    <>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Tools', 'Image Compressor']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>
        Image Compressor
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['image-compress']?.description ?? '
        Compress up to 20 images at once. Quality slider or target file size. All processing runs in your browser.
      '}</p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(Array.from(e.dataTransfer.files));
        }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: '2px dashed var(--border)',
          borderRadius: 'var(--radius)',
          padding: '32px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: 'var(--surface)',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
        />
        <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, color: 'var(--muted)', margin: 0 }}>
          Drop images here or click to select — up to 20 files, 20 MB each
        </p>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--border)', marginTop: 6 }}>
          JPEG · PNG · WEBP · AVIF
        </p>
      </div>

      {/* Settings */}
      {files.length > 0 && (
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Mode */}
          <div style={{ display: 'flex', gap: 8 }}>
            {(['quality', 'target'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '7px 16px',
                  border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)',
                  background: mode === m ? '#F0F6FF' : 'var(--surface)',
                  color: mode === m ? 'var(--accent)' : 'var(--muted)',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  fontSize: 13.5,
                  fontWeight: mode === m ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {m === 'quality' ? 'Quality slider' : 'Target file size'}
              </button>
            ))}
          </div>

          {mode === 'quality' ? (
            <div style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 14, fontWeight: 500 }}>Quality</span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 14 }}>{quality}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace' }}>1 — smallest</span>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace' }}>100 — original</span>
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>
                Target size
              </label>
              <input
                type="number"
                min="1"
                value={targetKB}
                onChange={(e) => setTargetKB(e.target.value)}
                style={{ width: 90, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 14 }}
              />
              <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 14, color: 'var(--muted)' }}>KB per file</span>
            </div>
          )}

          {/* Resize */}
          <div style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <p style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 14, fontWeight: 500, margin: '0 0 10px' }}>Resize</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['none', 'percent', 'dimensions'] as ResizeMode[]).map((rm) => (
                <button
                  key={rm}
                  onClick={() => setResizeMode(rm)}
                  style={{
                    padding: '5px 12px',
                    border: `1px solid ${resizeMode === rm ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 6,
                    background: resizeMode === rm ? '#F0F6FF' : 'transparent',
                    color: resizeMode === rm ? 'var(--accent)' : 'var(--muted)',
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {rm === 'none' ? 'No resize' : rm === 'percent' ? 'Scale %' : 'Max W/H'}
                </button>
              ))}
            </div>

            {resizeMode === 'percent' && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={resizePct}
                  onChange={(e) => setResizePct(+e.target.value)}
                  style={{ flex: 1, accentColor: 'var(--accent)' }}
                />
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, minWidth: 40 }}>{resizePct}%</span>
              </div>
            )}

            {resizeMode === 'dimensions' && (
              <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Max width"
                  value={resizeW}
                  onChange={(e) => setResizeW(e.target.value)}
                  style={{ width: 120, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}
                />
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>×</span>
                <input
                  type="number"
                  placeholder="Max height"
                  value={resizeH}
                  onChange={(e) => setResizeH(e.target.value)}
                  style={{ width: 120, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}
                />
                <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>px, keeps aspect ratio</span>
              </div>
            )}
          </div>

          {/* Strip metadata */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={stripMeta}
              onChange={(e) => setStripMeta(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--accent)', flexShrink: 0 }}
            />
            <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 14, color: 'var(--text)' }}>
              Strip EXIF metadata (GPS, camera info, timestamps)
            </span>
          </label>

          {/* Compress button */}
          <button
            onClick={processAll}
            disabled={isProcessing}
            style={{
              padding: '12px 24px',
              background: isProcessing ? 'var(--border)' : 'var(--accent)',
              color: isProcessing ? 'var(--muted)' : '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: 15,
              fontWeight: 500,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {isProcessing ? 'Compressing...' : `Compress ${files.length} image${files.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Results */}
      {files.length > 0 && (
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {files.map((entry) => (
            <div
              key={entry.id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--surface)',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', gap: 0 }}>
                {/* Original */}
                <div style={{ flex: 1, padding: '12px 14px', borderRight: '1px solid var(--border)' }}>
                  <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'var(--muted)', margin: '0 0 6px', textTransform: 'uppercase' }}>
                    Original
                  </p>
                  <img
                    src={entry.originalUrl}
                    alt="original"
                    style={{ width: '100%', maxHeight: 120, objectFit: 'contain', display: 'block', background: 'var(--bg-elevated)' }}
                  />
                  <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--muted)', margin: '6px 0 0' }}>
                    {formatBytes(entry.file.size)}
                  </p>
                </div>

                {/* Compressed */}
                <div style={{ flex: 1, padding: '12px 14px' }}>
                  <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'var(--muted)', margin: '0 0 6px', textTransform: 'uppercase' }}>
                    Compressed
                  </p>
                  {entry.status === 'done' && entry.compressedUrl && entry.blob ? (
                    <>
                      <img
                        src={entry.compressedUrl}
                        alt="compressed"
                        style={{ width: '100%', maxHeight: 120, objectFit: 'contain', display: 'block', background: 'var(--bg-elevated)' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--muted)' }}>
                          {formatBytes(entry.blob.size)}
                        </span>
                        <span
                          style={{
                            fontFamily: 'IBM Plex Mono, monospace',
                            fontSize: 12,
                            fontWeight: 600,
                            color: entry.blob.size < entry.file.size ? 'var(--success)' : 'var(--danger)',
                          }}
                        >
                          {reduction(entry.file.size, entry.blob.size)}
                        </span>
                      </div>
                    </>
                  ) : entry.status === 'processing' ? (
                    <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13, fontFamily: 'IBM Plex Sans, sans-serif' }}>
                      Processing...
                    </div>
                  ) : entry.status === 'error' ? (
                    <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', fontSize: 13, fontFamily: 'IBM Plex Sans, sans-serif', padding: 8, textAlign: 'center' }}>
                      {entry.error}
                    </div>
                  ) : (
                    <div style={{ height: 120, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13, fontFamily: 'IBM Plex Sans, sans-serif' }}>
                      —
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '8px 14px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-elevated)',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    fontSize: 13,
                    color: 'var(--text)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                  title={entry.file.name}
                >
                  {entry.file.name}
                </span>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {entry.status === 'done' && (
                    <button
                      onClick={() => downloadOne(entry)}
                      style={{
                        padding: '4px 12px',
                        background: 'var(--text)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 5,
                        fontFamily: 'IBM Plex Sans, sans-serif',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Download
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(entry.id)}
                    style={{
                      padding: '4px 10px',
                      background: 'transparent',
                      color: 'var(--muted)',
                      border: '1px solid var(--border)',
                      borderRadius: 5,
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {doneCount > 1 && (
            <button
              onClick={downloadAll}
              style={{
                padding: '11px 24px',
                background: 'var(--text)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontFamily: 'IBM Plex Sans, sans-serif',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              Download all as ZIP ({doneCount} files)
            </button>
          )}
        </div>
      )}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="image-compress" />
  </>
  );
}
