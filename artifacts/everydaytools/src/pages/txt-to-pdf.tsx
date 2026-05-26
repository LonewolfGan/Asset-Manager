import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default function TxtToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [textInput, setTextInput] = useState("");

  const handleConvert = async () => {
    if (mode === 'upload' && !files[0]) return;
    if (mode === 'paste' && !textInput.trim()) return;
    
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      let textContent = "";
      let filename = "document.pdf";
      let sizeBefore = 0;
      
      if (mode === 'upload') {
        textContent = await files[0].text();
        filename = files[0].name.replace(/\.txt$/i, '.pdf');
        sizeBefore = files[0].size;
      } else {
        textContent = textInput;
        sizeBefore = textInput.length;
      }
      
      setProgress(20);
      
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Courier);
      
      const lines = textContent.split('\n');
      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      let y = height - 50;
      const fontSize = 11;
      const lineHeight = 14;
      
      for (const line of lines) {
        if (y < 50) {
          page = pdfDoc.addPage();
          y = height - 50;
        }
        
        const words = line.split(' ');
        let currentLine = '';
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);
            if (testWidth > width - 100 && currentLine !== '') {
                page.drawText(currentLine, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
                y -= lineHeight;
                currentLine = word;
                if (y < 50) {
                    page = pdfDoc.addPage();
                    y = height - 50;
                }
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            page.drawText(currentLine, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= lineHeight;
        }
      }
      
      setProgress(80);
      const pdfBytes = await pdfDoc.save();
      setProgress(100);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ blob, filename, sizeAfter: blob.size, sizeBefore });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "What font is used for the PDF?", a: "A standard monospace font (Courier) is used to preserve text alignment perfectly." },
    { q: "Is line wrapping supported?", a: "Yes, long lines of text will automatically wrap to fit the PDF page width." },
    { q: "Can I paste text instead of uploading?", a: "Yes, switch to the 'Paste Text' tab to insert text directly." },
    { q: "What page size is generated?", a: "The tool generates standard A4-sized PDF pages." },
    { q: "Are emojis supported?", a: "Standard fonts may not support all emojis, which might appear as blank boxes." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Word Tools', 'Text to PDF']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Text to PDF</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Convert plain text into a perfectly formatted PDF document.</p>
      
      <div style={{ marginBottom: 24, display: 'flex', gap: 16, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setMode('upload')} style={{ background: 'none', border: 'none', borderBottom: mode === 'upload' ? '2px solid var(--accent)' : '2px solid transparent', padding: '8px 16px', fontWeight: 500, cursor: 'pointer', color: mode === 'upload' ? 'var(--text)' : 'var(--muted)' }}>Upload File</button>
        <button onClick={() => setMode('paste')} style={{ background: 'none', border: 'none', borderBottom: mode === 'paste' ? '2px solid var(--accent)' : '2px solid transparent', padding: '8px 16px', fontWeight: 500, cursor: 'pointer', color: mode === 'paste' ? 'var(--text)' : 'var(--muted)' }}>Paste Text</button>
      </div>
      
      {mode === 'upload' ? (
        <FileUpload accept={['.txt', 'text/plain']} maxSizeMB={10} onFiles={setFiles} />
      ) : (
        <textarea 
          placeholder="Paste your text here..."
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          style={{ width: '100%', minHeight: 200, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', fontFamily: 'monospace' }}
        />
      )}
      
      {((mode === 'upload' && files.length > 0) || (mode === 'paste' && textInput.trim())) && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Convert to PDF
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Generating PDF..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
