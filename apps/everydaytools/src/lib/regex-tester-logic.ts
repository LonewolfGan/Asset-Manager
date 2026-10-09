export interface MatchGroup {
  index: number;
  name?: string;
  value: string;
}

export interface MatchResult {
  index: number;
  length: number;
  value: string;
  groups: MatchGroup[];
}

export interface RegexPreset {
  name: string;
  pattern: string;
  flags: string;
  description: string;
  sample: string;
}

export interface CheatSheetItem {
  token: string;
  desc: string;
  example: string;
}

export interface CheatSheetCategory {
  title: string;
  items: CheatSheetItem[];
}

export type ResultTab = 'matches' | 'replace' | 'cheatsheet';
export type MatchDisplayMode = 'highlight' | 'list';

export interface TextChunk {
  text: string;
  isMatch: boolean;
  matchIndex?: number;
}

export interface RegexEvaluation {
  matches: MatchResult[];
  isValid: boolean;
  errorMsg: string;
  replacedText: string;
}

export const getPresets = (isFr: boolean): RegexPreset[] => [
  {
    name: isFr ? 'Adresse e-mail' : 'Email address',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'g',
    description: isFr ? 'Détecte les adresses e-mail standard' : 'Matches standard email addresses',
    sample: isFr
      ? 'Contactez support@example.com ou sales.team@enterprise.org pour toute question.\nÉgalement joignable via contact_2026@sub.domain.co.uk.'
      : 'Contact support@example.com or sales.team@enterprise.org for questions.\nAlso reachable via contact_2026@sub.domain.co.uk.',
  },
  {
    name: isFr ? 'Lien Web (URL)' : 'Web URL',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
    flags: 'g',
    description: isFr ? 'Détecte les liens HTTP et HTTPS complets' : 'Matches full HTTP and HTTPS URLs',
    sample: isFr
      ? 'Visitez https://everydaytools.dev/regex-tester pour tester vos expressions régulières.\nDocumentation : https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Regular_Expressions.'
      : 'Visit https://everydaytools.dev/regex-tester to test your regular expressions.\nDocumentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions.',
  },
  {
    name: isFr ? 'Adresse IPv4' : 'IPv4 Address',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'g',
    description: isFr ? 'Adresses IP v4 valides de 0.0.0.0 à 255.255.255.255' : 'Valid IPv4 addresses from 0.0.0.0 to 255.255.255.255',
    sample: isFr
      ? 'Passerelle locale : 192.168.1.1\nServeur DNS primaire : 8.8.8.8\nServeur DNS secondaire : 1.1.1.1'
      : 'Local gateway: 192.168.1.1\nPrimary DNS server: 8.8.8.8\nSecondary DNS server: 1.1.1.1',
  },
  {
    name: isFr ? 'Date (AAAA-MM-JJ)' : 'Date (YYYY-MM-DD)',
    pattern: '\\b(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\b',
    flags: 'g',
    description: isFr ? 'Dates au format ISO standard avec années, mois et jours' : 'ISO standard dates with years, months, and days',
    sample: isFr
      ? 'Début du projet : 2026-01-15\nDernière révision : 2026-09-24\nProchaine étape : 2026-12-31'
      : 'Project start: 2026-01-15\nLast revision: 2026-09-24\nNext milestone: 2026-12-31',
  },
  {
    name: isFr ? 'Identifiant UUID (v4)' : 'UUID Identifier (v4)',
    pattern: '\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\b',
    flags: 'g',
    description: isFr ? 'Identifiants uniques au format 8-4-4-4-12' : 'Unique identifiers in 8-4-4-4-12 format',
    sample: isFr
      ? 'Session active : 4b3d8819-7e4a-4467-b586-cfdf7d27e9e8\nID utilisateur : c9bf9e57-1685-4c89-bafb-ff5af830be8a'
      : 'Active session: 4b3d8819-7e4a-4467-b586-cfdf7d27e9e8\nUser ID: c9bf9e57-1685-4c89-bafb-ff5af830be8a',
  },
  {
    name: isFr ? 'Code couleur Hexadécimal' : 'Hex Color Code',
    pattern: '#(?:[0-9a-fA-F]{3,4}){1,2}\\b',
    flags: 'g',
    description: isFr ? 'Couleurs CSS au format hexadécimal (#RGB, #RRGGBB)' : 'CSS hex color codes (#RGB, #RRGGBB)',
    sample: isFr
      ? "Couleur d'accent : #FF6B35\nFond sombre : #09090b\nBordure neutre : #e4e4e7"
      : 'Accent color: #FF6B35\nDark background: #09090b\nNeutral border: #e4e4e7',
  },
  {
    name: isFr ? 'Numéro de téléphone international' : 'International Phone Number',
    pattern: '\\+?[0-9]{1,4}?[-.\\s]?\\(?[0-9]{1,3}?\\)?[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,9}',
    flags: 'g',
    description: isFr ? 'Numéros avec indicatif pays (+33, +1...)' : 'Phone numbers with country code (+1, +33...)',
    sample: isFr
      ? 'Standard France : +33 1 42 68 55 00\nSupport : +1 (555) 234-5678'
      : 'Standard line: +1 (555) 234-5678\nDirect line: +33 1 42 68 55 00',
  },
];

export const getFlagOptions = (isFr: boolean) => [
  { flag: 'g', name: isFr ? 'Global (g)' : 'Global (g)', desc: isFr ? 'Trouver toutes les correspondances au lieu de s’arrêter à la première' : 'Find all matches rather than stopping at the first' },
  { flag: 'i', name: isFr ? 'Insensible à la casse (i)' : 'Case insensitive (i)', desc: isFr ? 'Ignorer la distinction entre majuscules et minuscules' : 'Ignore case differences between uppercase and lowercase' },
  { flag: 'm', name: isFr ? 'Multiligne (m)' : 'Multiline (m)', desc: isFr ? '^ et $ s’appliquent au début et à la fin de chaque ligne' : '^ and $ match start and end of each line' },
  { flag: 's', name: isFr ? 'Saut de ligne / DotAll (s)' : 'DotAll (s)', desc: isFr ? 'Le point (.) capture également les retours à la ligne' : 'Dot (.) matches newline characters as well' },
  { flag: 'u', name: isFr ? 'Unicode complet (u)' : 'Full Unicode (u)', desc: isFr ? 'Prendre en charge les caractères et emojis Unicode' : 'Support full Unicode characters and emojis' },
];

export const getCheatSheet = (isFr: boolean): CheatSheetCategory[] => [
  {
    title: isFr ? 'Caractères courants' : 'Common characters',
    items: [
      { token: '\\d', desc: isFr ? 'N’importe quel chiffre (0-9)' : 'Any digit (0-9)', example: '3' },
      { token: '\\D', desc: isFr ? 'Tout sauf un chiffre' : 'Any non-digit', example: 'abc' },
      { token: '\\w', desc: isFr ? 'Lettre, chiffre ou souligné' : 'Word character (letter, digit, _)', example: 'word_42' },
      { token: '\\W', desc: isFr ? 'Caractère spécial ou ponctuation' : 'Non-word character', example: '!, @' },
      { token: '\\s', desc: isFr ? 'Espace ou tabulation' : 'Whitespace (space, tab)', example: ' ' },
      { token: '.', desc: isFr ? 'N’importe quel caractère (sauf saut de ligne)' : 'Any character (except newline)', example: 'a, 1, @' },
      { token: '[abc]', desc: isFr ? 'L’une des lettres entre crochets (a, b ou c)' : 'Any character in brackets (a, b, or c)', example: 'a' },
      { token: '[^abc]', desc: isFr ? 'Tout sauf les lettres a, b ou c' : 'Any character not in brackets', example: 'x, y, z' },
      { token: '[a-z]', desc: isFr ? 'Toute lettre minuscule de a à z' : 'Any lowercase letter from a to z', example: 'd' },
    ],
  },
  {
    title: isFr ? 'Répétitions & Quantificateurs' : 'Quantifiers & Repetitions',
    items: [
      { token: '+', desc: isFr ? '1 fois ou plus' : '1 or more times', example: 'aa' },
      { token: '*', desc: isFr ? '0 fois ou plus (optionnel ou répété)' : '0 or more times (optional or repeated)', example: 'empty or a' },
      { token: '?', desc: isFr ? '0 ou 1 fois (optionnel)' : '0 or 1 time (optional)', example: 'u?' },
      { token: '{3}', desc: isFr ? 'Exactement 3 fois' : 'Exactly 3 times', example: '\\d{3}' },
      { token: '{2,5}', desc: isFr ? 'Entre 2 et 5 fois' : 'Between 2 and 5 times', example: 'a{2,5}' },
    ],
  },
  {
    title: isFr ? 'Positions & Groupes' : 'Positions & Groups',
    items: [
      { token: '^', desc: isFr ? 'Début du texte ou de la ligne' : 'Start of string or line', example: '^Start' },
      { token: '$', desc: isFr ? 'Fin du texte ou de la ligne' : 'End of string or line', example: 'End$' },
      { token: '\\b', desc: isFr ? 'Début ou fin d’un mot entier' : 'Word boundary', example: '\\bword\\b' },
      { token: '(...)', desc: isFr ? 'Groupe de capture (récupérable avec $1)' : 'Capture group (reference with $1)', example: '(\\d+)' },
    ],
  },
];

export function evaluateRegex(
  pattern: string,
  flags: string,
  testString: string,
  replaceWith: string
): RegexEvaluation {
  if (!pattern.trim()) {
    return { matches: [], isValid: true, errorMsg: '', replacedText: testString };
  }

  try {
    const re = new RegExp(pattern, flags);
    const extracted: MatchResult[] = [];
    let replaced = '';

    try {
      replaced = testString.replace(re, replaceWith);
    } catch {
      replaced = testString;
    }

    const extractGroups = (match: RegExpExecArray): MatchGroup[] => {
      const groups: MatchGroup[] = [];
      if (match.length > 1) {
        for (let i = 1; i < match.length; i++) {
          groups.push({ index: i, value: match[i] ?? '' });
        }
      }
      if (match.groups) {
        Object.entries(match.groups).forEach(([name, val]) => {
          const existing = groups.find((g) => g.value === val);
          if (existing) {
            existing.name = name;
          } else {
            groups.push({ index: groups.length + 1, name, value: val ?? '' });
          }
        });
      }
      return groups;
    };

    if (flags.includes('g')) {
      let match: RegExpExecArray | null;
      let count = 0;
      const MAX_MATCHES = 3000;

      while ((match = re.exec(testString)) !== null) {
        count++;
        if (count > MAX_MATCHES) break;

        extracted.push({
          index: match.index,
          length: match[0].length,
          value: match[0],
          groups: extractGroups(match),
        });

        if (match.index === re.lastIndex) {
          re.lastIndex++;
        }
      }
    } else {
      const match = re.exec(testString);
      if (match) {
        extracted.push({
          index: match.index,
          length: match[0].length,
          value: match[0],
          groups: extractGroups(match),
        });
      }
    }

    return { matches: extracted, isValid: true, errorMsg: '', replacedText: replaced };
  } catch (e) {
    return {
      matches: [],
      isValid: false,
      errorMsg: e instanceof Error ? e.message : 'Expression régulière invalide',
      replacedText: testString,
    };
  }
}

export function computeHighlightedChunks(
  testString: string,
  matches: MatchResult[]
): TextChunk[] {
  if (!matches.length || !testString) {
    return [{ text: testString, isMatch: false }];
  }

  const chunks: TextChunk[] = [];
  let lastIndex = 0;

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    if (m.index > lastIndex) {
      chunks.push({
        text: testString.slice(lastIndex, m.index),
        isMatch: false,
      });
    }
    if (m.length > 0) {
      chunks.push({
        text: testString.slice(m.index, m.index + m.length),
        isMatch: true,
        matchIndex: i + 1,
      });
      lastIndex = m.index + m.length;
    } else {
      if (m.index >= lastIndex) {
        lastIndex = m.index;
      }
    }
  }

  if (lastIndex < testString.length) {
    chunks.push({
      text: testString.slice(lastIndex),
      isMatch: false,
    });
  }

  return chunks;
}
