export type PresetMode = 'random' | 'passphrase';

export interface BasePreset {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
}

export interface RandomPasswordPreset extends BasePreset {
  mode: 'random';
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  pronounceable: boolean;
}

export interface PassphrasePreset extends BasePreset {
  mode: 'passphrase';
  wordCount: number;
  separator: string;
  capitalizeWords: boolean;
  includeNumberInPassphrase: boolean;
}

export type PasswordPreset = RandomPasswordPreset | PassphrasePreset;

export const PASSWORD_PRESETS: PasswordPreset[] = [
  {
    id: 'web-login',
    name: 'Web Login',
    nameFr: 'Compte Web Standard',
    description: '16 characters with letters, numbers, and symbols for all web accounts.',
    descriptionFr: '16 caractères avec lettres, chiffres et symboles adaptés à tous les comptes web.',
    mode: 'random',
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
    pronounceable: false,
  },
  {
    id: 'high-security',
    name: 'High Security',
    nameFr: 'Haute Sécurité',
    description: '24 characters with full charset, excluding ambiguous glyphs.',
    descriptionFr: '24 caractères avec tous les symboles sans caractères visuellement ambigus.',
    mode: 'random',
    length: 24,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: true,
    pronounceable: false,
  },
  {
    id: 'pin-4',
    name: 'PIN 4-Digit',
    nameFr: 'Code PIN 4 chiffres',
    description: '4-digit numeric code for banking or SIM cards.',
    descriptionFr: 'Code numérique à 4 chiffres pour cartes bancaires ou téléphones.',
    mode: 'random',
    length: 4,
    uppercase: false,
    lowercase: false,
    numbers: true,
    symbols: false,
    excludeAmbiguous: false,
    pronounceable: false,
  },
  {
    id: 'pin-6',
    name: 'PIN 6-Digit',
    nameFr: 'Code PIN 6 chiffres',
    description: '6-digit numeric passcode for mobile lock screens and 2FA.',
    descriptionFr: 'Code numérique à 6 chiffres pour écrans de verrouillage et double facteur.',
    mode: 'random',
    length: 6,
    uppercase: false,
    lowercase: false,
    numbers: true,
    symbols: false,
    excludeAmbiguous: false,
    pronounceable: false,
  },
  {
    id: 'passphrase-memorable',
    name: 'Memorable Passphrase',
    nameFr: 'Phrase Mémorisable',
    description: '4 Diceware-style words separated by hyphens with an appended number.',
    descriptionFr: '4 mots Diceware séparés par des tirets avec un nombre pour une mémorisation facile.',
    mode: 'passphrase',
    wordCount: 4,
    separator: '-',
    capitalizeWords: true,
    includeNumberInPassphrase: true,
  },
  {
    id: 'api-key',
    name: 'API / Database Key',
    nameFr: 'Clé API / BDD',
    description: '32 alphanumeric characters without special symbols for config files.',
    descriptionFr: '32 caractères alphanumériques sans symboles spéciaux pour fichiers .env.',
    mode: 'random',
    length: 32,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeAmbiguous: false,
    pronounceable: false,
  },
];

export function getPresetById(id: string): PasswordPreset | undefined {
  return PASSWORD_PRESETS.find((p) => p.id === id);
}
