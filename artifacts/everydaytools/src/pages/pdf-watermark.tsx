import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function PdfWatermark() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(60);
  const [opacity, setOpacity] = useState(0.3);
  const [colorStr, setColorStr] = useState("gray");

  const getColor = () => {
    switch (colorStr) {
      case 'red': return rgb(1, 0, 0);
      case 'blue': return rgb(0, 0, 1);
      case 'black': return rgb(0, 0, 0);
      default: return rgb(0.5, 0.5, 0.5); // gray
    }
  };

  const handleConvert = async () => {
    if (!files[0] || !text) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const pages = pdfDoc.getPages();
      const color = getColor();
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
        
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: fontSize,
          font: helveticaFont,
          color: color,
          opacity: opacity,
          rotate: degrees(45),
        });
        setProgress(Math.round(((i + 1) / pages.length) * 50));
      }
      
      const pdfBytes = await pdfDoc.save();
      setProgress(100);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_watermarked.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Processing failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Watermark PDF']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['pdf-watermark']?.title ?? 'Watermark PDF'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['pdf-watermark']?.description ?? 'Add a diagonal text watermark to all pages of a PDF.'}</p>
      
      <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, fontWeight: 500 }}>Watermark Text</label>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, fontWeight: 500 }}>Font Size ({fontSize})</label>
              <input type="range" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, fontWeight: 500 }}>Opacity ({Math.round(opacity*100)}%)</label>
              <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, fontWeight: 500 }}>Color</label>
              <select value={colorStr} onChange={(e) => setColorStr(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg)' }}>
                <option value="gray">Gray</option>
                <option value="black">Black</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing || !text}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Add Watermark
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Applying watermark..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="pdf-watermark" />
  </>
  );
}
