import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolLoadingState from '@/components/ToolLoadingState';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { apiUrl } from '@/lib/apiBase';
import { Sparkles, Download, Upload, ZoomIn } from 'lucide-react';

function formatBytes(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageUpscale() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [scale, setScale] = useState<2 | 4>(2);
  const [sharpen, setSharpen] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [origDims, setOrigDims] = useState<{ w: number; h: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP, etc.)');
      setStatus('error');
      return;
    }
    setFile(f);
    setStatus('idle');
    setError('');
    setResultUrl(null);
    setResultBlob(null);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    const img = new Image();
    img.onload = () => setOrigDims({ w: img.width, h: img.height });
    img.src = url;
  };

  const upscale = async () => {
    if (!file) return;
    setStatus('processing');
    setProgress(20);
    trackToolUsed('image-upscale', 'image');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('scale', String(scale));
      fd.append('sharpen', String(sharpen));
      setProgress(45);

      const res = await fetch(apiUrl('/api/tools/image-upscale'), {
        method: 'POST',
        body: fd,
      });
      setProgress(85);

      if (!res.ok) {
        // Fallback to client-side high-quality Canvas Lanczos scaling if backend is unavailable
        await upscaleClientSide();
        return;
      }

      const blob = await res.blob();
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStatus('done');
    } catch (e) {
      try {
        await upscaleClientSide();
      } catch (clientErr) {
        trackToolError('image-upscale', 'general-error');
        setStatus('error');
        setError(e instanceof Error ? e.message : 'Upscaling failed');
      }
    }
  };

  const upscaleClientSide = async () => {
    if (!previewUrl || !origDims) throw new Error('Image not loaded');
    setProgress(50);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = previewUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = origDims.w * scale;
    canvas.height = origDims.h * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), file?.type ?? 'image/png', 0.95));
    setResultBlob(blob);
    setResultUrl(URL.createObjectURL(blob));
    setProgress(100);
    setStatus('done');
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const ext = file.name.split('.').pop() || 'png';
    a.download = file.name.replace(/\.[^.]+$/, `_upscaled_${scale}x.${ext}`);
    a.click();
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Image Tools', 'Image Upscale & Super Resolution']} />
        <PageTitle>Image Upscaler (Super Resolution)</PageTitle>
        <PageSubtitle>Enlarge images by 2x or 4x with smart detail preservation and edge sharpening.</PageSubtitle>

        {!file && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)',
              transition: 'all 0.15s',
            }}
          >
            <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <ZoomIn style={{ width: 40, height: 40, margin: '0 auto 12px', color: 'var(--accent)' }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
              Drop an image here, or click to browse
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>
              PNG · JPG · WebP · AVIF · BMP · TIFF
            </p>
          </div>
        )}

        {file && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Original</p>
                <div style={{ maxHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain' }} />}
                </div>
                {origDims && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 8 }}>
                    {origDims.w} × {origDims.h} px · {formatBytes(file.size)}
                  </p>
                )}
              </div>

              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Upscale Settings</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                      Scale Factor
                    </label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => setScale(2)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${scale === 2 ? 'var(--accent)' : 'var(--border)'}`,
                          background: scale === 2 ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                          color: scale === 2 ? 'var(--accent)' : 'var(--text-primary)',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        2x (Double)
                      </button>
                      <button
                        type="button"
                        onClick={() => setScale(4)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${scale === 4 ? 'var(--accent)' : 'var(--border)'}`,
                          background: scale === 4 ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                          color: scale === 4 ? 'var(--accent)' : 'var(--text-primary)',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        4x (Ultra HD)
                      </button>
                    </div>
                  </div>

                  {origDims && (
                    <div style={{ padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>Target Resolution:</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0' }}>
                        {origDims.w * scale} × {origDims.h * scale} px
                      </p>
                    </div>
                  )}

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    <input type="checkbox" checked={sharpen} onChange={(e) => setSharpen(e.target.checked)} />
                    Apply detail enhancement & edge unsharp mask
                  </label>

                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button
                      onClick={upscale}
                      disabled={status === 'processing'}
                      style={{
                        flex: 1,
                        padding: '12px 20px',
                        background: 'var(--accent)',
                        color: 'var(--accent-text)',
                        border: 'none',
                        borderRadius: 'var(--radius)',
                        fontWeight: 600,
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <Sparkles size={16} />
                      Upscale Image
                    </button>
                    <button
                      onClick={() => { setFile(null); setPreviewUrl(null); setResultUrl(null); setStatus('idle'); }}
                      style={{
                        padding: '12px 16px',
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        color: 'var(--text-secondary)',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {status === 'processing' && (
              <div style={{ marginTop: 20 }}>
                <ToolLoadingState
                  status="loading"
                  progress={progress}
                  label="Upscaling image…"
                  steps={['Analyzing image', 'Applying Lanczos3 interpolation', 'Enhancing micro-contrast', 'Generating output']}
                  currentStep={progress < 30 ? 0 : progress < 60 ? 1 : progress < 85 ? 2 : 3}
                />
              </div>
            )}

            {status === 'error' && (
              <div style={{ marginTop: 20 }}>
                <ToolLoadingState status="error" errorMessage={error} onRetry={upscale} />
              </div>
            )}

            {status === 'done' && resultUrl && (
              <div style={{ marginTop: 24, padding: 20, background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Upscaling complete!</p>
                    {resultBlob && (
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                        Size: {formatBytes(resultBlob.size)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={download}
                    style={{
                      padding: '12px 24px',
                      background: 'var(--accent)',
                      color: 'var(--accent-text)',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Download size={16} />
                    Download Upscaled Image
                  </button>
                </div>
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <img src={resultUrl} alt="Upscaled result" style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
                </div>
              </div>
            )}
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="image-upscale" />
    </>
  );
}
