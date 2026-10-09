export interface BarcodeSymbology {
  id: string;
  name: string;
  standard: string;
  category: string;
  desc: string;
  placeholder: string;
  sample: string;
  expectedLength?: number;
}

export function getSymbologies(isFr: boolean): BarcodeSymbology[] {
  return [
    {
      id: 'EAN13',
      name: 'EAN-13',
      standard: 'ISO/IEC 15420 · GS1',
      category: isFr ? 'Commerce' : 'Retail',
      desc: isFr
        ? 'Standard international pour la distribution et les points de vente (13 chiffres).'
        : 'International retail point-of-sale standard (13 digits).',
      placeholder: '4006381333931',
      sample: '4006381333931',
      expectedLength: 13,
    },
    {
      id: 'UPC',
      name: 'UPC-A',
      standard: 'GS1 US / ANSI MH10.8M',
      category: isFr ? 'Commerce' : 'Retail',
      desc: isFr
        ? 'Format commercial prédominant aux États-Unis et au Canada (12 chiffres).'
        : 'Predominant retail standard in the United States and Canada (12 digits).',
      placeholder: '012345678905',
      sample: '012345678905',
      expectedLength: 12,
    },
    {
      id: 'CODE128',
      name: 'Code 128',
      standard: 'ISO/IEC 15417',
      category: isFr ? 'Logistique' : 'Logistics',
      desc: isFr
        ? 'Symbologie haute densité pour colis et logistique encodant tout l’ASCII.'
        : 'High-density alphanumeric symbology encoding the full ASCII set.',
      placeholder: 'SHIP-2026-X88',
      sample: 'SHIP-2026-X88',
    },
    {
      id: 'EAN8',
      name: 'EAN-8',
      standard: 'GS1 Compact',
      category: isFr ? 'Commerce' : 'Retail',
      desc: isFr
        ? 'Version condensée pour petits emballages et étiquettes exiguës (8 chiffres).'
        : 'Compact variant for small packages and restricted label space (8 digits).',
      placeholder: '96385074',
      sample: '96385074',
      expectedLength: 8,
    },
    {
      id: 'CODE39',
      name: 'Code 39',
      standard: 'ANSI/AIM BC1',
      category: isFr ? 'Industrie' : 'Industry',
      desc: isFr
        ? 'Format industriel robuste acceptant majuscules, chiffres et symboles.'
        : 'Robust industrial format supporting uppercase letters, digits, and symbols.',
      placeholder: 'PALLET-420-A',
      sample: 'PALLET-420-A',
    },
    {
      id: 'ITF14',
      name: 'ITF-14',
      standard: 'GS1 Carton Shipping',
      category: isFr ? 'Expédition' : 'Shipping',
      desc: isFr
        ? 'Code pour cartons de groupage et conditionnement d’expédition (14 chiffres).'
        : 'Packaging and shipping container barcode (14 digits).',
      placeholder: '10012345678902',
      sample: '10012345678902',
      expectedLength: 14,
    },
    {
      id: 'pharmacode',
      name: 'Pharmacode',
      standard: 'Laetus Pharma',
      category: isFr ? 'Santé' : 'Pharma',
      desc: isFr
        ? 'Code binaire pour le conditionnement pharmaceutique (3 à 131070).'
        : 'Binary code for pharmaceutical packaging control (3 to 131070).',
      placeholder: '12345',
      sample: '12345',
    },
    {
      id: 'codabar',
      name: 'Codabar',
      standard: 'NW-7 · Monotype',
      category: isFr ? 'Spécialisé' : 'Specialized',
      desc: isFr
        ? 'Utilisé en laboratoires, banques de sang et bibliothèques.'
        : 'Used in libraries, blood banks, and laboratories.',
      placeholder: 'A12345678B',
      sample: 'A12345678B',
    },
  ];
}

export function getEanCountry(digits: string, isFr: boolean): string | null {
  if (digits.length < 3) return null;
  const p3 = parseInt(digits.slice(0, 3), 10);
  if (p3 >= 300 && p3 <= 379) return 'France';
  if (p3 >= 400 && p3 <= 440) return isFr ? 'Allemagne' : 'Germany';
  if (p3 >= 500 && p3 <= 509) return isFr ? 'Royaume-Uni' : 'United Kingdom';
  if (p3 >= 540 && p3 <= 549) return isFr ? 'Belgique / Lux.' : 'Belgium / Lux.';
  if (p3 >= 760 && p3 <= 769) return isFr ? 'Suisse' : 'Switzerland';
  if (p3 >= 800 && p3 <= 839) return isFr ? 'Italie' : 'Italy';
  if (p3 >= 840 && p3 <= 849) return isFr ? 'Espagne' : 'Spain';
  if (p3 >= 560 && p3 <= 560) return 'Portugal';
  if (p3 >= 870 && p3 <= 879) return isFr ? 'Pays-Bas' : 'Netherlands';
  if ((p3 >= 450 && p3 <= 459) || (p3 >= 490 && p3 <= 499)) return isFr ? 'Japon' : 'Japan';
  if (p3 >= 690 && p3 <= 699) return isFr ? 'Chine' : 'China';
  if (p3 >= 0 && p3 <= 139) return 'USA & Canada';
  return isFr ? 'International GS1' : 'GS1 International';
}
