export interface FaviconSizeInfo {
  size: number;
  label: string;
  category: 'browser' | 'apple' | 'android' | 'desktop';
  purpose: string;
}

export const FAVICON_SIZES: FaviconSizeInfo[] = [
  { size: 16, label: '16 × 16', category: 'browser', purpose: 'Onglet classique de navigateur' },
  { size: 32, label: '32 × 32', category: 'browser', purpose: 'Écrans Retina & favoris' },
  { size: 48, label: '48 × 48', category: 'desktop', purpose: 'Barre des tâches & bureau Windows' },
  { size: 64, label: '64 × 64', category: 'desktop', purpose: 'Raccourcis haute résolution' },
  { size: 128, label: '128 × 128', category: 'browser', purpose: 'Chrome Web Store' },
  { size: 180, label: '180 × 180', category: 'apple', purpose: 'Apple Touch Icon (iPhone & iPad)' },
  { size: 192, label: '192 × 192', category: 'android', purpose: 'Écran d’accueil Android PWA' },
  { size: 512, label: '512 × 512', category: 'android', purpose: 'Splash screen PWA & haute définition' },
];

export type IconShape = 'square' | 'rounded' | 'squircle' | 'circle';

export interface ShapeOption {
  id: IconShape;
  labelFr: string;
  labelEn: string;
}

export const SHAPE_OPTIONS: ShapeOption[] = [
  { id: 'square', labelFr: 'Carré brut', labelEn: 'Raw Square' },
  { id: 'rounded', labelFr: 'Arrondi doux', labelEn: 'Soft Rounded' },
  { id: 'squircle', labelFr: 'Squircle iOS', labelEn: 'iOS Squircle' },
  { id: 'circle', labelFr: 'Cercle Android', labelEn: 'Android Circle' },
];

export interface BackgroundPreset {
  id: string;
  labelFr: string;
  labelEn: string;
  value: string;
}

export const BG_PRESETS: BackgroundPreset[] = [
  { id: 'transparent', labelFr: 'Transparent', labelEn: 'Transparent', value: 'transparent' },
  { id: 'white', labelFr: 'Blanc', labelEn: 'White', value: '#FFFFFF' },
  { id: 'dark', labelFr: 'Noir Zinc', labelEn: 'Zinc Dark', value: '#18181B' },
  { id: 'orange', labelFr: 'Studio Orange', labelEn: 'Studio Orange', value: '#FF6B35' },
];

export interface FaviconAsset {
  filename: string;
  size: number;
  label: string;
  targetFr: string;
  targetEn: string;
  isIco?: boolean;
}

export const FAVICON_ASSETS: FaviconAsset[] = [
  { filename: 'favicon.ico', size: 32, label: 'favicon.ico', targetFr: 'Multi-résolution (16, 32, 48 px)', targetEn: 'Multi-resolution (16, 32, 48 px)', isIco: true },
  { filename: 'favicon-16x16.png', size: 16, label: 'favicon-16x16.png', targetFr: 'Onglet navigateur standard', targetEn: 'Standard browser tab' },
  { filename: 'favicon-32x32.png', size: 32, label: 'favicon-32x32.png', targetFr: 'Écran Retina & signets', targetEn: 'Retina display & bookmarks' },
  { filename: 'favicon-48x48.png', size: 48, label: 'favicon-48x48.png', targetFr: 'Raccourcis bureau Windows', targetEn: 'Windows desktop shortcut' },
  { filename: 'favicon-64x64.png', size: 64, label: 'favicon-64x64.png', targetFr: 'Affichage haute définition', targetEn: 'High-definition display' },
  { filename: 'favicon-128x128.png', size: 128, label: 'favicon-128x128.png', targetFr: 'Chrome Web Store', targetEn: 'Chrome Web Store' },
  { filename: 'apple-touch-icon.png', size: 180, label: 'apple-touch-icon.png', targetFr: 'Apple iOS & iPadOS (180×180)', targetEn: 'Apple iOS & iPadOS (180×180)' },
  { filename: 'android-chrome-192x192.png', size: 192, label: 'android-chrome-192.png', targetFr: 'Android PWA (192×192)', targetEn: 'Android PWA (192×192)' },
  { filename: 'android-chrome-512x512.png', size: 512, label: 'android-chrome-512.png', targetFr: 'PWA Splash Screen (512×512)', targetEn: 'PWA Splash Screen (512×512)' },
];

export function generateHtmlSnippet(bgColor: string = '#ffffff', isFr: boolean = true): string {
  const themeColor = bgColor !== 'transparent' ? bgColor : '#ffffff';
  return `<!-- ${isFr ? 'Favicon classique & multi-résolution' : 'Classic & multi-resolution favicon'} -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">

<!-- ${isFr ? 'Apple Touch Icon (iOS Safari & iPadOS)' : 'Apple Touch Icon (iOS Safari & iPadOS)'} -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- ${isFr ? 'Manifeste pour Android & Progressive Web Apps' : 'Web App Manifest for Android & PWA'} -->
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${themeColor}">`;
}

export function generateWebManifestSnippet(
  bgColor: string = '#ffffff',
  isFr: boolean = true,
  appName?: string
): string {
  const resolvedAppName = appName ?? (isFr ? 'Mon Application' : 'My Application');
  const themeColor = bgColor !== 'transparent' ? bgColor : '#ffffff';
  return JSON.stringify(
    {
      name: resolvedAppName,
      short_name: isFr ? 'App' : 'App',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      theme_color: themeColor,
      background_color: themeColor,
      display: 'standalone',
    },
    null,
    2
  );
}

export function generateNextJsSnippet(): string {
  return `// app/layout.tsx (Next.js App Router Metadata)
export const metadata = {
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};`;
}

export function buildClientIco(images: Array<{ size: number; bytes: Uint8Array }>): Blob {
  const count = images.length;
  const headerSize = 6;
  const dirSize = 16 * count;
  const totalImgSize = images.reduce((acc, img) => acc + img.bytes.length, 0);
  const buffer = new ArrayBuffer(headerSize + dirSize + totalImgSize);
  const view = new DataView(buffer);
  const u8 = new Uint8Array(buffer);

  // 1. Header (6 bytes): Reserved = 0, Type = 1 (ICO), Image count
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, count, true);

  // 2. Directory entries & raw PNG byte stream
  let dataOffset = headerSize + dirSize;
  for (let i = 0; i < count; i++) {
    const img = images[i];
    const entryOffset = headerSize + i * 16;
    const len = img.bytes.length;

    view.setUint8(entryOffset, img.size >= 256 ? 0 : img.size);
    view.setUint8(entryOffset + 1, img.size >= 256 ? 0 : img.size);
    view.setUint8(entryOffset + 2, 0);
    view.setUint8(entryOffset + 3, 0);
    view.setUint16(entryOffset + 4, 1, true);
    view.setUint16(entryOffset + 6, 32, true);
    view.setUint32(entryOffset + 8, len, true);
    view.setUint32(entryOffset + 12, dataOffset, true);

    u8.set(img.bytes, dataOffset);
    dataOffset += len;
  }

  return new Blob([buffer], { type: 'image/x-icon' });
}
