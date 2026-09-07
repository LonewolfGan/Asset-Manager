import { useState, useRef, useEffect } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import JsBarcode from 'jsbarcode';
import { Barcode, Download } from 'lucide-react';

export default function BarcodeGenerator() {
  const { t } = useLocale();
  const [value, setValue] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const [lineColor, setLineColor] = useState('#000000');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [displayValue, setDisplayValue] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !value) return;
    try {
      JsBarcode(svgRef.current, value, {
        format,
        lineColor,
        width,
        height,
        displayValue,
        font: 'monospace',
        fontSize: 14,
        margin: 10,
        background: '#ffffff',
      });
      trackToolUsed('barcode-generator', 'textCode');
    } catch {}
  }, [value, format, lineColor, width, height, displayValue]);

  const downloadSvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode_${format}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(source)));
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `barcode_${format}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    };
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'Barcode Generator']} />
        <PageTitle>Barcode Generator</PageTitle>
        <PageSubtitle>Generate custom barcodes in CODE128, EAN-13, UPC-A, CODE39, and ITF-14 formats and download as vector SVG or PNG.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Barcode Content</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', marginBottom: 16 }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Format</label>
                  <select value={format} onChange={(e) => setFormat(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }}>
                    <option value="CODE128">CODE128 (Standard)</option>
                    <option value="EAN13">EAN-13 (Product)</option>
                    <option value="UPC">UPC-A (Retail)</option>
                    <option value="CODE39">CODE39 (Alphanumeric)</option>
                    <option value="ITF14">ITF-14 (Packaging)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Bar Width</label>
                  <input type="range" min="1" max="4" value={width} onChange={(e) => setWidth(Number(e.target.value))} style={{ width: '100%', marginTop: 8 }} />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={displayValue} onChange={(e) => setDisplayValue(e.target.checked)} />
                Display Human-Readable Text Below
              </label>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', borderRadius: 'var(--radius-md)', padding: 20, border: '1px solid var(--border)' }}>
              <svg ref={svgRef} />
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button onClick={downloadPng} style={{ padding: '8px 16px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Download size={14} />
                  Download PNG
                </button>
                <button onClick={downloadSvg} style={{ padding: '8px 16px', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Download size={14} />
                  Download SVG
                </button>
              </div>
            </div>
          </div>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="barcode-generator" />
    </>
  );
}
