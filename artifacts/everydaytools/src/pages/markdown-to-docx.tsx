import { useState } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { marked } from 'marked';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

async function markdownToDocxBlob(markdown: string): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');

  const html = await marked(markdown);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const paragraphs: InstanceType<typeof Paragraph>[] = [];

  function textRunsFromNode(node: Node): InstanceType<typeof TextRun>[] {
    const runs: InstanceType<typeof TextRun>[] = [];
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text) runs.push(new TextRun({ text }));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tag = el.tagName.toLowerCase();
      const childRuns: InstanceType<typeof TextRun>[] = [];
      for (const child of el.childNodes) {
        childRuns.push(...textRunsFromNode(child));
      }
      if (tag === 'strong' || tag === 'b') {
        childRuns.forEach(r => { (r as any).options = { ...(r as any).options, bold: true }; });
        runs.push(...childRuns.map(r => new TextRun({ text: (r as any).options?.text || '', bold: true })));
      } else if (tag === 'em' || tag === 'i') {
        runs.push(...childRuns.map(r => new TextRun({ text: (r as any).options?.text || '', italics: true })));
      } else if (tag === 'code') {
        runs.push(...childRuns.map(r => new TextRun({ text: (r as any).options?.text || '', font: 'Courier New' })));
      } else {
        runs.push(...childRuns);
      }
    }
    return runs;
  }

  function getHeadingLevel(tag: string) {
    switch (tag) {
      case 'h1': return HeadingLevel.HEADING_1;
      case 'h2': return HeadingLevel.HEADING_2;
      case 'h3': return HeadingLevel.HEADING_3;
      case 'h4': return HeadingLevel.HEADING_4;
      case 'h5': return HeadingLevel.HEADING_5;
      case 'h6': return HeadingLevel.HEADING_6;
      default: return undefined;
    }
  }

  function processNode(node: Element) {
    const tag = node.tagName.toLowerCase();

    if (['h1','h2','h3','h4','h5','h6'].includes(tag)) {
      const level = getHeadingLevel(tag);
      paragraphs.push(new Paragraph({
        heading: level,
        children: [new TextRun({ text: node.textContent || '', bold: true })],
      }));
    } else if (tag === 'p') {
      const runs = textRunsFromNode(node);
      paragraphs.push(new Paragraph({ children: runs.length ? runs : [new TextRun('')] }));
    } else if (tag === 'ul' || tag === 'ol') {
      const isOrdered = tag === 'ol';
      let idx = 1;
      for (const li of node.querySelectorAll(':scope > li')) {
        const prefix = isOrdered ? `${idx++}. ` : '\u2022 ';
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: prefix + (li.textContent || '') })],
          indent: { left: 720 },
        }));
      }
    } else if (tag === 'blockquote') {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: node.textContent || '', italics: true, color: '555555' })],
        indent: { left: 720 },
      }));
    } else if (tag === 'hr') {
      paragraphs.push(new Paragraph({ children: [new TextRun('─'.repeat(40))] }));
    } else if (tag === 'pre') {
      const code = node.querySelector('code');
      const lines = (code?.textContent || node.textContent || '').split('\n');
      for (const line of lines) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: line, font: 'Courier New' })],
          indent: { left: 720 },
        }));
      }
    }
  }

  for (const child of doc.body.children) {
    processNode(child as Element);
  }

  if (paragraphs.length === 0) {
    paragraphs.push(new Paragraph({ children: [new TextRun('')] }));
  }

  const docx = new Document({ sections: [{ children: paragraphs }] });
  return await Packer.toBlob(docx);
}

export default function MarkdownToDocx() {
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
      const file = files[0];
      const text = await file.text();
      setProgress(30);

      const blob = await markdownToDocxBlob(text);
      setProgress(100);
      trackToolUsed('markdown-to-docx', 'documents');

      setResult({ blob, filename: file.name.replace(/\.(md|txt)$/i, '.docx'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('markdown-to-docx', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Word Tools', 'Markdown to Word']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['markdown-to-docx']?.title ?? 'Markdown to Word'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{t.tools['markdown-to-docx']?.description ?? 'Convert Markdown files to Microsoft Word (.docx) format.'}</p>

      <FileUpload accept={['.md', '.txt', 'text/markdown', 'text/plain']} maxSizeMB={10} onFiles={setFiles} />

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Convert to DOCX
        </button>
      )}

      {isProcessing && <ProgressBar progress={progress} label="Converting..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 'var(--text-sm)' }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="markdown-to-docx" />
  </>
  );
}
