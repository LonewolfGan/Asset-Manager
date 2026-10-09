export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase?: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous?: boolean;
  pronounceable?: boolean;
}

export interface PassphraseOptions {
  wordCount: number;
  separator: string;
  capitalizeWords: boolean;
  includeNumberInPassphrase: boolean;
}

export const PASSPHRASE_WORDS = [
  'acid', 'acorn', 'action', 'actor', 'adapt', 'agent', 'agile', 'alarm', 'album', 'alert',
  'alien', 'align', 'alpha', 'amber', 'anchor', 'angel', 'angle', 'animal', 'anthem', 'anvil',
  'apple', 'arcade', 'arctic', 'arena', 'arrow', 'artist', 'aspect', 'atlas', 'atom', 'audio',
  'author', 'avatar', 'avenue', 'badge', 'ballet', 'bamboo', 'banana', 'banner', 'beacon', 'breeze',
  'bridge', 'bubble', 'cactus', 'camera', 'canyon', 'canvas', 'carpet', 'castle', 'cedar', 'celery',
  'center', 'cereal', 'chalk', 'charm', 'cherry', 'cipher', 'circle', 'circus', 'cliff', 'clover',
  'cobalt', 'coffee', 'comet', 'cookie', 'copper', 'coral', 'cosmos', 'cotton', 'crater', 'crayon',
  'credit', 'cricket', 'crown', 'crystal', 'cube', 'curtain', 'cycle', 'daisy', 'dancer', 'dawn',
  'desert', 'diamond', 'diorama', 'dolphin', 'dragon', 'drift', 'eagle', 'echo', 'eclipse', 'elastic',
  'element', 'ember', 'emerald', 'engine', 'epoch', 'equal', 'falcon', 'feather', 'fender', 'ferret',
  'filter', 'finish', 'flame', 'flash', 'flight', 'flower', 'flute', 'forest', 'fountain', 'fossil',
  'galaxy', 'garden', 'garlic', 'garnet', 'gazelle', 'gecko', 'gemini', 'glacier', 'glass', 'glider',
  'glow', 'gold', 'guitar', 'harbor', 'harvest', 'haven', 'hawk', 'hazel', 'helix', 'hero',
  'honey', 'horizon', 'husky', 'hydra', 'iceberg', 'iguana', 'impact', 'indigo', 'island', 'ivory',
  'jacket', 'jaguar', 'jasper', 'jazz', 'jelly', 'jester', 'jewel', 'journey', 'jungle', 'jupiter',
  'karat', 'kayak', 'kernel', 'kite', 'kiwi', 'koala', 'lagoon', 'lantern', 'laser', 'lava',
  'lemon', 'leopard', 'light', 'lilac', 'lime', 'linear', 'lion', 'lizard', 'lotus', 'lunar',
  'magnet', 'mango', 'mantis', 'marble', 'matrix', 'meadow', 'melody', 'meteor', 'mineral', 'mirror',
  'monarch', 'mosaic', 'moss', 'mountain', 'music', 'nebula', 'nectar', 'neon', 'ninja', 'nova',
  'oasis', 'ocean', 'olive', 'onyx', 'opal', 'orbit', 'orchid', 'origami', 'otter', 'oxygen',
  'ozone', 'palace', 'panda', 'panther', 'papaya', 'parcel', 'parrot', 'pearl', 'pebble', 'pelican',
  'penguin', 'pepper', 'phoenix', 'piano', 'pilot', 'planet', 'plasma', 'platypus', 'polar', 'pollen',
  'polygon', 'portal', 'prism', 'pulse', 'pyramid', 'quantum', 'quartz', 'quasar', 'radar', 'radiant',
  'rainbow', 'ranger', 'raven', 'rebel', 'reflex', 'rhino', 'ripple', 'river', 'robot', 'rocket',
  'ruby', 'safari', 'sailor', 'salmon', 'satellite', 'saturn', 'scanner', 'scarlet', 'scenic', 'scribe',
  'scroll', 'season', 'shadow', 'shield', 'silver', 'siren', 'skyline', 'solar', 'sonic', 'spark',
  'sphere', 'spider', 'spirit', 'spring', 'sprout', 'star', 'stellar', 'stream', 'summit', 'sunburst',
  'sunset', 'swift', 'symphony', 'target', 'temple', 'terra', 'tiger', 'timber', 'titan', 'topaz',
  'torpedo', 'tower', 'tracer', 'tulip', 'tundra', 'turtle', 'twilight', 'ultra', 'umbra', 'unicorn',
  'valley', 'vanilla', 'vector', 'velvet', 'vessel', 'vibrant', 'violet', 'viper', 'virtual', 'vision',
  'vortex', 'voyage', 'vulcan', 'walnut', 'walrus', 'warrior', 'wave', 'willow', 'wind', 'winter',
  'wizard', 'wolf', 'wombat', 'zenith', 'zephyr', 'zero', 'zinc', 'zircon'
];

function getRandomUint32(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0];
}

/** Generate a cryptographically secure random password */
export function generatePassword(opts: PasswordOptions): string {
  if (opts.pronounceable) {
    const cons = opts.excludeAmbiguous ? 'bcdfghjkmnpqrstvwxyz' : 'bcdfghjklmnpqrstvwxyz';
    const vows = 'aeiou';
    let pw = '';
    for (let i = 0; i < opts.length; i++) {
      const chars = i % 2 === 0 ? cons : vows;
      let char = chars[getRandomUint32() % chars.length];
      if (opts.uppercase && (i === 0 || getRandomUint32() % 4 === 0)) {
        char = char.toUpperCase();
      }
      pw += char;
    }
    return pw;
  }

  const upperSet = opts.excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerSet = opts.excludeAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  const numSet = opts.excludeAmbiguous ? '23456789' : '0123456789';
  const symSet = opts.excludeAmbiguous ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : '!@#$%^&*()_+-=[]{}|;\':",.<>?/';

  let chars = '';
  if (opts.uppercase) chars += upperSet;
  if (opts.lowercase !== false) chars += lowerSet;
  if (opts.numbers) chars += numSet;
  if (opts.symbols) chars += symSet;

  if (!chars) chars = lowerSet;

  let pw = '';
  const array = new Uint32Array(opts.length);
  crypto.getRandomValues(array);
  for (let i = 0; i < opts.length; i++) {
    pw += chars[array[i] % chars.length];
  }
  return pw;
}

/** Generate a Diceware-style passphrase */
export function generatePassphrase(opts: PassphraseOptions): string {
  const words: string[] = [];
  for (let i = 0; i < opts.wordCount; i++) {
    let w = PASSPHRASE_WORDS[getRandomUint32() % PASSPHRASE_WORDS.length];
    if (opts.capitalizeWords) {
      w = w.charAt(0).toUpperCase() + w.slice(1);
    }
    words.push(w);
  }
  let phrase = words.join(opts.separator);
  if (opts.includeNumberInPassphrase) {
    const num = (getRandomUint32() % 90 + 10).toString();
    phrase += `${opts.separator}${num}`;
  }
  return phrase;
}

export type StrengthLevel = 'weak' | 'fair' | 'strong' | 'exceptional';

export function calculateStrength(password: string): StrengthLevel {
  let R = 0;
  if (/[a-z]/.test(password)) R += 26;
  if (/[A-Z]/.test(password)) R += 26;
  if (/[0-9]/.test(password)) R += 10;
  if (/[^a-zA-Z0-9]/.test(password)) R += 32;
  if (R === 0) R = 26;
  const entropy = password.length * Math.log2(R);
  if (entropy < 40) return 'weak';
  if (entropy < 72) return 'fair';
  if (entropy < 128) return 'strong';
  return 'exceptional';
}

export interface PasswordVaultStrength {
  label: string;
  level: number;
  color: string;
  stroke: string;
}

export interface VaultStrengthParams {
  mode: 'random' | 'passphrase';
  wordCount: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  length: number;
  labels: {
    weak: string;
    fair: string;
    strong: string;
    exceptional: string;
  };
}

export function calculateVaultStrength(params: VaultStrengthParams): PasswordVaultStrength {
  if (params.mode === 'passphrase') {
    if (params.wordCount <= 3) {
      return {
        label: params.labels.fair,
        level: 2,
        color: 'text-amber-600 dark:text-amber-400',
        stroke: 'text-amber-500',
      };
    }
    if (params.wordCount <= 4) {
      return {
        label: params.labels.strong,
        level: 3,
        color: 'text-emerald-600 dark:text-emerald-400',
        stroke: 'text-emerald-500',
      };
    }
    return {
      label: params.labels.exceptional,
      level: 4,
      color: 'text-[#FF6B35] dark:text-[#FF8255]',
      stroke: 'text-[#FF6B35]',
    };
  }

  let pool = 0;
  if (params.uppercase) pool += 26;
  if (params.lowercase) pool += 26;
  if (params.numbers) pool += 10;
  if (params.symbols) pool += 32;
  if (pool === 0) pool = 26;

  const entropy = params.length * Math.log2(pool);
  if (entropy < 40) {
    return {
      label: params.labels.weak,
      level: 1,
      color: 'text-red-600 dark:text-red-400',
      stroke: 'text-red-500',
    };
  }
  if (entropy < 65) {
    return {
      label: params.labels.fair,
      level: 2,
      color: 'text-amber-600 dark:text-amber-400',
      stroke: 'text-amber-500',
    };
  }
  if (entropy < 90) {
    return {
      label: params.labels.strong,
      level: 3,
      color: 'text-emerald-600 dark:text-emerald-400',
      stroke: 'text-emerald-500',
    };
  }
  return {
    label: params.labels.exceptional,
    level: 4,
    color: 'text-[#FF6B35] dark:text-[#FF8255]',
    stroke: 'text-[#FF6B35]',
  };
}

export function getTextSizeClass(length: number): string {
  if (length <= 14) return 'text-3xl sm:text-5xl md:text-6xl tracking-wider';
  if (length <= 24) return 'text-2xl sm:text-4xl md:text-5xl tracking-wide';
  if (length <= 36) return 'text-xl sm:text-3xl md:text-4xl tracking-normal';
  return 'text-lg sm:text-2xl md:text-3xl tracking-tight';
}
