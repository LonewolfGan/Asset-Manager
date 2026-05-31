import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import mammoth from 'mammoth';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

export default function WordToEpub() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    trackToolUsed('word-to-epub', 'documents');
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      setProgress(40);
      
      const { value: htmlBody } = await mammoth.convertToHtml({ arrayBuffer });
      setProgress(70);
      
      let blob;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Epub = (await import('epub-gen-memory')).default as any;
        const epub = new Epub({
          title: file.name.replace(/\.docx?$/i, ''),
          author: 'EverydayTools',
          content: [{
            title: 'Content',
            data: htmlBody || '<p>No content extracted.</p>'
          }]
        });
        blob = await epub.genEpub();
        setProgress(100);
      } catch (epubErr) {
        throw new Error("EPUB generation encountered an issue. Browser memory limits may be exceeded.");
      }
      
      setResult({ blob, filename: file.name.replace(/\.docx?$/i, '.epub'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('word-to-epub', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Word Tools', 'Word to EPUB']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['word-to-epub']?.title ?? 'Word to EPUB'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{t.tools['word-to-epub']?.description ?? 'Turn your Word manuscripts into EPUB e-books for any device.'}</p>
      
      <FileUpload accept={['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Convert to EPUB
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Generating EPUB..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 'var(--text-sm)' }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="word-to-epub" />
  </>
  );
}
