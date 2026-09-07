import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Eye, Download, Copy, Check } from 'lucide-react';

export default function MarkdownPreview() {
  const { t } = useLocale();
  const [markdown, setMarkdown] = useState(`# EverydayTools Hub

A suite of **fast**, **private**, and **secure** browser tools.

## Features
- All files processed client-side
- Full support for PDF, Word, Excel, and Images
- Zero tracking of sensitive payloads

| Category | Tools | Status |
| :--- | :--- | :--- |
| **PDF** | 16+ | ✅ Ready |
| **Image** | 20+ | ✅ Ready |
| **Data** | 15+ | ✅ Ready |

\`\`\`typescript
const greeting = "Hello developer!";
console.log(greeting);
\`\`\`
`);
  const [copied, setCopied] = useState(false);

  const rawHtml = marked.parse(markdown) as string;
  const safeHtml = DOMPurify.sanitize(rawHtml);

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(safeHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'Markdown Editor & Previewer']} />
        <PageTitle>Markdown Live Editor & Preview</PageTitle>
        <PageSubtitle>Write markdown with real-time rendered preview, table support, syntax blocks, and instant HTML export.</PageSubtitle>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Markdown Editor</p>
              <button onClick={downloadMd} style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Download size={12} />
                Download .md
              </button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={20}
              style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            />
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Rendered Preview</p>
              <button onClick={copyHtml} style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied HTML' : 'Copy HTML'}
              </button>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: safeHtml }}
              style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', minHeight: 380, color: 'var(--text-primary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}
            />
          </div>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="markdown-preview" />
    </>
  );
}
