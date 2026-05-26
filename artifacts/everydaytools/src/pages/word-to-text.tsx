import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import mammoth from 'mammoth';

export default function WordToText() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number, textOutput?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      setProgress(50);
      
      const { value: text } = await mammoth.extractRawText({ arrayBuffer });
      setProgress(100);
      
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      setResult({ blob, filename: file.name.replace(/\.docx?$/i, '.txt'), sizeAfter: blob.size, sizeBefore: file.size, textOutput: text });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "Are images extracted?", a: "No, this tool extracts only plain text. Images and graphics are ignored." },
    { q: "Is formatting preserved?", a: "All bold, italic, and layout formatting is stripped to produce pure plain text." },
    { q: "Are tables supported?", a: "Table text is extracted sequentially, but the visual table structure is lost." },
    { q: "Can I convert older .doc files?", a: "This tool works best with modern .docx files. Older .doc files might not be fully supported." },
    { q: "Are my files secure?", a: "Yes, extraction happens in your browser and your documents are never uploaded." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Word Tools', 'Word to Text']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Word to Text</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Extract plain text from Microsoft Word (.docx) documents securely.</p>
      
      <FileUpload accept={['.docx', '.doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Extract Text
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Extracting..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
