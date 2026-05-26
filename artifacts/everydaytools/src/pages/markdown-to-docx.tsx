import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { marked } from 'marked';

export default function MarkdownToDocx() {
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
      const text = await file.text();
      setProgress(40);
      
      const htmlContent = await marked(text);
      setProgress(60);
      
      const htmlDocx = (await import('html-docx-js/dist/html-docx')).default;
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${htmlContent}</body></html>`;
      
      const blob = htmlDocx.asBlob(html);
      setProgress(100);
      
      setResult({ blob, filename: file.name.replace(/\.(md|txt)$/i, '.docx'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "Does it support headings and bold text?", a: "Yes, HTML tags generated from Markdown (like headings and bold) are converted into Word formatting." },
    { q: "Are bullet points supported?", a: "Yes, Markdown lists are converted into Word bullet points." },
    { q: "Are images supported?", a: "If the image uses an absolute URL, it may be included, but local relative images won't work in the browser." },
    { q: "Can I open the file in Google Docs?", a: "Yes, the DOCX format is compatible with Word, Google Docs, and LibreOffice." },
    { q: "Is the conversion secure?", a: "Yes, all processing happens locally in your browser." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Word Tools', 'Markdown to Word']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Markdown to Word</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Convert Markdown files to Microsoft Word (.docx) format.</p>
      
      <FileUpload accept={['.md', '.txt', 'text/markdown', 'text/plain']} maxSizeMB={10} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Convert to DOCX
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Converting..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
