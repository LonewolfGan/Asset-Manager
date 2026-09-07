import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Code, Copy, Check } from 'lucide-react';

export default function JsFormatter() {
  const { t } = useLocale();
  const [inputJs, setInputJs] = useState(`function calculateTotal(items,taxRate){return items.reduce((acc,item)=>acc+item.price,0)*(1+taxRate);}`);
  const [outputJs, setOutputJs] = useState('');
  const [copied, setCopied] = useState(false);

  const format = () => {
    trackToolUsed('js-formatter', 'textCode');
    try {
      let code = inputJs;
      // Basic aesthetic formatter for JS/TS
      let formatted = code
        .replace(/;(?=[^\n])/g, ';\n')
        .replace(/\{(?=[^\n])/g, ' {\n  ')
        .replace(/\}(?=[^\n])/g, '\n}\n');
      setOutputJs(formatted);
    } catch {
      setOutputJs(inputJs);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(outputJs);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'JS/TS Formatter']} />
        <PageTitle>JavaScript / TypeScript Beautifier</PageTitle>
        <PageSubtitle>Format and clean JavaScript and TypeScript source code with standardized indentation and spacing.</PageSubtitle>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Input JS / TS</p>
            <textarea
              value={inputJs}
              onChange={(e) => setInputJs(e.target.value)}
              rows={14}
              style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            />
            <button onClick={format} style={{ marginTop: 12, width: '100%', padding: '10px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
              Format Code
            </button>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Formatted Result</p>
              {outputJs && (
                <button onClick={copy} style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            <textarea
              readOnly
              value={outputJs}
              rows={16}
              style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            />
          </div>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="js-formatter" />
    </>
  );
}
