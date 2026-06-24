import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';

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
    setError(null); setIsProcessing(true); setProgress(10);

    try {
      trackToolUsed('pdf-protect', 'pdf');
      const file = files[0];

      const formData = new FormData();
      formData.append('file', file);
      if (userPassword) formData.append('userPassword', userPassword);
      if (ownerPassword) formData.append('ownerPassword', ownerPassword);
      formData.append('allowPrinting', String(allowPrinting));
      formData.append('allowCopying', String(allowCopying));
      formData.append('allowModifying', String(allowModifying));

      setProgress(40);

      const res = await fetch('/api/tools/pdf-protect', {
        method: 'POST',
        body: formData,
      });

      setProgress(80);

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'Protection failed' }));
        throw new Error(json.error ?? 'Protection failed');
      }

      const blob = await res.blob();
      setProgress(100);
      setResult({
        blob,
        filename: file.name.replace(/\.pdf$/i, '_protected.pdf'),
        sizeAfter: blob.size,
        sizeBefore: file.size,
      });
    } catch (e) {
      trackToolError('pdf-protect', 'general-error');
      setError(e instanceof Error ? e.message : 'Protection failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>Owner Password (Required to change permissions)</label>
                <input type="text" placeholder="Enter owner password (optional)" value={ownerPassword} onChange={e => setOwnerPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', boxSizing: 'border-box' }} />
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
          label="Encrypting PDF on server..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
