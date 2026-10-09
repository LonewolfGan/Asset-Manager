export interface FontOption {
  id: string;
  name: string;
  category: 'Sans-Serif' | 'Serif' | 'Monospace' | 'Display' | 'Signature';
  fontFamily: string;
  weight?: string;
  googleFont?: string;
}

export const FONT_OPTIONS: FontOption[] = [
  // Sans-Serif
  {
    id: 'inter',
    name: 'Inter',
    category: 'Sans-Serif',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weight: 'bold',
    googleFont: 'Inter:wght@600;700',
  },
  {
    id: 'system',
    name: 'System UI',
    category: 'Sans-Serif',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weight: 'bold',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'Sans-Serif',
    fontFamily: '"Montserrat", -apple-system, sans-serif',
    weight: 'bold',
    googleFont: 'Montserrat:wght@600;700',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'Sans-Serif',
    fontFamily: '"Poppins", -apple-system, sans-serif',
    weight: 'bold',
    googleFont: 'Poppins:wght@600;700',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    category: 'Sans-Serif',
    fontFamily: '"Roboto", -apple-system, sans-serif',
    weight: 'bold',
    googleFont: 'Roboto:wght@600;700',
  },

  // Serif
  {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'Serif',
    fontFamily: '"Playfair Display", Georgia, serif',
    weight: 'bold',
    googleFont: 'Playfair+Display:wght@600;700',
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    category: 'Serif',
    fontFamily: '"Merriweather", Georgia, serif',
    weight: 'bold',
    googleFont: 'Merriweather:wght@600;700',
  },
  {
    id: 'cinzel',
    name: 'Cinzel (Luxe)',
    category: 'Serif',
    fontFamily: '"Cinzel", "Times New Roman", serif',
    weight: 'bold',
    googleFont: 'Cinzel:wght@600;700',
  },
  {
    id: 'georgia',
    name: 'Georgia',
    category: 'Serif',
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
    weight: 'bold',
  },

  // Monospace
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    category: 'Monospace',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    weight: 'bold',
    googleFont: 'JetBrains+Mono:wght@600;700',
  },
  {
    id: 'sf-mono',
    name: 'SF Mono / Menlo',
    category: 'Monospace',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    weight: 'bold',
  },
  {
    id: 'courier-new',
    name: 'Courier New',
    category: 'Monospace',
    fontFamily: '"Courier New", Courier, monospace',
    weight: 'bold',
  },

  // Display
  {
    id: 'impact',
    name: 'Impact',
    category: 'Display',
    fontFamily: 'Impact, "Arial Black", -apple-system, sans-serif',
    weight: 'normal',
  },
  {
    id: 'bebas-neue',
    name: 'Bebas Neue',
    category: 'Display',
    fontFamily: '"Bebas Neue", Impact, sans-serif',
    weight: 'bold',
    googleFont: 'Bebas+Neue&display=swap',
  },
  {
    id: 'anton',
    name: 'Anton',
    category: 'Display',
    fontFamily: '"Anton", Impact, sans-serif',
    weight: 'bold',
    googleFont: 'Anton&display=swap',
  },

  // Signature / Cursive
  {
    id: 'dancing-script',
    name: 'Dancing Script',
    category: 'Signature',
    fontFamily: '"Dancing Script", cursive',
    weight: 'bold',
    googleFont: 'Dancing+Script:wght@600;700',
  },
  {
    id: 'caveat',
    name: 'Caveat',
    category: 'Signature',
    fontFamily: '"Caveat", cursive',
    weight: 'bold',
    googleFont: 'Caveat:wght@600;700',
  },
];

export function getFontCssString(fontId: string, fontSize: number): string {
  const fontOpt = FONT_OPTIONS.find((f) => f.id === fontId) || FONT_OPTIONS[0];
  const weight = fontOpt.weight || 'bold';
  return `${weight} ${fontSize}px ${fontOpt.fontFamily}`;
}
