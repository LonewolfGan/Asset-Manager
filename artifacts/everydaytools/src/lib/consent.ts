const STORAGE_KEY = 'et_consent';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export interface ConsentChoices {
  analytics: boolean;
  ads: boolean;
  ts: number;
}

export function getConsent(): ConsentChoices | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentChoices;
    if (Date.now() - parsed.ts > ONE_YEAR_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setConsent(analytics: boolean, ads: boolean): void {
  const choices: ConsentChoices = { analytics, ads, ts: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(choices));
  window.dispatchEvent(new CustomEvent<ConsentChoices>('et:consent', { detail: choices }));
  if (ads) loadAdSense();
}

export function hasConsent(): boolean {
  return getConsent() !== null;
}

export function resetConsent(): void {
  localStorage.removeItem(STORAGE_KEY);
}

const ADSENSE_CLIENT = (import.meta.env.VITE_ADSENSE_PUBLISHER_ID as string | undefined) ?? '';

export function getAdSenseClient(): string {
  return ADSENSE_CLIENT;
}

export function loadAdSense(): void {
  if (!ADSENSE_CLIENT || document.getElementById('adsense-js')) return;
  const s = document.createElement('script');
  s.id = 'adsense-js';
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  s.setAttribute('crossorigin', 'anonymous');
  document.head.appendChild(s);
}
