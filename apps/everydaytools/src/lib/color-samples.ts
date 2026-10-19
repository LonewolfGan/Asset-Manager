export interface ColorPreset {
  id: string;
  nameFr: string;
  nameEn: string;
  hex: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'cobalt',
    nameFr: 'Cobalt Digital',
    nameEn: 'Digital Cobalt',
    hex: '#1A6BFF',
  },
  {
    id: 'emerald',
    nameFr: 'Émeraude Vif',
    nameEn: 'Vivid Emerald',
    hex: '#059669',
  },
  {
    id: 'crimson',
    nameFr: 'Pourpre Écarlate',
    nameEn: 'Scarlet Crimson',
    hex: '#DC2626',
  },
  {
    id: 'amber',
    nameFr: 'Ambre Doré',
    nameEn: 'Golden Amber',
    hex: '#D97706',
  },
  {
    id: 'violet',
    nameFr: 'Violet Profond',
    nameEn: 'Deep Violet',
    hex: '#7C3AED',
  },
  {
    id: 'slate',
    nameFr: 'Ardoise Graphique',
    nameEn: 'Graphic Slate',
    hex: '#475569',
  },
  {
    id: 'cyan',
    nameFr: 'Cyan Électrique',
    nameEn: 'Electric Cyan',
    hex: '#06B6D4',
  },
  {
    id: 'rose',
    nameFr: 'Rose Corail',
    nameEn: 'Coral Rose',
    hex: '#F43F5E',
  },
];
