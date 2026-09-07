import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { KeyRound, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function JwtDecoder() {
  const { t } = useLocale();
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIEpvbmVzIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODk5OTk5OTk5fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');

  let headerObj: any = null;
  let payloadObj: any = null;
  let isExpired = false;
  let expDate: Date | null = null;
  let iatDate: Date | null = null;
  let parseError = '';

  try {
    const parts = token.trim().split('.');
    if (parts.length >= 2) {
      headerObj = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      payloadObj = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      if (payloadObj.exp) {
        expDate = new Date(payloadObj.exp * 1000);
        isExpired = expDate.getTime() < Date.now();
      }
      if (payloadObj.iat) {
        iatDate = new Date(payloadObj.iat * 1000);
      }
    } else {
      parseError = 'Invalid JWT structure (must contain at least 2 dot-separated parts)';
    }
  } catch (e) {
    parseError = 'Failed to decode base64 payload';
  }

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'JWT Token Decoder']} />
        <PageTitle>JWT (JSON Web Token) Decoder</PageTitle>
        <PageSubtitle>Inspect and decode JWT headers, payload claims, and expiration timestamps securely in your browser without transmitting your token.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Encoded JWT Token</label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 10, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
          />
        </div>

        {parseError ? (
          <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', marginBottom: 16 }}>
            {parseError}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#ef4444', marginBottom: 8 }}>Header (Algorithm & Type)</p>
              <pre style={{ margin: 0, padding: 12, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', overflowX: 'auto' }}>
                {JSON.stringify(headerObj, null, 2)}
              </pre>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#8b5cf6', margin: 0 }}>Payload (Claims & Data)</p>
                {expDate && (
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: isExpired ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {isExpired ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
                    {isExpired ? 'Expired' : 'Active'}
                  </span>
                )}
              </div>
              <pre style={{ margin: 0, padding: 12, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', overflowX: 'auto' }}>
                {JSON.stringify(payloadObj, null, 2)}
              </pre>

              {expDate && (
                <div style={{ marginTop: 12, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  <p style={{ margin: '2px 0' }}>Expires: <strong style={{ color: 'var(--text-primary)' }}>{expDate.toUTCString()}</strong></p>
                  {iatDate && <p style={{ margin: '2px 0' }}>Issued At: <strong style={{ color: 'var(--text-primary)' }}>{iatDate.toUTCString()}</strong></p>}
                </div>
              )}
            </div>
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="jwt-decoder" />
    </>
  );
}
