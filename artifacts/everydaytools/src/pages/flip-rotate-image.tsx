import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

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
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    await new Promise<void>((res) => { img.onload = () => res(); });
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad)); const sin = Math.abs(Math.sin(rad));
    const w = Math.round(img.width * cos + img.height * sin);
    const h = Math.round(img.width * sin + img.height * cos);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    URL.revokeObjectURL(url);
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => b ? res(b) : rej(), outputFormat, 0.92));
    const dlUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = file.name.replace(/\.[^.]+$/, `_edited.${ext}`);
    a.click();
    URL.revokeObjectURL(dlUrl);
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Image Tools', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        {!file && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)' }}
          >
            <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>Drop an image here, or click to browse</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>JPG · PNG · WebP · GIF · max 25 MB</p>
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
              <button onClick={() => setRotation((r) => (r - 90 + 360) % 360)} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 13, cursor: 'pointer' }}>↺ 90° Left</button>
              <button onClick={() => setRotation((r) => (r + 90) % 360)} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 13, cursor: 'pointer' }}>↻ 90° Right</button>
              <button onClick={() => setRotation((r) => (r + 180) % 360)} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 13, cursor: 'pointer' }}>↔ 180°</button>
              <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
              <button onClick={() => setFlipH((f) => !f)} style={{ padding: '8px 14px', border: `1px solid ${flipH ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, background: flipH ? 'var(--accent-subtle,#fff4ef)' : 'var(--bg-surface)', color: flipH ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 13, cursor: 'pointer' }}>⇔ Flip Horizontal</button>
              <button onClick={() => setFlipV((f) => !f)} style={{ padding: '8px 14px', border: `1px solid ${flipV ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, background: flipV ? 'var(--accent-subtle,#fff4ef)' : 'var(--bg-surface)', color: flipV ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 13, cursor: 'pointer' }}>⇕ Flip Vertical</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)' }}>Save as:</label>
              <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}
                style={{ padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 13 }}>
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={downloadResult}
                style={{ flex: 1, padding: '11px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                Download Result
              </button>
              <button onClick={() => { setFile(null); setPreviewUrl(''); }}
                style={{ padding: '11px 16px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 14, cursor: 'pointer' }}>
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
