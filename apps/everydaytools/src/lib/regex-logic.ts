/**
 * Regex evaluation, token highlighting, group extraction and common pattern presets.
 */

export interface RegexMatchItem {
  index: number;
  match: string;
  groups: string[];
  namedGroups?: Record<string, string>;
}

export interface TextSegment {
  text: string;
  isMatch: boolean;
  matchIndex?: number;
}

export interface RegexExecutionResult {
  isValid: boolean;
  error?: string;
  matches: RegexMatchItem[];
  segments: TextSegment[];
  replacedText: string;
  executionTimeMs: number;
}

/**
 * Execute regex safely against test string with intra-text segment splitting
 */
export function executeRegex(
  pattern: string,
  flags: string,
  testString: string,
  replaceWith: string = ''
): RegexExecutionResult {
  const startTime = performance.now();

  if (!pattern) {
    return {
      isValid: true,
      matches: [],
      segments: [{ text: testString, isMatch: false }],
      replacedText: testString,
      executionTimeMs: 0,
    };
  }

  try {
    // Ensure 'g' flag for global iteration if not present, but track original intent
    const hasGlobal = flags.includes('g');
    const effectiveFlags = hasGlobal ? flags : `${flags}g`;
    const regex = new RegExp(pattern, effectiveFlags);

    const matches: RegexMatchItem[] = [];
    const segments: TextSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let count = 0;
    const MAX_MATCHES = 1000; // Protection against catastrophic regex

    while ((match = regex.exec(testString)) !== null && count < MAX_MATCHES) {
      count++;
      const matchIndex = match.index;
      const matchText = match[0];

      // If zero-length match, advance regex lastIndex to prevent infinite loop
      if (matchText.length === 0) {
        regex.lastIndex++;
      }

      // Add non-matching text before this match
      if (matchIndex > lastIndex) {
        segments.push({
          text: testString.slice(lastIndex, matchIndex),
          isMatch: false,
        });
      }

      // Add the matched segment
      segments.push({
        text: matchText,
        isMatch: true,
        matchIndex: count,
      });

      matches.push({
        index: matchIndex,
        match: matchText,
        groups: match.slice(1),
        namedGroups: match.groups ? { ...match.groups } : undefined,
      });

      lastIndex = matchIndex + matchText.length;

      // If original flags didn't have 'g', stop after the first match
      if (!hasGlobal) break;
    }

    // Add remaining text after last match
    if (lastIndex < testString.length) {
      segments.push({
        text: testString.slice(lastIndex),
        isMatch: false,
      });
    }

    // Perform replacement using standard replace logic
    const replaceRegex = new RegExp(pattern, flags);
    const replacedText = testString.replace(replaceRegex, replaceWith);

    const endTime = performance.now();

    return {
      isValid: true,
      matches,
      segments,
      replacedText,
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
    };
  } catch (err) {
    return {
      isValid: false,
      error: err instanceof Error ? err.message : 'Expression régulière invalide',
      matches: [],
      segments: [{ text: testString, isMatch: false }],
      replacedText: testString,
      executionTimeMs: 0,
    };
  }
}

/**
 * Common RegEx Presets
 */
export const REGEX_PRESETS = [
  {
    name: 'Email',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'g',
    description: 'Adresses email valides (RFC 5322 simplifié)',
    sample: 'Contactez dev@everydaytools.org ou support@cloud.fr pour toute assistance.',
  },
  {
    name: 'Téléphone (FR)',
    pattern: '(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}',
    flags: 'g',
    description: 'Numéros français (formats 06 12 34 56 78 ou +33 6 ...)',
    sample: 'Standard : 01 42 68 00 00, Mobile : +33 6 12 34 56 78 ou 06-99-88-77-66.',
  },
  {
    name: 'URL Web',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)',
    flags: 'gi',
    description: 'Adresses HTTP / HTTPS avec chemins et requêtes',
    sample: 'Visitez https://everydaytools.org/fr/pdf ou http://localhost:5000/docs?ref=123',
  },
  {
    name: 'Date (YYYY-MM-DD)',
    pattern: '\\b(?<year>\\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12]\\d|3[01])\\b',
    flags: 'g',
    description: 'Format ISO standard avec groupes nommés (year, month, day)',
    sample: 'Dates de livraison : 2026-03-09 et 2026-12-31, mais pas 2026-15-40.',
  },
  {
    name: 'Adresse IPv4',
    pattern: '\\b(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}\\b',
    flags: 'g',
    description: 'Adresses IPv4 valides entre 0.0.0.0 et 255.255.255.255',
    sample: 'Routeur : 192.168.1.1, Serveur DNS : 8.8.8.8 et passerelle 10.0.0.254.',
  },
  {
    name: 'Couleur Hexadécimale',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    flags: 'gi',
    description: 'Codes couleur hexadécimaux (#RGB ou #RRGGBB)',
    sample: 'Palette de marque : Primaire #2563EB, Arrière-plan #FFF, Accent #10B981.',
  },
];

/**
 * Quick Regex Syntax Reference
 */
export const REGEX_CHEATSHEET = [
  { char: '.', desc: "N'importe quel caractère (sauf saut de ligne)" },
  { char: '\\d', desc: 'Chiffre [0-9]' },
  { char: '\\D', desc: 'Non-chiffre' },
  { char: '\\w', desc: 'Caractère de mot [a-zA-Z0-9_]' },
  { char: '\\s', desc: 'Espace, tabulation, saut de ligne' },
  { char: '^ / $', desc: 'Début / Fin de chaîne (ou de ligne si m)' },
  { char: '*', desc: '0 ou plusieurs fois (gourmand)' },
  { char: '+', desc: '1 ou plusieurs fois' },
  { char: '?', desc: '0 ou 1 fois (ou rend non gourmand)' },
  { char: '{n,m}', desc: 'Entre n et m répétitions' },
  { char: '[abc]', desc: 'Classe de caractères (a, b ou c)' },
  { char: '(...)', desc: 'Groupe de capture numéroté' },
  { char: '(?<id>...)', desc: 'Groupe de capture nommé' },
];
