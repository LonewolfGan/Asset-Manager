import {
  type BarcodeSymbology,
  getSymbologies,
  getEanCountry,
} from './barcode-symbologies';

export {
  type BarcodeSymbology,
  getSymbologies,
  getEanCountry,
};

export function calculateEanCheckDigit(digits: string): number {
  let sum = 0;
  const len = digits.length;
  for (let i = 0; i < len; i++) {
    const n = parseInt(digits[len - 1 - i], 10);
    sum += i % 2 === 0 ? n * 3 : n;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

export interface BarcodeValidationResult {
  isValid: boolean;
  status: 'empty' | 'valid' | 'needs_check' | 'wrong_key' | 'error';
  message: string;
  autoFix?: string;
  expectedKey?: number;
  country?: string | null;
}

export function validateBarcode(
  symbologyId: string,
  value: string,
  isFr: boolean
): BarcodeValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return {
      isValid: false,
      status: 'empty',
      message: isFr ? 'Saisissez les données du code-barres' : 'Enter barcode data',
    };
  }

  if (symbologyId === 'EAN13') {
    const digitsOnly = trimmed.replace(/\s+/g, '');
    if (!/^\d+$/.test(digitsOnly)) {
      return {
        isValid: false,
        status: 'error',
        message: isFr ? 'Chiffres uniquement (0-9)' : 'Digits only (0-9)',
      };
    }
    if (digitsOnly.length === 12) {
      const expectedKey = calculateEanCheckDigit(digitsOnly);
      return {
        isValid: false,
        status: 'needs_check',
        message: isFr
          ? `12 chiffres saisis · Clé calculée : ${expectedKey}`
          : `12 digits entered · Calculated checksum: ${expectedKey}`,
        autoFix: digitsOnly + expectedKey,
        expectedKey,
      };
    }
    if (digitsOnly.length === 13) {
      const body = digitsOnly.slice(0, 12);
      const actualKey = parseInt(digitsOnly[12], 10);
      const expectedKey = calculateEanCheckDigit(body);
      if (actualKey !== expectedKey) {
        return {
          isValid: false,
          status: 'wrong_key',
          message: isFr
            ? `Clé erronée (${actualKey} au lieu de ${expectedKey})`
            : `Wrong checksum (${actualKey} instead of ${expectedKey})`,
          autoFix: body + expectedKey,
          expectedKey,
        };
      }
      return {
        isValid: true,
        status: 'valid',
        country: getEanCountry(digitsOnly, isFr),
        message: isFr ? 'GS1 EAN-13 conforme' : 'Compliant GS1 EAN-13',
      };
    }
    return {
      isValid: false,
      status: 'error',
      message: isFr
        ? `13 chiffres requis (actuellement ${digitsOnly.length})`
        : `13 digits required (currently ${digitsOnly.length})`,
    };
  }

  if (symbologyId === 'UPC') {
    const digitsOnly = trimmed.replace(/\s+/g, '');
    if (!/^\d+$/.test(digitsOnly)) {
      return {
        isValid: false,
        status: 'error',
        message: isFr ? 'Chiffres uniquement (0-9)' : 'Digits only (0-9)',
      };
    }
    if (digitsOnly.length === 11) {
      const expectedKey = calculateEanCheckDigit(digitsOnly);
      return {
        isValid: false,
        status: 'needs_check',
        message: isFr
          ? `11 chiffres saisis · Clé calculée : ${expectedKey}`
          : `11 digits entered · Calculated checksum: ${expectedKey}`,
        autoFix: digitsOnly + expectedKey,
        expectedKey,
      };
    }
    if (digitsOnly.length === 12) {
      const body = digitsOnly.slice(0, 11);
      const actualKey = parseInt(digitsOnly[11], 10);
      const expectedKey = calculateEanCheckDigit(body);
      if (actualKey !== expectedKey) {
        return {
          isValid: false,
          status: 'wrong_key',
          message: isFr
            ? `Clé erronée (${actualKey} au lieu de ${expectedKey})`
            : `Wrong checksum (${actualKey} instead of ${expectedKey})`,
          autoFix: body + expectedKey,
          expectedKey,
        };
      }
      return {
        isValid: true,
        status: 'valid',
        message: isFr ? 'GS1 UPC-A conforme' : 'Compliant GS1 UPC-A',
      };
    }
    return {
      isValid: false,
      status: 'error',
      message: isFr
        ? `12 chiffres requis (actuellement ${digitsOnly.length})`
        : `12 digits required (currently ${digitsOnly.length})`,
    };
  }

  if (symbologyId === 'EAN8') {
    const digitsOnly = trimmed.replace(/\s+/g, '');
    if (!/^\d+$/.test(digitsOnly)) {
      return {
        isValid: false,
        status: 'error',
        message: isFr ? 'Chiffres uniquement (0-9)' : 'Digits only (0-9)',
      };
    }
    if (digitsOnly.length === 7) {
      const expectedKey = calculateEanCheckDigit(digitsOnly);
      return {
        isValid: false,
        status: 'needs_check',
        message: isFr
          ? `7 chiffres saisis · Clé calculée : ${expectedKey}`
          : `7 digits entered · Calculated checksum: ${expectedKey}`,
        autoFix: digitsOnly + expectedKey,
        expectedKey,
      };
    }
    if (digitsOnly.length === 8) {
      const body = digitsOnly.slice(0, 7);
      const actualKey = parseInt(digitsOnly[7], 10);
      const expectedKey = calculateEanCheckDigit(body);
      if (actualKey !== expectedKey) {
        return {
          isValid: false,
          status: 'wrong_key',
          message: isFr
            ? `Clé erronée (${actualKey} au lieu de ${expectedKey})`
            : `Wrong checksum (${actualKey} instead of ${expectedKey})`,
          autoFix: body + expectedKey,
          expectedKey,
        };
      }
      return {
        isValid: true,
        status: 'valid',
        message: isFr ? 'GS1 EAN-8 conforme' : 'Compliant GS1 EAN-8',
      };
    }
    return {
      isValid: false,
      status: 'error',
      message: isFr
        ? `8 chiffres requis (actuellement ${digitsOnly.length})`
        : `8 digits required (currently ${digitsOnly.length})`,
    };
  }

  if (symbologyId === 'CODE39') {
    if (!/^[0-9A-Z\-\.\ \$\/\+\%]+$/.test(trimmed)) {
      return {
        isValid: false,
        status: 'error',
        message: isFr
          ? 'Majuscules, chiffres et symboles - . $ / + % espace'
          : 'Uppercase letters, digits, and symbols - . $ / + % space',
      };
    }
  }

  if (symbologyId === 'ITF14') {
    const digitsOnly = trimmed.replace(/\s+/g, '');
    if (!/^\d+$/.test(digitsOnly)) {
      return {
        isValid: false,
        status: 'error',
        message: isFr ? 'Chiffres uniquement' : 'Digits only',
      };
    }
    if (digitsOnly.length !== 14) {
      return {
        isValid: false,
        status: 'error',
        message: isFr
          ? `14 chiffres requis (actuellement ${digitsOnly.length})`
          : `14 digits required (currently ${digitsOnly.length})`,
      };
    }
  }

  if (symbologyId === 'pharmacode') {
    const num = parseInt(trimmed, 10);
    if (isNaN(num) || num < 3 || num > 131070) {
      return {
        isValid: false,
        status: 'error',
        message: isFr ? 'Entier compris entre 3 et 131070' : 'Integer between 3 and 131070',
      };
    }
  }

  return {
    isValid: true,
    status: 'valid',
    message: isFr ? 'Format conforme' : 'Valid format',
  };
}
