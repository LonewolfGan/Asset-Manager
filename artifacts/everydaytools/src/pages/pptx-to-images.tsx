import { useState, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolEmptyState,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';

const SLIDE_W = 960;
const SLIDE_H = 540;

const PALETTE = {
  bg: '#FFFFFF',
  accent: '#1A6BFF',
  title: '#1A1916',
  body: '#3D3C38',
  bullet: '#6B6A65',
  headerBg: '#F0F5FF',
  divider: '#D0DEF9',
  slideNum: '#A0A09A',
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, maxW: number, lineH: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function renderSlide(slideIndex: number, totalSlides: number, texts: string[]): string {
  const canvas = document.createElement('canvas');
  canvas.width = SLIDE_W;
  canvas.height = SLIDE_H;
  const ctx = canvas.getContext('2d')!;

  // White background
  ctx.fillStyle = PALETTE.bg;
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);

  // Blue accent bar top
  ctx.fillStyle = PALETTE.accent;
  ctx.fillRect(0, 0, SLIDE_W, 6);

  // Header area
  ctx.fillStyle = PALETTE.headerBg;
  ctx.fillRect(0, 6, SLIDE_W, 90);

  // Slide number chip (top right)
  ctx.fillStyle = PALETTE.slideNum;
  ctx.font = '500 13px "Arial", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${slideIndex + 1} / ${totalSlides}`, SLIDE_W - 36, 56);
  ctx.textAlign = 'left';

  const MARGIN = 48;
  const CONTENT_W = SLIDE_W - MARGIN * 2;

  // Title
  const titleText = texts[0] ?? `Slide ${slideIndex + 1}`;
  ctx.font = 'bold 26px "Arial", sans-serif';
  ctx.fillStyle = PALETTE.title;
  const titleLines = wrapText(ctx, titleText.slice(0, 120), MARGIN, CONTENT_W, 32);
  let y = 46;
  for (const line of titleLines.slice(0, 2)) {
    ctx.fillText(line, MARGIN, y);
    y += 32;
  }

  // Divider
  ctx.strokeStyle = PALETTE.divider;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(MARGIN, 104);
  ctx.lineTo(SLIDE_W - MARGIN, 104);
  ctx.stroke();

  // Body text
  y = 134;
  ctx.font = '15px "Arial", sans-serif';
  ctx.fillStyle = PALETTE.body;

  for (let ti = 1; ti < texts.length && y < SLIDE_H - 52; ti++) {
    const raw = texts[ti]!.slice(0, 160).trim();
    if (!raw) continue;

    // Bullet dot
    ctx.fillStyle = PALETTE.accent;
    ctx.beginPath();
    ctx.arc(MARGIN + 6, y - 5, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PALETTE.bullet;
    const lines = wrapText(ctx, raw, MARGIN + 20, CONTENT_W - 24, 22);
    for (const line of lines.slice(0, 3)) {
      if (y >= SLIDE_H - 52) break;
      ctx.fillText(line, MARGIN + 20, y);
      y += 22;
    }
    y += 6;
  }

  // Bottom accent bar
  ctx.fillStyle = PALETTE.accent;
  ctx.globalAlpha = 0.12;
  ctx.fillRect(0, SLIDE_H - 4, SLIDE_W, 4);
  ctx.globalAlpha = 1;

  return canvas.toDataURL('image/png');
}

export default function PptxToImages() {
  const { t } = useLocale();
  const title = t.tools['pptx-to-images']?.title ?? 'PowerPoint to Images';
  const desc = t.tools['pptx-to-images']?.description ?? 'Export each slide of a PowerPoint as a PNG image. Download all as a ZIP.';
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [slides, setSlides] = useState<{ dataUrl: string; name: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async (f: File) => {
    setFile(f); setStatus('processing'); setProgress(0); setSlides([]);
    try {
      const buf = await f.arrayBuffer();
      const JSZip = (await import('jszip')).default;
      const pptxZip = await JSZip.loadAsync(buf);
      setProgress(20);

      const slideFiles = Object.keys(pptxZip.files)
        .filter((name) => name.match(/^ppt\/slides\/slide\d+\.xml$/))
        .sort((a, b) => {
          const na = parseInt(a.match(/\d+/)?.[0] ?? '0');
          const nb = parseInt(b.match(/\d+/)?.[0] ?? '0');
          return na - nb;
        });

      if (slideFiles.length === 0) {
        throw new Error('No slides found. Make sure this is a valid .pptx file.');
      }

      const parser = new DOMParser();
      const generated: { dataUrl: string; name: string }[] = [];

      for (let i = 0; i < slideFiles.length; i++) {
        const xmlStr = await pptxZip.files[slideFiles[i]].async('string');
        const doc = parser.parseFromString(xmlStr, 'application/xml');
        const textEls = doc.querySelectorAll('t');
        const texts = Array.from(textEls).map((el) => el.textContent?.trim()).filter(Boolean) as string[];

        const dataUrl = renderSlide(i, slideFiles.length, texts);
        generated.push({ dataUrl, name: `slide-${i + 1}.png` });
        setProgress(20 + Math.round(((i + 1) / slideFiles.length) * 70));
      }

      setSlides(generated);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      trackToolError('pptx-to-images', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setStatus('error');
    }
  };

  const downloadAll = async () => {
    trackToolUsed('pptx-to-images', 'documents');
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    for (const slide of slides) {
      const base64 = slide.dataUrl.split(',')[1];
      zip.file(slide.name, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name.replace(/\.pptx?$/i, '') ?? 'slides') + '_previews.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PowerPoint', title]}
      title={title}
      description={desc}
      seoSlug="pptx-to-images"
    >
      <ToolWorkspace>
        {slides.length === 0 && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) convert(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)' }}
          >
            <input ref={inputRef} type="file" accept=".pptx,.ppt" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) convert(e.target.files[0]); }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>Drop PowerPoint file here, or click to browse</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>.pptx · max 50 MB</p>
          </div>
        )}

        <ToolLoadingState
          status={status === 'processing' ? 'loading' : status === 'error' ? 'error' : 'idle'}
          progress={status === 'processing' ? progress : undefined}
          label="Generating slide previews..."
          errorMessage={error || undefined}
          onRetry={status === 'error' && file ? () => convert(file) : undefined}
        />

        {slides.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{slides.length} slide preview{slides.length !== 1 ? 's' : ''}</span>
              <button onClick={downloadAll}
                style={{ padding: '7px 18px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 6, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer' }}>
                Download all as ZIP
              </button>
            </div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '0 0 16px' }}>
              These are text-content previews extracted from slide XML. Visual elements (shapes, images, colors) are not rendered. For pixel-accurate slides, use PowerPoint or LibreOffice.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {slides.map((slide, i) => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-surface)' }}>
                  <img src={slide.dataUrl} alt={`Slide ${i + 1}`} style={{ width: '100%', display: 'block' }} />
                  <div style={{ padding: '6px 10px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Slide {i + 1}</span>
                    <a href={slide.dataUrl} download={slide.name} style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--accent)', textDecoration: 'none' }}>PNG</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
