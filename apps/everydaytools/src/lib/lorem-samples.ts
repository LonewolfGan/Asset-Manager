import type { LoremFlavor, LoremUnit } from './lorem-ipsum-logic';

export interface LoremPreset {
  id: string;
  labelFr: string;
  labelEn: string;
  descFr: string;
  descEn: string;
  unit: LoremUnit;
  count: number;
  flavor: LoremFlavor;
  format?: 'plain' | 'html' | 'markdown' | 'json';
}

export const LOREM_PRESETS: LoremPreset[] = [
  {
    id: 'hero-headline',
    labelFr: 'Titre & Accroche',
    labelEn: 'Hero & Tagline',
    descFr: '1 phrase concise pour en-tête',
    descEn: '1 punchy sentence for header',
    unit: 'sentences',
    count: 1,
    flavor: 'classic',
    format: 'plain',
  },
  {
    id: 'ui-card',
    labelFr: 'Carte UI / Résumé',
    labelEn: 'UI Card / Summary',
    descFr: '1 paragraphe court de description',
    descEn: '1 short descriptive paragraph',
    unit: 'paragraphs',
    count: 1,
    flavor: 'classic',
    format: 'plain',
  },
  {
    id: 'article-draft',
    labelFr: 'Article de blog',
    labelEn: 'Blog Post Draft',
    descFr: '3 paragraphes complets de lecture',
    descEn: '3 full paragraphs of reading copy',
    unit: 'paragraphs',
    count: 3,
    flavor: 'classic',
    format: 'plain',
  },
  {
    id: 'tech-features',
    labelFr: 'Fonctionnalités Tech',
    labelEn: 'Tech Features',
    descFr: '5 puces de vocabulaire Cloud/DevOps',
    descEn: '5 bullet items with Cloud/DevOps terms',
    unit: 'lists',
    count: 5,
    flavor: 'tech',
    format: 'plain',
  },
  {
    id: 'word-batch',
    labelFr: 'Lot de 50 mots',
    labelEn: '50-word batch',
    descFr: 'Flux dense de mots pour typographie',
    descEn: 'Dense word stream for typography tests',
    unit: 'words',
    count: 50,
    flavor: 'classic',
    format: 'plain',
  },
  {
    id: 'business-strategy',
    labelFr: 'Pitch Startup',
    labelEn: 'Startup Pitch',
    descFr: '3 phrases orientées business & KPIs',
    descEn: '3 sentences with strategy & KPIs',
    unit: 'sentences',
    count: 3,
    flavor: 'business',
    format: 'plain',
  },
];
