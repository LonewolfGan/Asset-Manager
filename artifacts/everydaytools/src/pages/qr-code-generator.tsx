import { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

type InputMode = 'url' | 'text' | 'wifi' | 'vcard';
type ErrorLevel = 'L' | 'M' | 'Q' | 'H';
type WifiEnc = 'WPA' | 'WEP' | 'nopass';

const MODES: { id: InputMode; label: string; labelFR: string }[] = [
  { id: 'url',   label: 'URL',     labelFR: 'URL' },
  { id: 'text',  label: 'Text',    labelFR: 'Texte' },
  { id: 'wifi',  label: 'Wi-Fi',   labelFR: 'Wi-Fi' },
  { id: 'vcard', label: 'Contact', labelFR: 'Contact' },
];

const ERROR_LEVELS: { id: ErrorLevel; label: string; desc: string }[] = [
  { id: 'L', label: 'L', desc: '7% recovery' },
  { id: 'M', label: 'M', desc: '15% recovery' },
  { id: 'Q', label: 'Q', desc: '25% recovery' },
  { id: 'H', label: 'H', desc: '30% recovery' },
];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 'var(--radius-card)',
        border: active ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
        background: active ? 'rgba(255,107,53,0.08)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-sm)',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 120ms ease',
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, fontFamily: 'var(--font-ui)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-input)',
  background: 'var(--bg-base)',
  fontFamily: 'var(--font-ui)',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-primary)',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function QrCodeGenerator() {
  const { t, locale } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<InputMode>('url');
  const [url, setUrl] = useState('https://everydaytools.app');
  const [rawText, setRawText] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiEnc, setWifiEnc] = useState<WifiEnc>('WPA');
  const [vcardName, setVcardName] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');

  const [size, setSize] = useState(260);
  const [errLevel, setErrLevel] = useState<ErrorLevel>('M');
  const [fgColor, setFgColor] = useState('#1A1916');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [margin, setMargin] = useState(1);

  const [copied, setCopied] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);

  const getContent = useCallback((): string => {
    switch (mode) {
      case 'url':   return url.trim();
      case 'text':  return rawText.trim();
      case 'wifi':  return `WIFI:T:${wifiEnc};S:${wifiSsid};P:${wifiPass};;`;
      case 'vcard': return [
        'BEGIN:VCARD', 'VERSION:3.0',
        vcardName  ? `FN:${vcardName}`    : '',
        vcardEmail ? `EMAIL:${vcardEmail}`: '',
        vcardPhone ? `TEL:${vcardPhone}`  : '',
        'END:VCARD',
      ].filter(Boolean).join('\n');
    }
  }, [mode, url, rawText, wifiEnc, wifiSsid, wifiPass, vcardName, vcardEmail, vcardPhone]);

  useEffect(() => {
    const content = getContent();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isEmpty = !content || (mode === 'url' && content === 'https://');
    setEmpty(isEmpty);

    if (isEmpty) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = size;
        canvas.height = size;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
      }
      setGenError(null);
      return;
    }

    QRCode.toCanvas(canvas, content, {
      width: size,
      margin,
      errorCorrectionLevel: errLevel,
      color: { dark: fgColor, light: bgColor },
    }, (err) => {
      if (err) {
        trackToolError('qr-code-generator', 'general-error');
        setGenError(err.message);
      }
      else setGenError(null);
    });
  }, [getContent, size, margin, errLevel, fgColor, bgColor, mode, bgColor]);

  const downloadPng = () => {
    trackToolUsed('qr-code-generator', 'utilities');
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* fallback silent */ }
    });
  };

  const slug = 'qr-code-generator';
  const title       = t.tools[slug]?.title       ?? 'QR Code Generator';
  const description = t.tools[slug]?.description ?? 'Generate QR codes from URLs, text, Wi-Fi credentials, or contact cards.';
  const isFR = locale === 'FR';

  const placeholder = mode === 'url'   ? 'https://example.com'
    : mode === 'text'  ? (isFR ? 'Entrez votre texte…' : 'Enter your text…')
    : '';

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Calculators', 'QR Code Generator']} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)', lineHeight: 1.15 }}>
          {title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>
          {description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* ── Left: controls ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Mode tabs */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 20 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, fontFamily: 'var(--font-ui)' }}>
                {isFR ? 'TYPE DE CONTENU' : 'CONTENT TYPE'}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {MODES.map((m) => (
                  <Chip key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>
                    {isFR ? m.labelFR : m.label}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Content inputs */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, fontFamily: 'var(--font-ui)' }}>
                {isFR ? 'CONTENU' : 'CONTENT'}
              </p>

              {(mode === 'url' || mode === 'text') && (
                mode === 'url' ? (
                  <Field label="URL">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={placeholder}
                      style={INPUT_STYLE}
                    />
                  </Field>
                ) : (
                  <Field label={isFR ? 'Texte' : 'Text'}>
                    <textarea
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder={placeholder}
                      rows={4}
                      style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: 1.5 }}
                    />
                  </Field>
                )
              )}

              {mode === 'wifi' && (
                <>
                  <Field label={isFR ? 'Nom du réseau (SSID)' : 'Network name (SSID)'}>
                    <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="MyNetwork" style={INPUT_STYLE} />
                  </Field>
                  <Field label={isFR ? 'Mot de passe' : 'Password'}>
                    <input type="text" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} placeholder="••••••••" style={INPUT_STYLE} />
                  </Field>
                  <Field label={isFR ? 'Chiffrement' : 'Encryption'}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['WPA', 'WEP', 'nopass'] as WifiEnc[]).map((enc) => (
                        <Chip key={enc} active={wifiEnc === enc} onClick={() => setWifiEnc(enc)}>
                          {enc === 'nopass' ? (isFR ? 'Aucun' : 'None') : enc}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </>
              )}

              {mode === 'vcard' && (
                <>
                  <Field label={isFR ? 'Nom complet' : 'Full name'}>
                    <input type="text" value={vcardName} onChange={(e) => setVcardName(e.target.value)} placeholder="Jane Doe" style={INPUT_STYLE} />
                  </Field>
                  <Field label={isFR ? 'Adresse e-mail' : 'Email address'}>
                    <input type="email" value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} placeholder="jane@example.com" style={INPUT_STYLE} />
                  </Field>
                  <Field label={isFR ? 'Téléphone' : 'Phone number'}>
                    <input type="tel" value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} placeholder="+1 555 000 0000" style={INPUT_STYLE} />
                  </Field>
                </>
              )}
            </div>

            {/* Options */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-ui)' }}>
                {isFR ? 'OPTIONS' : 'OPTIONS'}
              </p>

              {/* Size */}
              <Field label={`${isFR ? 'Taille' : 'Size'}: ${size}px`}>
                <input
                  type="range" min={128} max={512} step={8} value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </Field>

              {/* Margin */}
              <Field label={`${isFR ? 'Marge' : 'Margin'}: ${margin}`}>
                <input
                  type="range" min={0} max={6} step={1} value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </Field>

              {/* Error correction */}
              <Field label={isFR ? 'Correction d\'erreur' : 'Error correction'}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {ERROR_LEVELS.map((el) => (
                    <Chip key={el.id} active={errLevel === el.id} onClick={() => setErrLevel(el.id)}>
                      {el.label}
                    </Chip>
                  ))}
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6, fontFamily: 'var(--font-ui)' }}>
                  {ERROR_LEVELS.find((el) => el.id === errLevel)?.desc}
                </p>
              </Field>

              {/* Colors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label={isFR ? 'Couleur QR' : 'QR color'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', borderRadius: 'var(--radius-input)', padding: '8px 12px', background: 'var(--bg-base)' }}>
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                      style={{ width: 28, height: 28, border: 'none', background: 'none', padding: 0, cursor: 'pointer', borderRadius: 'var(--radius-sm)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{fgColor}</span>
                  </div>
                </Field>
                <Field label={isFR ? 'Couleur fond' : 'Background'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', borderRadius: 'var(--radius-input)', padding: '8px 12px', background: 'var(--bg-base)' }}>
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                      style={{ width: 28, height: 28, border: 'none', background: 'none', padding: 0, cursor: 'pointer', borderRadius: 'var(--radius-sm)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{bgColor}</span>
                  </div>
                </Field>
              </div>
            </div>
          </div>

          {/* ── Right: preview + download ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 76 }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', alignSelf: 'flex-start', fontFamily: 'var(--font-ui)' }}>
                {isFR ? 'APERÇU' : 'PREVIEW'}
              </p>

              <div style={{
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: bgColor,
                width: 280,
                height: 280,
                flexShrink: 0,
              }}>
                {empty ? (
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', textAlign: 'center', padding: '0 24px' }}>
                    {isFR ? 'Entrez du contenu pour générer un QR code' : 'Enter content to generate a QR code'}
                  </p>
                ) : null}
                <canvas
                  ref={canvasRef}
                  style={{
                    display: empty ? 'none' : 'block',
                    width: 280,
                    height: 280,
                    imageRendering: 'pixelated',
                  }}
                />
              </div>

              {genError && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--danger, #DC2626)', fontFamily: 'var(--font-ui)', textAlign: 'center' }}>
                  {genError}
                </p>
              )}

              {/* Download */}
              <button
                onClick={downloadPng}
                disabled={empty || !!genError}
                style={{
                  width: '100%',
                  padding: '11px 0',
                  background: empty || genError ? 'var(--bg-elevated)' : 'var(--accent)',
                  color: empty || genError ? 'var(--text-tertiary)' : '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-btn)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: empty || genError ? 'not-allowed' : 'pointer',
                  transition: 'background 120ms ease',
                }}
              >
                {isFR ? 'Télécharger PNG' : 'Download PNG'}
              </button>

              {/* Copy image */}
              <button
                onClick={copyImage}
                disabled={empty || !!genError}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  background: 'transparent',
                  color: copied ? 'var(--success, #16A34A)' : 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-btn)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  cursor: empty || genError ? 'not-allowed' : 'pointer',
                  transition: 'color 120ms ease, border-color 120ms ease',
                }}
              >
                {copied
                  ? (isFR ? 'Copié !' : 'Copied!')
                  : (isFR ? 'Copier en tant qu\'image' : 'Copy as image')}
              </button>
            </div>

            {/* Info pill */}
            <div style={{ background: 'var(--bg-subtle, var(--bg-elevated))', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '12px 14px' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)', lineHeight: 1.6, margin: 0 }}>
                {isFR
                  ? 'Tout est généré localement dans votre navigateur. Aucune donnée n\'est envoyée à nos serveurs.'
                  : 'Everything is generated locally in your browser. No data is sent to our servers.'}
              </p>
            </div>
          </div>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="qr-code-generator" />
    </>
  );
}
