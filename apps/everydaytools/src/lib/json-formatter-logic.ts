/**
 * Core pure logic for JSON formatting, validation, minification, and key sorting.
 */

export interface JsonValidationResult {
  valid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  stats?: {
    sizeBytes: number;
    charCount: number;
    lineCount: number;
    depth: number;
    keyCount: number;
  };
}

export type IndentOption = 2 | 4 | '\t';

/**
 * Calculate structural depth and total unique object keys count
 */
function analyzeObject(obj: unknown, currentDepth = 1): { depth: number; keyCount: number } {
  if (obj === null || typeof obj !== 'object') {
    return { depth: currentDepth, keyCount: 0 };
  }

  if (Array.isArray(obj)) {
    let maxChildDepth = currentDepth;
    let totalKeys = 0;
    for (const item of obj) {
      const child = analyzeObject(item, currentDepth + 1);
      if (child.depth > maxChildDepth) maxChildDepth = child.depth;
      totalKeys += child.keyCount;
    }
    return { depth: maxChildDepth, keyCount: totalKeys };
  }

  const keys = Object.keys(obj as Record<string, unknown>);
  let maxChildDepth = currentDepth;
  let totalKeys = keys.length;

  for (const k of keys) {
    const val = (obj as Record<string, unknown>)[k];
    const child = analyzeObject(val, currentDepth + 1);
    if (child.depth > maxChildDepth) maxChildDepth = child.depth;
    totalKeys += child.keyCount;
  }

  return { depth: maxChildDepth, keyCount: totalKeys };
}

/**
 * Parse line and column number from JSON.parse error message if available
 */
export function parseJsonErrorLocation(
  errorMessage: string,
  rawText: string
): { line?: number; column?: number } {
  // Typical formats: "at position 42", "line 3 column 5", "at line 2, column 14"
  const lineColMatch = errorMessage.match(/line (\d+).*?column (\d+)/i);
  if (lineColMatch) {
    return {
      line: parseInt(lineColMatch[1], 10),
      column: parseInt(lineColMatch[2], 10),
    };
  }

  const posMatch = errorMessage.match(/position (\d+)/i);
  if (posMatch) {
    const position = parseInt(posMatch[1], 10);
    const textUpToPos = rawText.slice(0, position);
    const lines = textUpToPos.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    return { line, column };
  }

  return {};
}

/**
 * Validates JSON string and returns rich metadata
 */
export function validateJson(text: string): JsonValidationResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { valid: true };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const { depth, keyCount } = analyzeObject(parsed);
    const lines = trimmed.split('\n');

    return {
      valid: true,
      stats: {
        sizeBytes: new Blob([trimmed]).size,
        charCount: trimmed.length,
        lineCount: lines.length,
        depth,
        keyCount,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'JSON invalide';
    const loc = parseJsonErrorLocation(message, trimmed);
    return {
      valid: false,
      error: {
        message,
        line: loc.line,
        column: loc.column,
      },
    };
  }
}

/**
 * Format JSON with specified indentation
 */
export function formatJson(text: string, indent: IndentOption = 2): { output: string; error?: string } {
  if (!text.trim()) return { output: '' };
  try {
    const parsed = JSON.parse(text);
    const formatted = JSON.stringify(parsed, null, indent);
    return { output: formatted };
  } catch (err) {
    return {
      output: '',
      error: err instanceof Error ? err.message : 'JSON invalide',
    };
  }
}

/**
 * Minify JSON into a single compact line
 */
export function minifyJson(text: string): { output: string; error?: string } {
  if (!text.trim()) return { output: '' };
  try {
    const parsed = JSON.parse(text);
    return { output: JSON.stringify(parsed) };
  } catch (err) {
    return {
      output: '',
      error: err instanceof Error ? err.message : 'JSON invalide',
    };
  }
}

/**
 * Recursively sort all keys in objects alphabetically
 */
export function sortJsonKeys(
  text: string,
  indent: IndentOption = 2
): { output: string; error?: string } {
  if (!text.trim()) return { output: '' };

  function sortRecursively(value: unknown): unknown {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map(sortRecursively);
    }

    const record = value as Record<string, unknown>;
    const sortedKeys = Object.keys(record).sort();
    const result: Record<string, unknown> = {};
    for (const key of sortedKeys) {
      result[key] = sortRecursively(record[key]);
    }
    return result;
  }

  try {
    const parsed = JSON.parse(text);
    const sorted = sortRecursively(parsed);
    return { output: JSON.stringify(sorted, null, indent) };
  } catch (err) {
    return {
      output: '',
      error: err instanceof Error ? err.message : 'JSON invalide',
    };
  }
}

/**
 * Sample JSON templates for rapid testing
 */
export const JSON_SAMPLES = {
  userProfile: JSON.stringify(
    {
      id: "usr_9981",
      name: "Alexandre Martin",
      email: "alexandre@example.com",
      isActive: true,
      roles: ["admin", "editor"],
      settings: {
        theme: "dark",
        notifications: { email: true, sms: false },
        language: "fr-FR",
      },
      stats: { logins: 142, lastSeen: "2026-03-09T18:30:00Z" },
    },
    null,
    2
  ),
  ecommerceOrder: JSON.stringify(
    {
      orderId: "CMD-2026-884",
      customer: { id: 402, name: "Sophie Dupont" },
      items: [
        { sku: "KB-MEC-01", name: "Clavier Mécanique RGB", qty: 1, unitPrice: 129.99 },
        { sku: "MS-PRO-02", name: "Souris Ergonomique", qty: 2, unitPrice: 59.5 },
      ],
      shipping: { method: "Express 24h", cost: 9.9, freeShipping: false },
      totals: { subtotal: 248.99, tax: 49.8, grandTotal: 308.69 },
      status: "paid",
    },
    null,
    2
  ),
  geojson: JSON.stringify(
    {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [2.3522, 48.8566] },
          properties: { name: "Paris", population: 2161000, country: "FR" },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-0.1276, 51.5074] },
          properties: { name: "Londres", population: 8982000, country: "GB" },
        },
      ],
    },
    null,
    2
  ),
};
