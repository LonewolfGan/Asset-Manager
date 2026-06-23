import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolProgressBar, ToolEmptyState,
} from '@/components/ToolContent';

export default function TxtToDocx() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [textInput, setTextInput] = useState("");

  const handleConvert = async () => {
    trackToolUsed('txt-to-docx', 'documents');
    if (mode === 'upload' && !files[0]) return;
    if (mode === 'paste' && !textInput.trim()) return;

    setError(null); setIsProcessing(true); setProgress(0);
    try {
      let textContent = "";
      let filename = "document.docx";
      let sizeBefore = 0;

      if (mode === 'upload') {
        textContent = await files[0].text();
        filename = files[0].name.replace(/\.txt$/i, '.docx');
        sizeBefore = files[0].size;
      } else {
        textContent = textInput;
        sizeBefore = textInput.length;
      }

      setProgress(50);

      const lines = textContent.split('\n');
      const paragraphs = lines.map(line => new Paragraph({
        children: [new TextRun(line)],
      }));

      const doc = new Document({
        sections: [{ properties: {}, children: paragraphs }],
      });

      const blob = await Packer.toBlob(doc);
      setProgress(100);

      setResult({ blob, filename, sizeAfter: blob.size, sizeBefore });
    } catch (e) {
      trackToolError('txt-to-docx', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Word Tools', 'Text to Word']}
      title={t.tools['txt-to-docx']?.title ?? 'Text to Word'}
      description={t.tools['txt-to-docx']?.description ?? 'Convert plain text into an editable Microsoft Word document.'}
      seoSlug="txt-to-docx"
    >
      <ToolWorkspace>
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
            style={{ width: '100%', minHeight: 200, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', fontFamily: 'var(--font-ui)' }}
          />
        )}

        {((mode === 'upload' && files.length > 0) || (mode === 'paste' && textInput.trim())) && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Convert to DOCX
          </ToolButton>
        )}

        {isProcessing && <ToolProgressBar progress={progress} label="Generating Word document..." />}
        {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{error}</p>}
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
