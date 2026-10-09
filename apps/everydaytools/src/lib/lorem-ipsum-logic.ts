/**
 * Advanced Lorem Ipsum & Placeholder Text Engine
 */

export type LoremFlavor = 'classic' | 'tech' | 'culinary' | 'business';
export type LoremUnit = 'paragraphs' | 'sentences' | 'words' | 'lists';

export const VOCABULARY: Record<LoremFlavor, string[]> = {
  classic: [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
    'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
    'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
    'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim',
    'id', 'est', 'laborum'
  ],
  tech: [
    'blockchain', 'kubernetes', 'microservices', 'cloud-native', 'serverless', 'agile', 'docker',
    'scalable', 'latency', 'bandwidth', 'encryption', 'zero-trust', 'neural-network', 'pipeline',
    'continuous-deployment', 'fullstack', 'react', 'typescript', 'architecture', 'database',
    'nosql', 'graphql', 'rest-api', 'open-source', 'framework', 'asynchronous', 'optimization',
    'distributed', 'cluster', 'cache', 'observability', 'telemetry', 'containerization', 'devops'
  ],
  culinary: [
    'croissant', 'baguette', 'bistrot', 'fromage', 'terroir', 'degustation', 'bouillon', 'veloute',
    'epice', 'vanille', 'chocolat', 'patisserie', 'marmite', 'fondant', 'caramel', 'brioche',
    'saveur', 'gourmand', 'arome', 'sommelier', 'millesime', 'cepage', 'effervescent', 'truffe',
    'reduction', 'emulsion', 'grille', 'vinaigrette', 'pistache', 'fines-herbes', 'croustillant'
  ],
  business: [
    'synergie', 'strategie', 'roadmap', 'livrables', 'alignement', 'ecosysteme', 'actionnable',
    'croissance', 'indicateurs', 'rentabilite', 'proposition', 'innovation', 'optimisation',
    'scalabilite', 'benchmark', 'disruptif', 'actionnaires', 'agilite', 'gouvernance', 'capitalisation',
    'perennite', 'pilotage', 'vecteur', 'transformation', 'catalyseur', 'performances', 'levier'
  ]
};

export function getRandomWord(flavor: LoremFlavor): string {
  const words = VOCABULARY[flavor] ?? VOCABULARY.classic;
  return words[Math.floor(Math.random() * words.length)];
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateSentence(flavor: LoremFlavor, targetWordCount = 10): string {
  const len = Math.max(5, targetWordCount + Math.floor(Math.random() * 6) - 3);
  const words = Array.from({ length: len }, () => getRandomWord(flavor));
  return capitalize(words.join(' ')) + '.';
}

export function generateParagraph(flavor: LoremFlavor, sentenceCount = 4): string {
  return Array.from({ length: sentenceCount }, () => generateSentence(flavor)).join(' ');
}

export interface LoremOptions {
  flavor?: LoremFlavor;
  unit?: LoremUnit;
  count?: number;
  startWithClassic?: boolean;
  wrapWithHtml?: boolean;
  format?: 'plain' | 'html' | 'markdown' | 'json';
}

export const CLASSIC_OPENING = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

/**
 * Returns raw individual blocks (paragraphs, sentences, list items, or word chunks)
 * for flexible UI rendering and per-block operations.
 */
export function generateLoremBlocks(options: LoremOptions = {}): string[] {
  const {
    flavor = 'classic',
    unit = 'paragraphs',
    count = 3,
    startWithClassic = true,
  } = options;

  const validCount = Math.max(1, Math.min(100, count));

  switch (unit) {
    case 'paragraphs': {
      return Array.from({ length: validCount }, (_, i) => {
        if (i === 0 && startWithClassic && flavor === 'classic') {
          return `${CLASSIC_OPENING} ${Array.from({ length: 3 }, () => generateSentence(flavor)).join(' ')}`;
        }
        return generateParagraph(flavor, 4);
      });
    }

    case 'sentences': {
      return Array.from({ length: validCount }, (_, i) => {
        if (i === 0 && startWithClassic && flavor === 'classic') {
          return CLASSIC_OPENING;
        }
        return generateSentence(flavor);
      });
    }

    case 'words': {
      let words: string[] = [];
      if (startWithClassic && flavor === 'classic') {
        const base = 'Lorem ipsum dolor sit amet consectetur adipiscing elit'.split(' ');
        words = [...base];
      }
      while (words.length < validCount) {
        words.push(getRandomWord(flavor));
      }
      words = words.slice(0, validCount);
      return [capitalize(words.join(' '))];
    }

    case 'lists': {
      return Array.from({ length: validCount }, () => {
        return capitalize(`${getRandomWord(flavor)} ${getRandomWord(flavor)} ${getRandomWord(flavor)}`);
      });
    }
  }
}

/**
 * Generates formatted Lorem Ipsum text based on format options.
 */
export function generateLoremText(options: LoremOptions = {}): string {
  const {
    unit = 'paragraphs',
    wrapWithHtml = false,
    format = wrapWithHtml ? 'html' : 'plain',
  } = options;

  const blocks = generateLoremBlocks(options);

  if (format === 'json') {
    return JSON.stringify(blocks, null, 2);
  }

  if (format === 'html' || wrapWithHtml) {
    switch (unit) {
      case 'paragraphs':
        return blocks.map((p) => `<p>${p}</p>`).join('\n\n');
      case 'sentences':
        return blocks.map((s) => `<p>${s}</p>`).join('\n');
      case 'words':
        return `<span>${blocks[0] ?? ''}</span>`;
      case 'lists':
        return `<ul>\n${blocks.map((item) => `  <li>${item}</li>`).join('\n')}\n</ul>`;
    }
  }

  if (format === 'markdown') {
    switch (unit) {
      case 'paragraphs':
        return blocks.join('\n\n');
      case 'sentences':
        return blocks.join('\n\n');
      case 'words':
        return blocks[0] ?? '';
      case 'lists':
        return blocks.map((item) => `- ${item}`).join('\n');
    }
  }

  // Plain text
  switch (unit) {
    case 'paragraphs':
      return blocks.join('\n\n');
    case 'sentences':
      return blocks.join(' ');
    case 'words':
      return blocks[0] ?? '';
    case 'lists':
      return blocks.map((item) => `• ${item}`).join('\n');
  }
}

export interface LoremUnitConfig {
  id: LoremUnit;
  labelFr: string;
  labelEn: string;
  max: number;
}

export const UNITS: LoremUnitConfig[] = [
  { id: 'paragraphs', labelFr: 'Paragraphes', labelEn: 'Paragraphs', max: 20 },
  { id: 'sentences', labelFr: 'Phrases', labelEn: 'Sentences', max: 30 },
  { id: 'words', labelFr: 'Mots', labelEn: 'Words', max: 300 },
  { id: 'lists', labelFr: 'Listes', labelEn: 'Lists', max: 20 },
];

export const PRESETS: Record<LoremUnit, number[]> = {
  paragraphs: [1, 2, 3, 5, 8],
  sentences: [1, 2, 3, 5, 8],
  words: [20, 50, 100, 200],
  lists: [3, 5, 8, 12],
};

export interface LoremFlavorConfig {
  id: LoremFlavor;
  labelFr: string;
  labelEn: string;
  descFr: string;
  descEn: string;
}

export const FLAVORS: LoremFlavorConfig[] = [
  {
    id: 'classic',
    labelFr: 'Latin classique',
    labelEn: 'Classic Latin',
    descFr: 'Cicéron · De Finibus',
    descEn: 'Cicero · De Finibus',
  },
  {
    id: 'tech',
    labelFr: 'Tech & Cloud',
    labelEn: 'Tech & Cloud',
    descFr: 'DevOps, Containers, APIs',
    descEn: 'DevOps, Containers, APIs',
  },
  {
    id: 'culinary',
    labelFr: 'Gastronomie',
    labelEn: 'Gastronomy',
    descFr: 'Saveurs & Terroir',
    descEn: 'Flavors & Gourmet',
  },
  {
    id: 'business',
    labelFr: 'Business & Startup',
    labelEn: 'Business & Startup',
    descFr: 'Stratégie & KPIs',
    descEn: 'Strategy & KPIs',
  },
];

export function clampLoremCount(count: number, unit: LoremUnit): number {
  const max = UNITS.find((u) => u.id === unit)?.max ?? 50;
  return Math.max(1, Math.min(max, count));
}

export function calculateLoremStats(fullText: string): { words: number; chars: number } {
  const cleanText = fullText.replace(/^[•\-]\s*/gm, '');
  const words = cleanText.trim() ? cleanText.trim().split(/\s+/).length : 0;
  const chars = cleanText.length;
  return { words, chars };
}

