import React from 'react';
import { Link2, Eye, EyeOff } from 'lucide-react';
import { CodeWorkspace } from '@/components/ui/code-workspace';
import { ActionTooltip } from '@/components/ui/tooltip';
import { InputMode, WifiEnc } from '@/lib/qr-code-logic';

export interface QrInputFormsProps {
  mode: InputMode;
  isFr: boolean;
  tq: any;
  url: string;
  setUrl: (v: string) => void;
  rawText: string;
  setRawText: (v: string) => void;
  wifiSsid: string;
  setWifiSsid: (v: string) => void;
  wifiPass: string;
  setWifiPass: (v: string) => void;
  wifiEnc: WifiEnc;
  setWifiEnc: (v: WifiEnc) => void;
  showWifiPass: boolean;
  setShowWifiPass: (v: boolean) => void;
  vcardName: string;
  setVcardName: (v: string) => void;
  vcardOrg: string;
  setVcardOrg: (v: string) => void;
  vcardPhone: string;
  setVcardPhone: (v: string) => void;
  vcardEmail: string;
  setVcardEmail: (v: string) => void;
  vcardUrl: string;
  setVcardUrl: (v: string) => void;
}

export function QrInputForms({
  mode,
  isFr,
  tq,
  url,
  setUrl,
  rawText,
  setRawText,
  wifiSsid,
  setWifiSsid,
  wifiPass,
  setWifiPass,
  wifiEnc,
  setWifiEnc,
  showWifiPass,
  setShowWifiPass,
  vcardName,
  setVcardName,
  vcardOrg,
  setVcardOrg,
  vcardPhone,
  setVcardPhone,
  vcardEmail,
  setVcardEmail,
  vcardUrl,
  setVcardUrl,
}: QrInputFormsProps) {
  return (
    <div className="flex flex-col gap-3 pb-7 border-b border-zinc-200/70 dark:border-white/10">
      <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
        {isFr ? 'Données source' : 'Data Payload'}
      </span>

      {mode === 'url' && (
        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-zinc-400">
            <Link2 className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="h-11 w-full pl-10 pr-4 rounded-xl font-mono text-sm bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
          />
        </div>
      )}

      {mode === 'text' && (
        <div className="flex flex-col gap-2">
          <CodeWorkspace
            mode="input"
            value={rawText}
            onChange={setRawText}
            format="txt"
            formatLabel={isFr ? 'Texte' : 'Text'}
            placeholder={isFr ? 'Saisissez votre texte ou message...' : 'Enter your text or payload...'}
            minHeight="140px"
            maxHeight="260px"
          />
        </div>
      )}

      {mode === 'wifi' && (
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {tq.wifiSsid}
            </span>
            <input
              type="text"
              value={wifiSsid}
              onChange={(e) => setWifiSsid(e.target.value)}
              placeholder="Network_Name"
              className="h-11 w-full px-4 rounded-xl font-mono text-sm bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {tq.wifiPass}
            </span>
            <div className="relative flex items-center">
              <input
                type={showWifiPass ? 'text' : 'password'}
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full pl-4 pr-11 rounded-xl font-mono text-sm bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
              />
              <ActionTooltip label={showWifiPass ? (isFr ? 'Masquer' : 'Hide') : (isFr ? 'Afficher' : 'Show')} side="top">
                <button
                  type="button"
                  onClick={() => setShowWifiPass(!showWifiPass)}
                  className="absolute right-3 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                >
                  {showWifiPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </ActionTooltip>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {tq.encryption}
            </span>
            <div className="grid grid-cols-3 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-white/10">
              {(['WPA', 'WEP', 'nopass'] as WifiEnc[]).map((enc) => (
                <button
                  key={enc}
                  type="button"
                  onClick={() => setWifiEnc(enc)}
                  className={`py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    wifiEnc === enc
                      ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  {enc === 'nopass' ? (isFr ? 'Aucun' : 'None') : enc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'vcard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {tq.fullName}
            </span>
            <input
              type="text"
              value={vcardName}
              onChange={(e) => setVcardName(e.target.value)}
              placeholder="Alexandre Martin"
              className="h-11 w-full px-4 rounded-xl font-mono text-sm bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {isFr ? 'Entreprise' : 'Company'}
            </span>
            <input
              type="text"
              value={vcardOrg}
              onChange={(e) => setVcardOrg(e.target.value)}
              placeholder="Studio"
              className="h-11 w-full px-4 rounded-xl font-mono text-sm bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {tq.phone}
            </span>
            <input
              type="tel"
              value={vcardPhone}
              onChange={(e) => setVcardPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="h-11 w-full px-4 rounded-xl font-mono text-sm bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {tq.email}
            </span>
            <input
              type="email"
              value={vcardEmail}
              onChange={(e) => setVcardEmail(e.target.value)}
              placeholder="contact@domain.com"
              className="h-11 w-full px-4 rounded-xl font-mono text-sm bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {isFr ? 'Site web' : 'Website'}
            </span>
            <input
              type="url"
              value={vcardUrl}
              onChange={(e) => setVcardUrl(e.target.value)}
              placeholder="https://mysite.com"
              className="h-11 w-full px-4 rounded-xl font-mono text-sm bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
}
