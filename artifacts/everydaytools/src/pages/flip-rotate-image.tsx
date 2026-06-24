import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { apiUrl } from '@/lib/apiBase';

export default function FlipRotateImage() {
  const { t } = useLocale();
  const title = t.tools['flip-rotate-image']?.title ?? 'Flip & Rotate Image';
  const desc = t.tools['flip-rotate-image']?.description ?? 'Flip and rotate images — live preview before download. All processing is in your browser.';
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [outputFormat, setOutputFormat] = useState('image/png');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setRotation(0); setFlipH(false); setFlipV(false);
  };

  const getTransform = () => {
    const parts: string[] = [];
    if (rotation) parts.push(`rotate(${rotation}deg)`);
    const sx = flipH ? -1 : 1;
    const sy = flipV ? -1 : 1;
    if (sx !== 1 || sy !== 1) parts.push(`scale(${sx},${sy})`);
    return parts.join(' ') || 'none';
  };

  const downloadResult = async () => {
    trackToolUsed('flip-rotate-image', 'images');
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('rotation', String(rotation));
      fd.append('flipH', String(flipH));
      fd.append('flipV', String(flipV));
      fd.append('outputFormat', outputFormat);
      const res = await fetch(apiUrl('/api/tools/flip-rotate'), { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Processing failed');
      }
      const blob = await res.blob();
      const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = file.name.replace(/\.[^.]+$/, `_edited.${ext}`);
      a.click();
      URL.revokeObjectURL(dlUrl);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Download failed');
    }
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Image Tools', title]} />
        <PageTitle>{title}</PageTitle>
        <PageSubtitle>{desc}</PageSubtitle>

        {!file && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)' }}
          >
            <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>Drop an image here, or click to browse</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>JPG · PNG · WebP · GIF · max 25 MB</p>
          </div>
        )}

        {file && previewUrl && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: 20, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280, overflow: 'hidden' }}>
              <img src={previewUrl} alt="preview"
                style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain', transform: getTransform(), transition: 'transform 0.2s' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => setRotation((r) => (r - 90 + 360) % 360)} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>↺ 90° Left</button>
              <button onClick={() => setRotation((r) => (r + 90) % 360)} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>↻ 90° Right</button>
              <button onClick={() => setRotation((r) => (r + 180) % 360)} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>↔ 180°</button>
              <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
              <button onClick={() => setFlipH((f) => !f)} style={{ padding: '8px 14px', border: `1px solid ${flipH ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', background: flipH ? 'var(--accent-subtle,#fff4ef)' : 'var(--bg-surface)', color: flipH ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>⇔ Flip Horizontal</button>
              <button onClick={() => setFlipV((f) => !f)} style={{ padding: '8px 14px', border: `1px solid ${flipV ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', background: flipV ? 'var(--accent-subtle,#fff4ef)' : 'var(--bg-surface)', color: flipV ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>⇕ Flip Vertical</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Save as:</label>
              <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}
                style={{ padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)' }}>
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={downloadResult}
                style={{ flex: 1, padding: '11px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer' }}>
                Download Result
              </button>
              <button onClick={() => { setFile(null); setPreviewUrl(''); }}
                style={{ padding: '11px 16px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                Change image
              </button>
            </div>
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="flip-rotate-image" />
    </>
  );
}
