import { useState, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolEmptyState,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';

export default function PptxToPdf() {
  const { t } = useLocale();
  const title = t.tools['pptx-to-pdf']?.title ?? 'PowerPoint to PDF';
  const desc = t.tools['pptx-to-pdf']?.description ?? 'Convert PowerPoint presentations to PDF. Each slide becomes a page.';
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async (f: File) => {
    setFile(f); setStatus('processing'); setProgress(10); setPdfBlob(null);
    try {
      const PptxGenJS = (await import('pptxgenjs')).default;
      setProgress(20);

      const buf = await f.arrayBuffer();
      const zip = await import('jszip');
      const JSZip = zip.default;
      const pptxZip = await JSZip.loadAsync(buf);
      setProgress(35);

      const slideFiles = Object.keys(pptxZip.files)
        .filter((name) => name.match(/^ppt\/slides\/slide\d+\.xml$/))
        .sort((a, b) => {
          const na = parseInt(a.match(/\d+/)?.[0] ?? '0');
          const nb = parseInt(b.match(/\d+/)?.[0] ?? '0');
          return na - nb;
        });

      const jsPDF = (await import('jspdf')).jsPDF;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [960, 540] });
      setProgress(50);

      const parser = new DOMParser();

      for (let i = 0; i < slideFiles.length; i++) {
        const xmlStr = await pptxZip.files[slideFiles[i]].async('string');
        const doc = parser.parseFromString(xmlStr, 'application/xml');
        const textEls = doc.querySelectorAll('t');
        const texts = Array.from(textEls).map((el) => el.textContent?.trim()).filter(Boolean);

        if (i > 0) pdf.addPage([960, 540], 'landscape');

        pdf.setFillColor(248, 248, 248);
        pdf.rect(0, 0, 960, 540, 'F');
        pdf.setTextColor(30, 30, 30);
        pdf.setFont('Helvetica', 'bold');
        pdf.setFontSize(22);

        let y = 60;
        if (texts.length > 0) {
          pdf.text(`Slide ${i + 1}: ${texts[0]}`, 40, y);
          y += 40;
        } else {
          pdf.text(`Slide ${i + 1}`, 40, y);
          y += 40;
        }

        pdf.setFont('Helvetica', 'normal');
        pdf.setFontSize(14);
        for (let ti = 1; ti < texts.length && y < 500; ti++) {
          const lines = pdf.splitTextToSize(texts[ti]!, 880);
          for (const line of lines) {
            if (y > 500) break;
            pdf.text(line, 40, y);
            y += 20;
          }
        }

        setProgress(50 + Math.round(((i + 1) / slideFiles.length) * 40));
      }

      const blob = pdf.output('blob');
      setPdfBlob(blob);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      trackToolError('pptx-to-pdf', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setStatus('error');
    }
  };

  const download = () => {
    trackToolUsed('pptx-to-pdf', 'documents');
    if (!pdfBlob || !file) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.pptx?$/i, '.pdf');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PowerPoint', title]}
      title={title}
      description={desc}
      seoSlug="pptx-to-pdf"
    >
      <ToolWorkspace>
        <div style={{ padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 20, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          Text content is extracted from each slide. Complex layouts and images are simplified in the PDF output.
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) convert(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)' }}
        >
          <input ref={inputRef} type="file" accept=".pptx,.ppt" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) convert(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
            {file ? file.name : t.common.dropFileHere}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>.pptx · max 50 MB</p>
        </div>

        <ToolLoadingState
          status={status === 'processing' ? 'loading' : status === 'error' ? 'error' : 'idle'}
          progress={status === 'processing' ? progress : undefined}
          label={t.common.converting}
          errorMessage={error || undefined}
          onRetry={status === 'error' && file ? () => convert(file) : undefined}
        />

        {status === 'done' && pdfBlob && (
          <div style={{ marginTop: 16, padding: '16px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{t.common.pdfReady((pdfBlob.size / 1024).toFixed(1))}</span>
            <button onClick={download} style={{ padding: '9px 18px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer' }}>{t.common.downloadPdf}</button>
          </div>
        )}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
