import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import mammoth from 'mammoth';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolEmptyState,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';

export default function WordToText() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number, textOutput?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    trackToolUsed('word-to-text', 'documents');
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      setProgress(50);

      const { value: text } = await mammoth.extractRawText({ arrayBuffer });
      setProgress(100);

      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      setResult({ blob, filename: file.name.replace(/\.docx?$/i, '.txt'), sizeAfter: blob.size, sizeBefore: file.size, textOutput: text });
    } catch (e) {
      trackToolError('word-to-text', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Word Tools', 'Word to Text']}
      title={t.tools['word-to-text']?.title ?? 'Word to Text'}
      description={t.tools['word-to-text']?.description ?? 'Extract plain text from Microsoft Word (.docx) documents securely.'}
      seoSlug="word-to-text"
    >
      <ToolWorkspace>
        <FileUpload accept={['.docx', '.doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']} maxSizeMB={50} onFiles={setFiles} />

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Extract Text
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Extracting text..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
