import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import * as yaml from 'js-yaml';
import { ArrowRightLeft, Copy, Download, Check, RefreshCw } from 'lucide-react';

export default function DataConverter() {
  const { t } = useLocale();
  const [fromFormat, setFromFormat] = useState<'json' | 'csv' | 'xml' | 'yaml'>('json');
  const [toFormat, setToFormat] = useState<'json' | 'csv' | 'xml' | 'yaml'>('csv');
  const [inputData, setInputData] = useState(`[
  { "id": 1, "name": "Alpha", "role": "Admin", "active": true },
  { "id": 2, "name": "Beta", "role": "Developer", "active": true },
  { "id": 3, "name": "Gamma", "role": "Designer", "active": false }
]`);
  const [outputData, setOutputData] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (srcData = inputData, from = fromFormat, to = toFormat) => {
    setError('');
    trackToolUsed('data-converter', 'textCode');
    try {
      if (!srcData.trim()) {
        setOutputData('');
        return;
      }

      // Step 1: Parse input to JS object/array
      let parsedObj: any = null;
      if (from === 'json') {
        parsedObj = JSON.parse(srcData);
      } else if (from === 'csv') {
        const res = Papa.parse(srcData, { header: true, dynamicTyping: true, skipEmptyLines: true });
        if (res.errors.length > 0 && res.data.length === 0) throw new Error(res.errors[0].message);
        parsedObj = res.data;
      } else if (from === 'xml') {
        const parser = new XMLParser({ ignoreAttributes: false, parseAttributeValue: true });
        parsedObj = parser.parse(srcData);
      } else if (from === 'yaml') {
        parsedObj = yaml.load(srcData);
      }

      // Step 2: Convert JS object/array to target format
      let result = '';
      if (to === 'json') {
        result = JSON.stringify(parsedObj, null, 2);
      } else if (to === 'csv') {
        const arr = Array.isArray(parsedObj) ? parsedObj : [parsedObj];
        result = Papa.unparse(arr);
      } else if (to === 'xml') {
        const builder = new XMLBuilder({ format: true, ignoreAttributes: false });
        result = builder.build(typeof parsedObj === 'object' && parsedObj !== null && !Array.isArray(parsedObj) ? parsedObj : { root: { item: parsedObj } });
      } else if (to === 'yaml') {
        result = yaml.dump(parsedObj, { indent: 2 });
      }

      setOutputData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid data format');
    }
  };

  const swap = () => {
    const tempF = fromFormat;
    const tempT = toFormat;
    setFromFormat(tempT);
    setToFormat(tempF);
    setInputData(outputData || inputData);
    convert(outputData || inputData, tempT, tempF);
  };

  const copy = () => {
    navigator.clipboard.writeText(outputData);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const extMap: Record<string, string> = { json: 'json', csv: 'csv', xml: 'xml', yaml: 'yaml' };
    const mimeMap: Record<string, string> = {
      json: 'application/json', csv: 'text/csv', xml: 'application/xml', yaml: 'text/yaml'
    };
    const blob = new Blob([outputData], { type: mimeMap[toFormat] ?? 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${extMap[toFormat]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'Universal Data Converter']} />
        <PageTitle>Data Converter (JSON ↔ CSV ↔ XML ↔ YAML)</PageTitle>
        <PageSubtitle>Seamlessly transform and convert structured data between JSON, CSV, XML, and YAML formats in real-time.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>From</label>
                <select value={fromFormat} onChange={(e) => { const f = e.target.value as any; setFromFormat(f); convert(inputData, f, toFormat); }}
                  style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="xml">XML</option>
                  <option value="yaml">YAML</option>
                </select>
              </div>

              <button onClick={swap} style={{ marginTop: 18, padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <ArrowRightLeft size={14} />
              </button>

              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>To</label>
                <select value={toFormat} onChange={(e) => { const t = e.target.value as any; setToFormat(t); convert(inputData, fromFormat, t); }}
                  style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="xml">XML</option>
                  <option value="yaml">YAML</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <button onClick={() => convert()} style={{ padding: '8px 16px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={12} />
                Convert
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#ef4444', fontSize: 'var(--text-xs)', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>Input ({fromFormat.toUpperCase()})</span>
            </div>
            <textarea
              value={inputData}
              onChange={(e) => { setInputData(e.target.value); convert(e.target.value, fromFormat, toFormat); }}
              rows={16}
              style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', resize: 'vertical' }}
            />
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>Output ({toFormat.toUpperCase()})</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={copy} style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button onClick={download} style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Download size={12} />
                  Download
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={outputData}
              rows={16}
              style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', resize: 'vertical' }}
            />
          </div>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="data-converter" />
    </>
  );
}
