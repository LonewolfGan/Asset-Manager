import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
// Processing is handled server-side via /api/tools/image-compress

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


export default function ImageCompress() {
  const { t } = useLocale();
  const tc = t.imageCompress;
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
    const updated = [...files];

    for (let i = 0; i < updated.length; i++) {
      const entry = updated[i];
      if (entry.status === 'done') continue;
      updated[i] = { ...entry, status: 'processing' };
      setFiles([...updated]);

      try {
        const fd = new FormData();
        fd.append('file', entry.file);
        fd.append('quality', quality.toString());
        fd.append('stripMeta', stripMeta.toString());
        fd.append('resizeMode', resizeMode);
        if (mode === 'target') fd.append('targetKB', targetKB);
        if (resizeMode === 'percent') fd.append('resizePct', resizePct.toString());
        if (resizeMode === 'dimensions') {
          if (resizeW) fd.append('resizeW', resizeW);
          if (resizeH) fd.append('resizeH', resizeH);
        }

        const res = await fetch('/api/tools/image-compress', { method: 'POST', body: fd });
        if (!res.ok) {
          const err = await res.json() as { error?: string };
          throw new Error(err.error ?? 'Compression failed');
        }
        const blob = await res.blob();
        const compressedUrl = URL.createObjectURL(blob);
        updated[i] = { ...updated[i], status: 'done', blob, compressedUrl };
      } catch (err) {
        trackToolError('image-compress', 'general-error');
        updated[i] = {
          ...updated[i],
          status: 'error',
          error: err instanceof Error ? err.message : 'Failed',
        };
      }
      setFiles([...updated]);
    }
    trackToolUsed('image-compress', 'images');
    setIsProcessing(false);
  };

  const downloadOne = (entry: FileResult) => {
    trackToolUsed('image-compress', 'images');
    if (!entry.blob) return;
    const url = URL.createObjectURL(entry.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = entry.file.name.replace(/(\.[^.]+)$/, '_compressed$1');
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    trackToolUsed('image-compress', 'images');
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

  const btnBase: React.CSSProperties = {
    padding: '7px 16px',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-ui)',
    fontSize: 13.5,
    cursor: 'pointer',
    transition: 'all 0.15s',
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Tools', 'Image Compressor']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>
        {t.tools['image-compress']?.title ?? 'Image Compressor'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{t.tools['image-compress']?.description ?? 'Compress up to 20 images at once. Quality slider or target file size. All processing runs in your browser.'}</p>

      {/* Drop zone */}
      <div
        data-testid="drop-zone"
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
          background: 'var(--bg-surface)',
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
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
          {tc.dropHint}
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>
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
                  ...btnBase,
                  border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`,
                  background: mode === m ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                  color: mode === m ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: mode === m ? 600 : 400,
                }}
              >
                {m === 'quality' ? tc.qualitySlider : tc.targetSize}
              </button>
            ))}
          </div>

          {mode === 'quality' ? (
            <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{tc.quality}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{quality}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(+e.target.value)}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{tc.smallest}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{tc.original100}</span>
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                {tc.targetSizeLabel}
              </label>
              <input
                type="number"
                min="1"
                value={targetKB}
                onChange={(e) => setTargetKB(e.target.value)}
                style={{ width: 90, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
              />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{tc.kbPerFile}</span>
            </div>
          )}

          {/* Resize */}
          <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: '0 0 10px', color: 'var(--text-primary)' }}>{tc.resize}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['none', 'percent', 'dimensions'] as ResizeMode[]).map((rm) => (
                <button
                  key={rm}
                  onClick={() => setResizeMode(rm)}
                  style={{
                    padding: '5px 12px',
                    border: `1px solid ${resizeMode === rm ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 6,
                    background: resizeMode === rm ? 'var(--accent-subtle)' : 'transparent',
                    color: resizeMode === rm ? 'var(--accent)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                  }}
                >
                  {rm === 'none' ? tc.noResize : rm === 'percent' ? tc.scalePercent : tc.maxWH}
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
                  style={{ flex: 1 }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', minWidth: 40, color: 'var(--text-primary)' }}>{resizePct}%</span>
              </div>
            )}

            {resizeMode === 'dimensions' && (
              <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Max width"
                  value={resizeW}
                  onChange={(e) => setResizeW(e.target.value)}
                  style={{ width: 120, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                />
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>×</span>
                <input
                  type="number"
                  placeholder="Max height"
                  value={resizeH}
                  onChange={(e) => setResizeH(e.target.value)}
                  style={{ width: 120, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{tc.pxKeepsAspect}</span>
              </div>
            )}
          </div>

          {/* Strip metadata */}
          <label
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none', padding: '10px 12px', borderRadius: 8, transition: 'background 120ms ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <input
              type="checkbox"
              checked={stripMeta}
              onChange={(e) => setStripMeta(e.target.checked)}
              style={{ width: 15, height: 15, accentColor: 'var(--accent)', flexShrink: 0 }}
            />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
              {tc.stripExif}
            </span>
          </label>

          {/* Compress button */}
          <button
            onClick={processAll}
            disabled={isProcessing}
            style={{
              padding: '12px 24px',
              background: isProcessing ? 'var(--bg-elevated)' : 'var(--accent)',
              color: isProcessing ? 'var(--text-tertiary)' : 'var(--accent-text)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {isProcessing ? tc.compressing : tc.compressBtn(files.length)}
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
                background: 'var(--bg-surface)',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', gap: 0 }}>
                {/* Original */}
                <div style={{ flex: 1, padding: '12px 14px', borderRight: '1px solid var(--border)' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0 0 6px', textTransform: 'uppercase' }}>
                    {tc.originalLabel}
                  </p>
                  <img
                    src={entry.originalUrl}
                    alt="original"
                    style={{ width: '100%', maxHeight: 120, objectFit: 'contain', display: 'block', background: 'var(--bg-elevated)' }}
                  />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
                    {formatBytes(entry.file.size)}
                  </p>
                </div>

                {/* Compressed */}
                <div style={{ flex: 1, padding: '12px 14px' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0 0 6px', textTransform: 'uppercase' }}>
                    {tc.compressedLabel}
                  </p>
                  {entry.status === 'done' && entry.compressedUrl && entry.blob ? (
                    <>
                      <img
                        src={entry.compressedUrl}
                        alt="compressed"
                        style={{ width: '100%', maxHeight: 120, objectFit: 'contain', display: 'block', background: 'var(--bg-elevated)' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                          {formatBytes(entry.blob.size)}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                            color: entry.blob.size < entry.file.size ? 'var(--success)' : 'var(--danger)',
                          }}
                        >
                          {reduction(entry.file.size, entry.blob.size)}
                        </span>
                      </div>
                    </>
                  ) : entry.status === 'processing' ? (
                    <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>
                      {tc.processing}
                    </div>
                  ) : entry.status === 'error' ? (
                    <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)', padding: 8, textAlign: 'center' }}>
                      {entry.error}
                    </div>
                  ) : (
                    <div style={{ height: 120, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>
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
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-primary)',
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
                        background: 'var(--text-primary)',
                        color: 'var(--bg-base)',
                        border: 'none',
                        borderRadius: 5,
                        fontFamily: 'var(--font-ui)',
                        fontSize: 'var(--text-xs)',
                        cursor: 'pointer',
                      }}
                    >
                      {tc.downloadBtn}
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(entry.id)}
                    style={{
                      padding: '4px 10px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: 5,
                      fontFamily: 'var(--font-ui)',
                      fontSize: 'var(--text-xs)',
                      cursor: 'pointer',
                    }}
                  >
                    {tc.removeBtn}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {doneCount > 1 && (
            <button
              onClick={downloadAll}
              style={{
                padding: '10px 24px',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {tc.downloadAll(doneCount)}
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
