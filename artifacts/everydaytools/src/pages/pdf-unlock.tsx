import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { PDFDocument } from 'pdf-lib';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolEmptyState,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';

export default function PdfUnlock() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      trackToolUsed('pdf-unlock', 'pdf');
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();

      let pdfDoc;
      try {
        pdfDoc = await PDFDocument.load(arrayBuffer);
      } catch (err: any) {
        // Fallback for some basic empty passwords
        if (err.message && err.message.includes('password')) {
           try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pdfDoc = await PDFDocument.load(arrayBuffer, { password: '' } as any);
           } catch (e2) {
              throw new Error("This PDF requires a User Password to open. We can only remove Owner Passwords (print/copy restrictions).");
           }
        } else {
           throw err;
        }
      }

      setProgress(50);

      // Saving without password arguments strips the encryption (owner password restrictions)
      const pdfBytes = await pdfDoc.save();
      setProgress(100);

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_unlocked.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('pdf-unlock', 'general-error');
      setError(e instanceof Error ? e.message : 'Unlock failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'Unlock PDF']}
      title={t.tools['pdf-unlock']?.title ?? 'Unlock PDF'}
      description={t.tools['pdf-unlock']?.description ?? 'Remove printing, copying, and editing restrictions from PDF files.'}
      seoSlug="pdf-unlock"
    >
      <ToolWorkspace>
        <div style={{ padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 24, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5, fontFamily: 'var(--font-ui)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Note:</strong> This removes the owner password (print/copy restrictions). It does not bypass user (open) passwords.
        </div>

        <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Unlock PDF
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Unlocking PDF..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
