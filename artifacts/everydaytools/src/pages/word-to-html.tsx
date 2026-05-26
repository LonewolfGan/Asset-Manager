import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import mammoth from 'mammoth';

export default function WordToHtml() {
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
      
      const { value: htmlBody } = await mammoth.convertToHtml({ arrayBuffer });
      setProgress(100);
      
      const html = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>${file.name}</title>\n<style>body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2em; line-height: 1.6; }</style>\n</head>\n<body>\n${htmlBody}\n</body>\n</html>`;
      
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      setResult({ blob, filename: file.name.replace(/\.docx?$/i, '.html'), sizeAfter: blob.size, sizeBefore: file.size, textOutput: html });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Word Tools', 'Word to HTML']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Word to HTML</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Convert DOCX documents to clean, web-ready HTML code.</p>
      
      <FileUpload accept={['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Convert to HTML
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Converting..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      
      {result && (
        <div style={{ marginTop: 24 }}>
          <ResultPanel {...result} />
        </div>
      )}
      
      {result && result.textOutput && (
        <div style={{ marginTop: 32, border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, background: 'var(--surface)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>Preview</h3>
          <div 
            style={{ maxHeight: 400, overflow: 'auto', background: 'var(--bg)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
            dangerouslySetInnerHTML={{ __html: result.textOutput.replace(/<!DOCTYPE html>.*<body>/is, '').replace(/<\/body><\/html>/i, '') }}
          />
        </div>
      )}
      <AdSlot type="horizontal" />
    </div>
  );
}
