import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Paintbrush, Copy, Download, Check, Sparkles } from 'lucide-react';

export default function CssFormatter() {
  const { t } = useLocale();
  const [inputCss, setInputCss] = useState(`.btn{background:#1A6BFF;color:#fff;padding:8px 16px;border-radius:6px;border:none}.btn:hover{background:#0052cc}`);
  const [outputCss, setOutputCss] = useState('');
  const [copied, setCopied] = useState(false);

  const minify = () => {
    const min = inputCss
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s*([:;{}])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
    setOutputCss(min);
    trackToolUsed('css-formatter', 'textCode');
  };

  const beautify = () => {
    let clean = inputCss.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ');
    let formatted = '';
    let indent = 0;
    for (let i = 0; i < clean.length; i++) {
      const char = clean[i];
      if (char === '{') {
        indent += 2;
        formatted += ' {\n' + ' '.repeat(indent);
      } else if (char === '}') {
        indent = Math.max(0, indent - 2);
        formatted += '\n' + ' '.repeat(indent) + '}\n\n' + ' '.repeat(indent);
      } else if (char === ';') {
        formatted += ';\n' + ' '.repeat(indent);
      } else {
        formatted += char;
      }
    }
    setOutputCss(formatted.trim());
    trackToolUsed('css-formatter', 'textCode');
  };

  const copy = () => {
    navigator.clipboard.writeText(outputCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'CSS Minifier & Beautifier']} />
        <PageTitle>CSS Minifier & Formatter</PageTitle>
        <PageSubtitle>Minify stylesheets for fast loading or format compressed CSS into clean, readable style blocks.</PageSubtitle>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Input CSS</p>
            <textarea
              value={inputCss}
              onChange={(e) => setInputCss(e.target.value)}
              rows={14}
              style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button onClick={beautify} style={{ flex: 1, padding: '10px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                Beautify CSS
              </button>
              <button onClick={minify} style={{ flex: 1, padding: '10px', background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                Minify CSS
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Result</p>
              {outputCss && (
                <button onClick={copy} style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            <textarea
              readOnly
              value={outputCss}
              rows={16}
              style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            />
          </div>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="css-formatter" />
    </>
  );
}
