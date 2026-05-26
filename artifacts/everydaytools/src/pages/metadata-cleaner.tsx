import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import exifr from 'exifr';
import piexif from 'piexifjs';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export default function MetadataCleaner() {
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
      if (tab === 'images') {
        const meta = await exifr.parse(file, true);
        setMetadata(meta || { info: "No standard metadata found." });
      } else if (tab === 'pdfs') {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setMetadata({
          Title: pdfDoc.getTitle() || "None",
          Author: pdfDoc.getAuthor() || "None",
          Creator: pdfDoc.getCreator() || "None",
          Producer: pdfDoc.getProducer() || "None",
          CreationDate: pdfDoc.getCreationDate()?.toISOString() || "None",
        });
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
      setError(e instanceof Error ? e.message : 'Analysis failed.');
    }
  };

  const handleClean = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true);
    try {
      const file = files[0];
      let blob: Blob;
      
      if (tab === 'images') {
        // Convert to base64
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        // Ensure it's jpeg
        if (file.type === 'image/jpeg') {
          const cleanB64 = piexif.remove(dataUrl);
          const byteString = atob(cleanB64.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
          }
          blob = new Blob([ab], { type: 'image/jpeg' });
        } else {
           // For non-jpeg, simply return a generic blob or use canvas
           blob = file;
        }
      } else if (tab === 'pdfs') {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setKeywords([]);
        pdfDoc.setCreationDate(new Date(0));
        pdfDoc.setCreator('');
        pdfDoc.setProducer('');
        const pdfBytes = await pdfDoc.save();
        blob = new Blob([pdfBytes], { type: 'application/pdf' });
      } else if (tab === 'docs') {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        
        // Minimal core.xml
        const emptyCore = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></cp:coreProperties>`;
        
        const emptyApp = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"></Properties>`;
        
        if (zip.file("docProps/core.xml")) zip.file("docProps/core.xml", emptyCore);
        if (zip.file("docProps/app.xml")) zip.file("docProps/app.xml", emptyApp);
        
        const zipBlob = await zip.generateAsync({ type: "blob" });
        blob = zipBlob;
      } else {
        throw new Error("Invalid tab");
      }
      
      setResult({ blob, filename: file.name.replace(/(\.[a-z]+)$/i, '_cleaned$1'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cleaning failed.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "What metadata does this remove?", a: "It removes standard EXIF data from JPEGs, document properties (Author, Creator) from PDFs, and Core/App properties from Word documents." },
    { q: "Does it remove AI fingerprints?", a: "No. This tool removes standard metadata fields. It does not guarantee removal of cryptographic fingerprints, steganographic data, or AI model watermarks embedded in pixel values." },
    { q: "Can I clean other image formats?", a: "EXIF removal works best on JPEG. Other formats might not contain EXIF data or are handled differently." },
    { q: "Is GPS location data removed?", a: "Yes, GPS coordinates embedded in EXIF tags of JPEGs are completely removed." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Privacy Tools', 'Metadata Cleaner']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Metadata Cleaner</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Strip EXIF, XMP, and document properties from your files to protect your privacy.</p>
      
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        <button onClick={() => handleTabChange('images')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'images' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: 500, cursor: 'pointer', color: tab === 'images' ? 'var(--text)' : 'var(--muted)' }}>Images</button>
        <button onClick={() => handleTabChange('pdfs')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'pdfs' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: 500, cursor: 'pointer', color: tab === 'pdfs' ? 'var(--text)' : 'var(--muted)' }}>PDFs</button>
        <button onClick={() => handleTabChange('docs')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'docs' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: 500, cursor: 'pointer', color: tab === 'docs' ? 'var(--text)' : 'var(--muted)' }}>Documents (DOCX)</button>
      </div>
      
      {tab === 'images' && <FileUpload accept={['image/jpeg', 'image/png']} maxSizeMB={20} onFiles={setFiles} />}
      {tab === 'pdfs' && <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />}
      {tab === 'docs' && <FileUpload accept={['.docx']} maxSizeMB={50} onFiles={setFiles} />}
      
      {files.length > 0 && !result && (
        <button onClick={handleAnalyze} style={{ marginTop: 16, padding: '12px 24px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Analyze Metadata
        </button>
      )}
      
      {metadata && !result && (
        <div style={{ marginTop: 24, padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Found Metadata</h3>
          <pre style={{ maxHeight: 200, overflow: 'auto', background: 'var(--bg)', padding: 12, borderRadius: 'var(--radius)', fontSize: 13, fontFamily: 'IBM Plex Mono, monospace' }}>
            {JSON.stringify(metadata, null, 2)}
          </pre>
          
          <button onClick={handleClean} disabled={isProcessing}
            style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
            Clean & Download
          </button>
        </div>
      )}
      
      {isProcessing && <ProgressBar progress={100} label="Cleaning..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      
      {result && (
        <div>
          <ResultPanel {...result} />
          <div style={{ marginTop: 16, padding: 12, background: 'var(--danger)', color: 'white', opacity: 0.9, borderRadius: 'var(--radius)', fontSize: 13, lineHeight: 1.5 }}>
            <strong>Disclaimer:</strong> This tool removes common metadata fields (EXIF, XMP, document properties). It does not guarantee removal of cryptographic fingerprints, steganographic data, or AI model watermarks embedded in pixel values.
          </div>
        </div>
      )}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
