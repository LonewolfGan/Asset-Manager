import { useState } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import JSZip from 'jszip';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function MetadataCleaner() {
  const { t } = useLocale();
  const tc = t.metadataCleaner;
  const [tab, setTab] = useState<'images'|'pdfs'|'docs'>('images');

  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTabChange = (newTab: 'images'|'pdfs'|'docs') => {
    setTab(newTab);
    setFiles([]);
    setMetadata(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!files[0]) return;
    setError(null);
    try {
      const file = files[0];
      if (tab === 'images' || tab === 'pdfs') {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/metadata/read', { method: 'POST', body: fd });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
          trackToolError('metadata-cleaner', 'general-error');
          throw new Error(err.error);
        }
        const data = await res.json();
        setMetadata(data.metadata && Object.keys(data.metadata).length > 0 ? data.metadata : { info: "No standard metadata found." });
      } else if (tab === 'docs') {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        const meta: Record<string, string> = {};
        if (zip.file("docProps/core.xml")) {
          const core = await zip.file("docProps/core.xml")!.async("string");
          meta["Core Props"] = "Found";
          const creatorMatch = core.match(/<dc:creator>(.*?)<\/dc:creator>/);
          if (creatorMatch) meta["Creator"] = creatorMatch[1];
        }
        if (zip.file("docProps/app.xml")) {
          const app = await zip.file("docProps/app.xml")!.async("string");
          meta["App Props"] = "Found";
          const companyMatch = app.match(/<Company>(.*?)<\/Company>/);
          if (companyMatch) meta["Company"] = companyMatch[1];
        }
        setMetadata(Object.keys(meta).length > 0 ? meta : { info: "No standard metadata found." });
      }
    } catch (e) {
      trackToolError('metadata-cleaner', 'general-error');
      setError(e instanceof Error ? e.message : 'Analysis failed.');
    }
  };

  const handleClean = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true);
    try {
      const file = files[0];
      let blob: Blob;

      if (tab === 'images' || tab === 'pdfs') {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/metadata/clean', { method: 'POST', body: fd });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Cleaning failed' }));
          trackToolError('metadata-cleaner', 'general-error');
          throw new Error(err.error);
        }
        const arrayBuffer = await res.arrayBuffer();
        blob = new Blob([arrayBuffer], { type: file.type });
      } else if (tab === 'docs') {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        const emptyCore = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></cp:coreProperties>`;
        const emptyApp = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"></Properties>`;
        if (zip.file("docProps/core.xml")) zip.file("docProps/core.xml", emptyCore);
        if (zip.file("docProps/app.xml")) zip.file("docProps/app.xml", emptyApp);
        blob = await zip.generateAsync({ type: "blob" });
      } else {
        throw new Error("Invalid tab");
      }

      setResult({ blob, filename: file.name.replace(/(\.[a-z]+)$/i, '_cleaned$1'), sizeAfter: blob.size, sizeBefore: file.size });
      trackToolUsed('metadata-cleaner', 'utilities');
    } catch (e) {
      trackToolError('metadata-cleaner', 'general-error');
      setError(e instanceof Error ? e.message : 'Cleaning failed.');
    } finally { setIsProcessing(false); }
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
    fontWeight: 500,
    cursor: 'pointer',
    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
    fontFamily: 'var(--font-ui)',
    fontSize: 14,
  });

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Privacy Tools', 'Metadata Cleaner']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['metadata-cleaner']?.title ?? 'Metadata Cleaner'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['metadata-cleaner']?.description ?? 'Strip EXIF, XMP, and document properties from your files to protect your privacy.'}</p>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        <button onClick={() => handleTabChange('images')} style={tabStyle(tab === 'images')}>{tc.tabImages}</button>
        <button onClick={() => handleTabChange('pdfs')} style={tabStyle(tab === 'pdfs')}>{tc.tabPdfs}</button>
        <button onClick={() => handleTabChange('docs')} style={tabStyle(tab === 'docs')}>{tc.tabDocs}</button>
      </div>

      {tab === 'images' && <FileUpload accept={['image/jpeg', 'image/png']} maxSizeMB={20} onFiles={setFiles} />}
      {tab === 'pdfs' && <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />}
      {tab === 'docs' && <FileUpload accept={['.docx']} maxSizeMB={50} onFiles={setFiles} />}

      {files.length > 0 && !result && (
        <button onClick={handleAnalyze} style={{ marginTop: 16, padding: '12px 24px', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          {tc.analyzeBtn}
        </button>
      )}

      {metadata && !result && (
        <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{tc.foundMetadata}</h3>
          <pre style={{ maxHeight: 200, overflow: 'auto', background: 'var(--bg-base)', padding: 12, borderRadius: 'var(--radius)', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {JSON.stringify(metadata, null, 2)}
          </pre>

          <button onClick={handleClean} disabled={isProcessing}
            style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
            {tc.cleanBtn}
          </button>
        </div>
      )}

      {isProcessing && <ProgressBar progress={100} label={tc.cleaningLabel} />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14, fontFamily: 'var(--font-ui)' }}>{error}</p>}

      {result && (
        <div>
          <ResultPanel {...result} />
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, lineHeight: 1.5, fontFamily: 'var(--font-ui)', color: 'var(--text-secondary)' }}>
            {tc.disclaimer}
          </div>
        </div>
      )}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="metadata-cleaner" />
  </>
  );
}
