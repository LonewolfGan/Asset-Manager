import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolLoadingState from '@/components/ToolLoadingState';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { PDFDocument } from 'pdf-lib';
import { FileEdit, Download, Save } from 'lucide-react';

export default function PdfMetadata() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [keywords, setKeywords] = useState('');
  const [creator, setCreator] = useState('');
  const [producer, setProducer] = useState('');
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [savedBlob, setSavedBlob] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setFile(f);
    setSavedBlob(null);
    const buf = await f.arrayBuffer();
    const doc = await PDFDocument.load(buf);
    setTitle(doc.getTitle() ?? '');
    setAuthor(doc.getAuthor() ?? '');
    setSubject(doc.getSubject() ?? '');
    setKeywords(doc.getKeywords() ?? '');
    setCreator(doc.getCreator() ?? '');
    setProducer(doc.getProducer() ?? '');
    setPdfBytes(new Uint8Array(buf));
    trackToolUsed('pdf-metadata', 'pdf');
  };

  const saveMetadata = async () => {
    if (!pdfBytes) return;
    const doc = await PDFDocument.load(pdfBytes);
    doc.setTitle(title);
    doc.setAuthor(author);
    doc.setSubject(subject);
    doc.setKeywords(keywords.split(',').map(s => s.trim()).filter(Boolean));
    doc.setCreator(creator);
    doc.setProducer(producer);
    const saved = await doc.save();
    const blob = new Blob([new Uint8Array(saved).buffer as ArrayBuffer], { type: 'application/pdf' });
    setSavedBlob(blob);
  };

  const download = () => {
    if (!savedBlob || !file) return;
    const url = URL.createObjectURL(savedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, '_updated.pdf');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'PDF Tools', 'Edit PDF Metadata']} />
        <PageTitle>PDF Metadata Editor</PageTitle>
        <PageSubtitle>View, edit, or customize PDF properties including Title, Author, Subject, Keywords, Creator, and Producer.</PageSubtitle>

        {!file && (
          <div
            onClick={() => inputRef.current?.click()}
            style={{
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius)',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'var(--bg-surface)',
            }}
          >
            <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <FileEdit style={{ width: 40, height: 40, margin: '0 auto 12px', color: 'var(--accent)' }} />
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
              Drop a PDF file here to view and edit metadata
            </p>
          </div>
        )}

        {file && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>PDF Properties</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }} />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Author</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }} />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Subject / Description</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }} />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Keywords (comma-separated)</label>
                <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={saveMetadata}
                style={{ flex: 1, padding: '12px 20px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Save size={16} />
                Save PDF Metadata
              </button>
              {savedBlob && (
                <button onClick={download}
                  style={{ padding: '12px 20px', background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Download size={16} />
                  Download Updated PDF
                </button>
              )}
            </div>
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="pdf-metadata" />
    </>
  );
}
