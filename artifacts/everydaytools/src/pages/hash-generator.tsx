import { useState, useEffect } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Hash, Copy, Check } from 'lucide-react';

async function calculateHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
  const { t } = useLocale();
  const [input, setInput] = useState('EverydayTools');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      trackToolUsed('hash-generator', 'textCode');
      const sha1 = await calculateHash(input, 'SHA-1');
      const sha256 = await calculateHash(input, 'SHA-256');
      const sha384 = await calculateHash(input, 'SHA-384');
      const sha512 = await calculateHash(input, 'SHA-512');
      setHashes({
        'SHA-256': sha256,
        'SHA-512': sha512,
        'SHA-1': sha1,
        'SHA-384': sha384,
      });
    }
    run();
  }, [input]);

  const copy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'Hash Generator']} />
        <PageTitle>Cryptographic Hash Generator</PageTitle>
        <PageSubtitle>Compute SHA-256, SHA-512, SHA-384, and SHA-1 cryptographic hashes simultaneously using hardware-accelerated SubtleCrypto.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 20 }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(hashes).map(([algo, h]) => (
            <div key={algo} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>{algo}</span>
                <button onClick={() => copy(algo, h)} style={{ padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {copiedKey === algo ? <Check size={12} /> : <Copy size={12} />}
                  {copiedKey === algo ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', wordBreak: 'break-all', margin: 0 }}>
                {h}
              </p>
            </div>
          ))}
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="hash-generator" />
    </>
  );
}
