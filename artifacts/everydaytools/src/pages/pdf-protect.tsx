import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument } from 'pdf-lib';
import ToolPageSEO from '@/components/ToolPageSEO';

export default function PdfProtect() {
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
      });
      setProgress(100);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_protected.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Protection failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Protect PDF']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Protect PDF</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Encrypt your PDF and restrict printing or copying.</p>
      
      <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Passwords</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, fontWeight: 500 }}>User Password (Required to Open)</label>
              <input type="text" placeholder="Enter password to open" value={userPassword} onChange={e => setUserPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, fontWeight: 500 }}>Owner Password (Required to change permissions)</label>
              <input type="text" placeholder="Enter owner password (optional)" value={ownerPassword} onChange={e => setOwnerPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none' }} />
            </div>
          </div>
          
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Permissions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={allowPrinting} onChange={e => setAllowPrinting(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
              <span>Allow Printing</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={allowCopying} onChange={e => setAllowCopying(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
              <span>Allow Copying Text</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={allowModifying} onChange={e => setAllowModifying(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
              <span>Allow Editing</span>
            </label>
          </div>
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Apply Protection
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Encrypting PDF..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="pdf-protect" />
  </>
  );
}
