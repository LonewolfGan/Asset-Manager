export interface FilterSettings {
  brightness: number; // 100 = default, range 0 - 200 (%)
  contrast: number;   // 100 = default, range 0 - 200 (%)
  saturation: number; // 100 = default, range 0 - 200 (%)
  sepia: number;      // 0 = default, range 0 - 100 (%)
  grayscale: number;  // 0 = default, range 0 - 100 (%)
  invert: number;     // 0 = default, range 0 - 100 (%)
  hueRotate: number;  // 0 = default, range 0 - 360 (deg)
  blur: number;       // 0 = default, range 0 - 20 (px)
}

export const DEFAULT_FILTER_SETTINGS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sepia: 0,
  grayscale: 0,
  invert: 0,
  hueRotate: 0,
  blur: 0,
};

export interface AestheticPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<FilterSettings>;
}

export const AESTHETIC_PRESETS: AestheticPreset[] = [
  {
    id: 'original',
    name: 'Original',
    description: 'Rendu brut sans retouche',
    settings: { ...DEFAULT_FILTER_SETTINGS },
  },
  {
    id: 'portra-400',
    name: 'Portra 400',
    description: 'Teintes chair naturelles et rendu cinéma doux',
    settings: { brightness: 104, contrast: 108, saturation: 95, sepia: 12 },
  },
  {
    id: 'portra-160',
    name: 'Portra 160',
    description: 'Grain très fin et contraste pastel subtil',
    settings: { brightness: 106, contrast: 102, saturation: 90, sepia: 8 },
  },
  {
    id: 'kodak-ektar',
    name: 'Kodak Ektar 100',
    description: 'Couleurs saturées et contrastes éclatants',
    settings: { brightness: 102, contrast: 122, saturation: 138, hueRotate: 5 },
  },
  {
    id: 'kodak-gold',
    name: 'Kodak Gold 200',
    description: 'Tons chauds dorés de vacances d’été',
    settings: { brightness: 106, contrast: 112, saturation: 120, sepia: 22, hueRotate: 355 },
  },
  {
    id: 'fuji-velvia',
    name: 'Fuji Velvia 50',
    description: 'Verts et bleus profonds pour paysages',
    settings: { brightness: 98, contrast: 128, saturation: 140, hueRotate: 15 },
  },
  {
    id: 'fuji-provia',
    name: 'Fuji Provia 100F',
    description: 'Rendu diapositive neutre et haute fidélité',
    settings: { brightness: 101, contrast: 114, saturation: 106, hueRotate: 2 },
  },
  {
    id: 'fuji-superia',
    name: 'Fuji Superia 400',
    description: 'Ambiance rue avec légère dominante fraîche',
    settings: { brightness: 103, contrast: 116, saturation: 112, hueRotate: 20 },
  },
  {
    id: 'polaroid-600',
    name: 'Polaroid 600',
    description: 'Patine instantanée avec noirs délavés',
    settings: { brightness: 108, contrast: 96, saturation: 84, sepia: 28, hueRotate: 350 },
  },
  {
    id: 'vintage-70',
    name: 'Vintage 70s',
    description: 'Tons chauds et patine sépia rétro',
    settings: { brightness: 105, contrast: 110, saturation: 85, sepia: 45, hueRotate: 350 },
  },
  {
    id: 'vintage-80',
    name: 'Vintage 80s VHS',
    description: 'Couleurs décalées et saturation pop rétro',
    settings: { brightness: 106, contrast: 124, saturation: 135, hueRotate: 190 },
  },
  {
    id: 'cinema-moody',
    name: 'Cinéma Moody',
    description: 'Ambiance sombre avec noirs mats adoucis',
    settings: { brightness: 90, contrast: 125, saturation: 80, sepia: 15 },
  },
  {
    id: 'golden-hour',
    name: 'Heure Dorée',
    description: 'Lumière chaleureuse de fin de journée',
    settings: { brightness: 108, contrast: 105, saturation: 125, sepia: 25 },
  },
  {
    id: 'blue-hour',
    name: 'Heure Bleue',
    description: 'Lumière crépusculaire froide et mystérieuse',
    settings: { brightness: 95, contrast: 115, saturation: 110, hueRotate: 215 },
  },
  {
    id: 'twilight',
    name: 'Crépuscule Ambré',
    description: 'Ombres pourpres et lumière rasante',
    settings: { brightness: 102, contrast: 115, saturation: 125, sepia: 30, hueRotate: 340 },
  },
  {
    id: 'nordic-cold',
    name: 'Nordique Glacé',
    description: 'Lumière froide et clarté scandinave',
    settings: { brightness: 106, contrast: 108, saturation: 78, hueRotate: 200 },
  },
  {
    id: 'emerald-forest',
    name: 'Forêt Émeraude',
    description: 'Tons organiques et verts profonds',
    settings: { brightness: 98, contrast: 112, saturation: 115, hueRotate: 30 },
  },
  {
    id: 'sahara-warmth',
    name: 'Sahara Chaud',
    description: 'Teintes ocre et chaleur désertique',
    settings: { brightness: 107, contrast: 104, saturation: 118, sepia: 35, hueRotate: 355 },
  },
  {
    id: 'pacific-coast',
    name: 'Côte Pacifique',
    description: 'Lumière éclatante et brise côtière',
    settings: { brightness: 108, contrast: 110, saturation: 116, hueRotate: 185 },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Néon',
    description: 'Couleurs électriques et ambiance futuriste',
    settings: { contrast: 130, saturation: 150, hueRotate: 180, brightness: 105 },
  },
  {
    id: 'soft-dream',
    name: 'Rêve Vaporeux',
    description: 'Douceur poétique et légèreté lumineuse',
    settings: { brightness: 115, contrast: 90, saturation: 110, blur: 1.5 },
  },
  {
    id: 'bw-dramatic',
    name: 'Noir & Blanc Intense',
    description: 'Monochrome contrasté pour portraits et architecture',
    settings: { grayscale: 100, contrast: 140, brightness: 105 },
  },
  {
    id: 'tri-x',
    name: 'Argentique Tri-X 400',
    description: 'Monochrome dense et contrastes argentiques',
    settings: { grayscale: 100, contrast: 155, brightness: 98 },
  },
  {
    id: 'ilford-hp5',
    name: 'Ilford HP5 Plus',
    description: 'N&B classique avec gamme de gris équilibrée',
    settings: { grayscale: 100, contrast: 118, brightness: 102 },
  },
  {
    id: 'matte-editorial',
    name: 'Noir Mat',
    description: 'Ombres débouchées et style magazine',
    settings: { grayscale: 100, contrast: 92, brightness: 108 },
  },
  {
    id: 'warm-latte',
    name: 'Sépia Velouté',
    description: 'Chaleur douce café au lait pour intérieurs',
    settings: { brightness: 106, contrast: 98, saturation: 88, sepia: 38 },
  },
  {
    id: 'arty-pop',
    name: 'Arty Pop',
    description: 'Saturation haute et vitalité contemporaine',
    settings: { brightness: 105, contrast: 130, saturation: 165 },
  },
];

export function isDefaultFilterSettings(s: FilterSettings): boolean {
  return (
    s.brightness === DEFAULT_FILTER_SETTINGS.brightness &&
    s.contrast === DEFAULT_FILTER_SETTINGS.contrast &&
    s.saturation === DEFAULT_FILTER_SETTINGS.saturation &&
    s.sepia === DEFAULT_FILTER_SETTINGS.sepia &&
    s.grayscale === DEFAULT_FILTER_SETTINGS.grayscale &&
    s.invert === DEFAULT_FILTER_SETTINGS.invert &&
    s.hueRotate === DEFAULT_FILTER_SETTINGS.hueRotate &&
    s.blur === DEFAULT_FILTER_SETTINGS.blur
  );
}

export function buildCssFilterString(s: FilterSettings): string {
  const parts: string[] = [];
  if (s.brightness !== 100) parts.push(`brightness(${s.brightness}%)`);
  if (s.contrast !== 100) parts.push(`contrast(${s.contrast}%)`);
  if (s.saturation !== 100) parts.push(`saturate(${s.saturation}%)`);
  if (s.sepia > 0) parts.push(`sepia(${s.sepia}%)`);
  if (s.grayscale > 0) parts.push(`grayscale(${s.grayscale}%)`);
  if (s.invert > 0) parts.push(`invert(${s.invert}%)`);
  if (s.hueRotate > 0) parts.push(`hue-rotate(${s.hueRotate}deg)`);
  if (s.blur > 0) parts.push(`blur(${s.blur}px)`);

  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function getFilteredFilename(
  originalName: string,
  presetId: string | null,
  formatExt: string
): string {
  const base = originalName.replace(/\.[^.]+$/, '');
  const suffix = presetId && presetId !== 'original' ? `_${presetId}` : '_filtered';
  return `${base}${suffix}.${formatExt}`;
}

export async function renderFilteredBlob(
  file: File,
  settings: FilterSettings,
  mimeType: 'image/png' | 'image/jpeg' | 'image/webp',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context non disponible'));
        return;
      }
      ctx.filter = buildCssFilterString(settings);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Échec de la génération du blob image'));
            return;
          }
          resolve(blob);
        },
        mimeType,
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Impossible de charger l’image source'));
    };
    img.src = url;
  });
}
