import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

const SIZES = [16, 32, 64, 128, 180, 192];

function generateFavicon(img: HTMLImageElement, size: number): Promise<Blob> {
  return new Promise((res, rej) => {
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    c.getContext('2d')!.drawImage(img, 0, 0, size, size);
    c.toBlob((b) => b ? res(b) : rej(), 'image/png');
  });
}

export default function FaviconGenerator() {
  const { t } = useLocale();
  const title = t.tools['favicon-generator']?.title ?? 'Favicon Generator';
  const desc = t.tools['favicon-generator']?.description ?? 'Generate favicons in all standard sizes from any image. Download as a ZIP.';
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStatus('idle');
  };

  const generate = async () => {
    trackToolUsed('favicon-generator', 'images');
    if (!file) return;
    setStatus('processing');
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    await new Promise<void>((res) => { img.onload = () => res(); });

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    for (const size of SIZES) {
      const blob = await generateFavicon(img, size);
      const label = size === 180 ? 'apple-touch-icon' : size === 192 ? 'android-chrome-192' : `favicon-${size}x${size}`;
      zip.file(`${label}.png`, blob);
    }

    // ICO (16x16 as PNG inside .ico wrapper — simplified)
    const ico16 = await generateFavicon(img, 16);
    const ico32 = await generateFavicon(img, 32);
    zip.file('favicon-16.png', ico16);
    zip.file('favicon-32.png', ico32);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    URL.revokeObjectURL(url);
    const dlUrl = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = 'favicons.zip';
    a.click();
    URL.revokeObjectURL(dlUrl);
    setStatus('done');
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Image Tools', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)', marginBottom: 24 }}
        >
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          {previewUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <img src={previewUrl} alt="preview" style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>{file?.name}</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Click to change</p>
              </div>
            </div>
          ) : (
            <>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>Drop PNG, JPG, or SVG, or click to browse</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>Best results with a square image</p>
            </>
          )}
        </div>

        <div style={{ padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 12 }}>Sizes generated:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SIZES.map((s) => (
              <span key={s} style={{ padding: '3px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                {s === 180 ? 'Apple 180×180' : s === 192 ? 'Android 192×192' : `${s}×${s}`}
              </span>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={!file || status === 'processing'}
          style={{ width: '100%', padding: '12px 24px', background: !file || status === 'processing' ? 'var(--bg-elevated)' : 'var(--accent)', color: !file || status === 'processing' ? 'var(--text-tertiary)' : 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: !file || status === 'processing' ? 'not-allowed' : 'pointer' }}>
          {status === 'processing' ? 'Generating…' : 'Generate & Download ZIP'}
        </button>

        {status === 'done' && (
          <p style={{ marginTop: 14, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', textAlign: 'center' }}>
            All favicon sizes generated and downloaded.
          </p>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="favicon-generator" />
    </>
  );
}
