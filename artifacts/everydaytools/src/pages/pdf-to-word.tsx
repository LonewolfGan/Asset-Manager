import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export default function PdfToWord() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const paragraphs: Paragraph[] = [];
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group items into lines based on Y coordinate approx
        const items = textContent.items as any[];
        if (items.length > 0) {
            // simple paragraph creation
            const text = items.map(item => item.str).join(' ');
            if (text.trim()) {
                paragraphs.push(new Paragraph({
                    children: [new TextRun(text)],
                }));
            }
        }
        setProgress(Math.round((i / numPages) * 100));
      }
      
      const doc = new Document({
        sections: [{ properties: {}, children: paragraphs }],
      });
      
      const blob = await Packer.toBlob(doc);
      
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '.docx'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "Is DOCX compatible with Microsoft Word?", a: "Yes, the generated DOCX file is fully compatible with Microsoft Word, Google Docs, and other word processors." },
    { q: "Does this preserve the exact layout?", a: "This tool extracts text and converts it into paragraphs. Complex layouts, tables, and images are currently not preserved." },
    { q: "Can I convert password-protected PDFs?", a: "If the PDF requires a password to open, you will need to unlock it first before converting." },
    { q: "Are tables supported?", a: "Tables are extracted as plain text, so the column structure may not align perfectly." },
    { q: "Is it safe and private?", a: "Yes, the conversion happens entirely within your browser. No files are uploaded to any server." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'PDF to Word']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>PDF to Word</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Convert PDF documents into editable Word (DOCX) files in your browser.</p>
      <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Convert to Word
        </button>
      )}
      {isProcessing && <ProgressBar progress={progress} label="Converting to DOCX..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
