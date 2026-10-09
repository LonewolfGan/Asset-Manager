export * from './watermark-fonts';
export * from './watermark-render';

import type { WatermarkConfig, NinePointPosition } from './watermark-render';

export const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  text: '© EverydayTools',
  fontSize: 48,
  color: '#ffffff',
  opacity: 75,
  mode: 'points',
  positions: ['bottom-right'],
  rotation: 0,
  fontId: 'inter',
  hasShadow: true,
};

export const WATERMARK_TEXT_PRESETS = [
  '© EverydayTools',
  '© Copyright',
  'CONFIDENTIEL',
  'ÉCHANTILLON',
  'BROUILLON',
  'NE PAS DIFFUSER',
  'SOUS EMBARGO',
];

export const COLOR_SWATCHES = [
  { hex: '#ffffff', label: 'Blanc Pur' },
  { hex: '#18181b', label: 'Noir Mat' },
  { hex: '#FF6B35', label: 'Signature Orange' },
  { hex: '#3b82f6', label: 'Bleu Cyan' },
  { hex: '#f59e0b', label: 'Or Subtil' },
  { hex: '#ef4444', label: 'Rouge Tampon' },
];

export const NINE_POINT_GRID: Array<{ id: NinePointPosition; label: string; shortcut: string }> = [
  { id: 'top-left', label: 'Haut Gauche', shortcut: '7' },
  { id: 'top-center', label: 'Haut Centre', shortcut: '8' },
  { id: 'top-right', label: 'Haut Droite', shortcut: '9' },
  { id: 'center-left', label: 'Milieu Gauche', shortcut: '4' },
  { id: 'center', label: 'Plein Centre', shortcut: '5' },
  { id: 'center-right', label: 'Milieu Droite', shortcut: '6' },
  { id: 'bottom-left', label: 'Bas Gauche', shortcut: '1' },
  { id: 'bottom-center', label: 'Bas Centre', shortcut: '2' },
  { id: 'bottom-right', label: 'Bas Droite', shortcut: '3' },
];
