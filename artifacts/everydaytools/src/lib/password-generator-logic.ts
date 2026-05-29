export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase?: boolean;
  numbers: boolean;
  symbols: boolean;
  pronounceable?: boolean;
}

/** Generate a cryptographically secure password */
export function generatePassword(opts: PasswordOptions): string {
  if (opts.pronounceable) {
    const cons = 'bcdfghjklmnpqrstvwxyz';
    const vows = 'aeiou';
    let pw = '';
    for (let i = 0; i < opts.length; i++) {
      const chars = i % 2 === 0 ? cons : vows;
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      pw += chars[array[0] % chars.length];
    }
    return pw;
  }

  let chars = '';
  if (opts.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (opts.lowercase !== false) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (opts.numbers) chars += '0123456789';
  if (opts.symbols) chars += '!@#$%^&*()_+-=[]{}|;\':",.<>?/';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  let pw = '';
  const array = new Uint32Array(opts.length);
  crypto.getRandomValues(array);
  for (let i = 0; i < opts.length; i++) {
    pw += chars[array[i] % chars.length];
  }
  return pw;
}

export type StrengthLevel = 'weak' | 'fair' | 'strong' | 'exceptional';

/**
 * Estimate password strength from the actual characters used.
 * Tiers: weak < 40 bits, fair < 72, strong < 128, exceptional >= 128.
 */
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
