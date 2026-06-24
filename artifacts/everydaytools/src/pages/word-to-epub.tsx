import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import mammoth from 'mammoth';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolLoadingState, ToolEmptyState,
} from '@/components/ToolContent';

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
    <ToolPageLayout
      breadcrumb={['Home', 'Word Tools', 'Word to EPUB']}
      title={t.tools['word-to-epub']?.title ?? 'Word to EPUB'}
      description={t.tools['word-to-epub']?.description ?? 'Turn your Word manuscripts into EPUB e-books for any device.'}
      seoSlug="word-to-epub"
    >
      <ToolWorkspace>
        <FileUpload accept={['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']} maxSizeMB={50} onFiles={setFiles} />

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Convert to EPUB
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Generating EPUB..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
