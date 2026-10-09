import { computeTextDiff, type DiffResult } from './diff-checker-logic';

export type JsonDiffType = 'added' | 'removed' | 'changed' | 'unchanged';

export interface JsonDiffEntry {
  path: string;
  type: JsonDiffType;
  oldValue?: unknown;
  newValue?: unknown;
  description: string;
}

export interface JsonSemanticDiffResult {
  entries: JsonDiffEntry[];
  stats: {
    added: number;
    removed: number;
    changed: number;
    unchanged: number;
    total: number;
  };
  hasChanges: boolean;
}

/**
 * Recursively sort object keys for stable comparison
 */
export function sortJsonKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortJsonKeys);
  } else if (obj !== null && typeof obj === 'object') {
    const sortedObj: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    for (const key of keys) {
      sortedObj[key] = sortJsonKeys((obj as Record<string, unknown>)[key]);
    }
    return sortedObj;
  }
  return obj;
}

/**
 * Format any value into a clean, human-readable string representation
 */
export function formatValue(val: unknown): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return JSON.stringify(val);
}

/**
 * Recursively compare two JSON objects to produce structured semantic diff entries
 */
export function computeJsonSemanticDiff(
  objA: unknown,
  objB: unknown,
  currentPath = '$'
): JsonSemanticDiffResult {
  const entries: JsonDiffEntry[] = [];

  function compareRecursive(a: unknown, b: unknown, path: string) {
    // Exact match (including null and primitives)
    if (a === b) {
      return;
    }

    // Type mismatch or one is null/primitive
    const isObjectA = a !== null && typeof a === 'object';
    const isObjectB = b !== null && typeof b === 'object';
    const isArrayA = Array.isArray(a);
    const isArrayB = Array.isArray(b);

    if (isArrayA && isArrayB) {
      const arrA = a as unknown[];
      const arrB = b as unknown[];
      const maxLen = Math.max(arrA.length, arrB.length);

      for (let i = 0; i < maxLen; i++) {
        const itemPath = `${path}[${i}]`;
        if (i >= arrA.length) {
          entries.push({
            path: itemPath,
            type: 'added',
            newValue: arrB[i],
            description: `Added element at index ${i}`,
          });
        } else if (i >= arrB.length) {
          entries.push({
            path: itemPath,
            type: 'removed',
            oldValue: arrA[i],
            description: `Removed element at index ${i}`,
          });
        } else {
          compareRecursive(arrA[i], arrB[i], itemPath);
        }
      }
      return;
    }

    if (isObjectA && isObjectB && !isArrayA && !isArrayB) {
      const recA = a as Record<string, unknown>;
      const recB = b as Record<string, unknown>;
      const keysA = new Set(Object.keys(recA));
      const keysB = new Set(Object.keys(recB));
      const allKeys = Array.from(new Set([...keysA, ...keysB])).sort();

      for (const key of allKeys) {
        const keyPath = path === '$' ? `$.${key}` : `${path}.${key}`;
        const hasA = keysA.has(key);
        const hasB = keysB.has(key);

        if (hasA && !hasB) {
          entries.push({
            path: keyPath,
            type: 'removed',
            oldValue: recA[key],
            description: `Removed property "${key}"`,
          });
        } else if (!hasA && hasB) {
          entries.push({
            path: keyPath,
            type: 'added',
            newValue: recB[key],
            description: `Added property "${key}"`,
          });
        } else {
          compareRecursive(recA[key], recB[key], keyPath);
        }
      }
      return;
    }

    // Value changed
    entries.push({
      path,
      type: 'changed',
      oldValue: a,
      newValue: b,
      description: `Value changed from ${formatValue(a)} to ${formatValue(b)}`,
    });
  }

  compareRecursive(objA, objB, currentPath);

  const stats = {
    added: entries.filter((e) => e.type === 'added').length,
    removed: entries.filter((e) => e.type === 'removed').length,
    changed: entries.filter((e) => e.type === 'changed').length,
    unchanged: 0,
    total: entries.length,
  };

  return {
    entries,
    stats,
    hasChanges: entries.length > 0,
  };
}

/**
 * Compare two JSON string inputs. Returns both semantic tree diff and visual text diff.
 */
export function compareJsonStrings(
  rawA: string,
  rawB: string,
  options: { sortKeys?: boolean } = {}
): {
  parsedA: unknown;
  parsedB: unknown;
  formattedA: string;
  formattedB: string;
  semantic: JsonSemanticDiffResult;
  textDiff: DiffResult;
} {
  const parsedA = JSON.parse(rawA);
  const parsedB = JSON.parse(rawB);

  const finalA = options.sortKeys ? sortJsonKeys(parsedA) : parsedA;
  const finalB = options.sortKeys ? sortJsonKeys(parsedB) : parsedB;

  const formattedA = JSON.stringify(finalA, null, 2);
  const formattedB = JSON.stringify(finalB, null, 2);

  const semantic = computeJsonSemanticDiff(parsedA, parsedB);
  const textDiff = computeTextDiff(formattedA, formattedB);

  return {
    parsedA,
    parsedB,
    formattedA,
    formattedB,
    semantic,
    textDiff,
  };
}
