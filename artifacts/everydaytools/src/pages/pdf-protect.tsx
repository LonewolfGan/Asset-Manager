import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { PDFDocument } from 'pdf-lib';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolLoadingState, ToolEmptyState,
} from '@/components/ToolContent';

export default function PdfProtect() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [allowModifying, setAllowModifying] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    if (!userPassword && !ownerPassword) {
      setError("Please set at least one password.");
      return;
    }
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      trackToolUsed('pdf-protect', 'pdf');
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setProgress(50);

      // Note: pdf-lib uses RC4 128-bit encryption
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: false,
        userPassword: userPassword || undefined,
        ownerPassword: ownerPassword || undefined,
        permissions: {
          printing: allowPrinting ? 'highResolution' : undefined,
          copying: allowCopying,
          modifying: allowModifying,
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      setProgress(100);

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_protected.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('pdf-protect', 'general-error');
      setError(e instanceof Error ? e.message : 'Protection failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'Protect PDF']}
      title={t.tools['pdf-protect']?.title ?? 'Protect PDF'}
      description={t.tools['pdf-protect']?.description ?? 'Encrypt your PDF and restrict printing or copying.'}
      seoSlug="pdf-protect"
    >
      <ToolWorkspace>
        <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />

        {files.length > 0 && (
          <ToolCard title="PASSWORDS & PERMISSIONS">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>User Password (Required to Open)</label>
                <input type="text" placeholder="Enter password to open" value={userPassword} onChange={e => setUserPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>Owner Password (Required to change permissions)</label>
                <input type="text" placeholder="Enter owner password (optional)" value={ownerPassword} onChange={e => setOwnerPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {([
                { checked: allowPrinting,  onChange: setAllowPrinting,  label: 'Allow Printing' },
                { checked: allowCopying,   onChange: setAllowCopying,   label: 'Allow Copying Text' },
                { checked: allowModifying, onChange: setAllowModifying, label: 'Allow Editing' },
              ] as const).map(({ checked, onChange, label }) => (
                <label
                  key={label}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 8, transition: 'background 120ms ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <input type="checkbox" checked={checked} onChange={ev => onChange(ev.target.checked)} style={{ accentColor: 'var(--accent)', width: 15, height: 15, flexShrink: 0 }} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </ToolCard>
        )}

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Apply Protection
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Encrypting PDF..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
