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
  const [tab, setTab] = useState<'images' | 'pdfs' | 'docs'>('images');

  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string; sizeAfter: number; sizeBefore?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTabChange = (newTab: 'images' | 'pdfs' | 'docs') => {
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

      if (tab === 'images') {
        const piexif = (await import('piexifjs')).default;
        const b64 = await fileToBase64(file);
        const dataUrl = `data:image/jpeg;base64,${b64}`;
        try {
          const exifObj = piexif.load(dataUrl);
          const flat: Record<string, string> = {};
          for (const ifd of ['0th', 'Exif', 'GPS', '1st']) {
            const section = (exifObj as Record<string, Record<string, unknown>>)[ifd];
            if (!section) continue;
            for (const [tag, value] of Object.entries(section)) {
              flat[`${ifd}:${tag}`] = String(value);
            }
          }
          setMetadata(Object.keys(flat).length > 0 ? flat : { info: "No EXIF metadata found." });
        } catch {
          setMetadata({ info: "No EXIF metadata found." });
        }
      } else if (tab === 'pdfs') {
        const { PDFDocument } = await import('pdf-lib');
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const meta: Record<string, string> = {
          Title: pdfDoc.getTitle() ?? "",
          Author: pdfDoc.getAuthor() ?? "",
          Subject: pdfDoc.getSubject() ?? "",
          Producer: pdfDoc.getProducer() ?? "",
          Creator: pdfDoc.getCreator() ?? "",
          Keywords: pdfDoc.getKeywords() ?? "",
        };
        const filtered = Object.fromEntries(Object.entries(meta).filter(([, v]) => v !== ""));
        setMetadata(Object.keys(filtered).length > 0 ? filtered : { info: "No metadata found." });
      } else if (tab === 'docs') {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        const meta: Record<string, string> = {};
        if (zip.file("docProps/core.xml")) {
          const core = await zip.file("docProps/core.xml")!.async("string");
          const creatorMatch = core.match(/<dc:creator>(.*?)<\/dc:creator>/);
          if (creatorMatch) meta["Creator"] = creatorMatch[1];
          const modifiedMatch = core.match(/<dcterms:modified[^>]*>(.*?)<\/dcterms:modified>/);
          if (modifiedMatch) meta["Modified"] = modifiedMatch[1];
        }
        if (zip.file("docProps/app.xml")) {
          const app = await zip.file("docProps/app.xml")!.async("string");
          const companyMatch = app.match(/<Company>(.*?)<\/Company>/);
          if (companyMatch) meta["Company"] = companyMatch[1];
          const appMatch = app.match(/<Application>(.*?)<\/Application>/);
          if (appMatch) meta["Application"] = appMatch[1];
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
    setError(null);
    setIsProcessing(true);
    try {
      const file = files[0];
      let blob: Blob;

      if (tab === 'images') {
        const piexif = (await import('piexifjs')).default;
        const b64 = await fileToBase64(file);
        const dataUrl = `data:image/jpeg;base64,${b64}`;
        const cleanedDataUrl = piexif.remove(dataUrl);
        const cleanedB64 = cleanedDataUrl.split(",")[1];
        blob = b64ToBlob(cleanedB64, 'image/jpeg');
      } else if (tab === 'pdfs') {
        const { PDFDocument } = await import('pdf-lib');
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        pdfDoc.setTitle("");
        pdfDoc.setAuthor("");
        pdfDoc.setSubject("");
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer("");
        pdfDoc.setCreator("");
        const pdfBytes = await pdfDoc.save();
        blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
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
    } finally {
      setIsProcessing(false);
    }
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
    fontSize: 'var(--text-sm)',
  });

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Privacy Tools', 'Metadata Cleaner']} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>
          {t.tools['metadata-cleaner']?.title ?? 'Metadata Cleaner'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>
          {t.tools['metadata-cleaner']?.description ?? 'Strip EXIF, XMP, and document properties from your files to protect your privacy.'}
        </p>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          <button onClick={() => handleTabChange('images')} style={tabStyle(tab === 'images')}>{tc.tabImages}</button>
          <button onClick={() => handleTabChange('pdfs')} style={tabStyle(tab === 'pdfs')}>{tc.tabPdfs}</button>
          <button onClick={() => handleTabChange('docs')} style={tabStyle(tab === 'docs')}>{tc.tabDocs}</button>
        </div>

        {tab === 'images' && <FileUpload accept={['image/jpeg']} maxSizeMB={20} onFiles={setFiles} />}
        {tab === 'pdfs' && <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />}
        {tab === 'docs' && <FileUpload accept={['.docx']} maxSizeMB={50} onFiles={setFiles} />}

        {files.length > 0 && !result && (
          <button onClick={handleAnalyze} style={{ marginTop: 16, padding: '12px 24px', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
            {tc.analyzeBtn}
          </button>
        )}

        {metadata && !result && (
          <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 500, marginBottom: 16, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{tc.foundMetadata}</h3>
            <pre style={{ maxHeight: 200, overflow: 'auto', background: 'var(--bg-base)', padding: 12, borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {JSON.stringify(metadata, null, 2)}
            </pre>
            <button onClick={handleClean} disabled={isProcessing}
              style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
              {tc.cleanBtn}
            </button>
          </div>
        )}

        {isProcessing && <ProgressBar progress={100} />}

        {error && (
          <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="8" cy="8" r="7" stroke="var(--danger)" strokeWidth="1.5" />
              <path d="M8 4.5v4" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="var(--danger)" />
            </svg>
            <span style={{ color: 'var(--danger)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)', lineHeight: 1.55 }}>{error}</span>
          </div>
        )}

        {result && (
          <div>
            <ResultPanel {...result} />
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', lineHeight: 1.5, fontFamily: 'var(--font-ui)', color: 'var(--text-secondary)' }}>
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function b64ToBlob(b64: string, mimeType: string): Blob {
  const byteChars = atob(b64);
  const byteArr = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
  return new Blob([byteArr], { type: mimeType });
}
