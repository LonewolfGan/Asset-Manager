/**
 * Pure logic for aligned line diff, unified diff, and semantic deltas.
 */

export type DiffViewMode = 'split' | 'unified' | 'table';

export interface SemanticDelta {
  path: string;
  type: 'add' | 'remove' | 'modify';
  oldValue?: any;
  newValue?: any;
}

export interface AlignedLine {
  lineNumLeft?: number;
  lineNumRight?: number;
  textLeft?: string;
  textRight?: string;
  typeLeft?: 'same' | 'remove' | 'modify' | 'empty';
  typeRight?: 'same' | 'add' | 'modify' | 'empty';
}

export interface UnifiedLine {
  lineNumLeft?: number;
  lineNumRight?: number;
  type: 'same' | 'add' | 'remove';
  text: string;
}

/**
 * Analyse sémantique d'arbres récursive (calcul des deltas par chemin)
 */
export function computeSemanticDeltas(objA: any, objB: any, path = ''): SemanticDelta[] {
  const deltas: SemanticDelta[] = [];

  const isObjectA = objA !== null && typeof objA === 'object' && !Array.isArray(objA);
  const isObjectB = objB !== null && typeof objB === 'object' && !Array.isArray(objB);

  const isArrayA = Array.isArray(objA);
  const isArrayB = Array.isArray(objB);

  // Cas 1: Les deux sont des objets
  if (isObjectA && isObjectB) {
    const allKeys = Array.from(new Set([...Object.keys(objA), ...Object.keys(objB)])).sort();
    for (const key of allKeys) {
      const childPath = path ? `${path}.${key}` : key;
      if (!(key in objA)) {
        deltas.push({ path: childPath, type: 'add', newValue: objB[key] });
      } else if (!(key in objB)) {
        deltas.push({ path: childPath, type: 'remove', oldValue: objA[key] });
      } else {
        deltas.push(...computeSemanticDeltas(objA[key], objB[key], childPath));
      }
    }
    return deltas;
  }

  // Cas 2: Les deux sont des tableaux
  if (isArrayA && isArrayB) {
    const maxLen = Math.max(objA.length, objB.length);
    for (let i = 0; i < maxLen; i++) {
      const childPath = `${path}[${i}]`;
      if (i >= objA.length) {
        deltas.push({ path: childPath, type: 'add', newValue: objB[i] });
      } else if (i >= objB.length) {
        deltas.push({ path: childPath, type: 'remove', oldValue: objA[i] });
      } else {
        deltas.push(...computeSemanticDeltas(objA[i], objB[i], childPath));
      }
    }
    return deltas;
  }

  // Cas 3: Types différents ou valeurs primitives différentes
  if (JSON.stringify(objA) !== JSON.stringify(objB)) {
    deltas.push({
      path: path || 'root',
      type: 'modify',
      oldValue: objA,
      newValue: objB,
    });
  }

  return deltas;
}

/**
 * Calcul du diff de lignes alignées pour la vue côte à côte
 */
export function computeAlignedLineDiff(linesA: string[], linesB: string[]): AlignedLine[] {
  const result: AlignedLine[] = [];
  let i = 0;
  let j = 0;

  while (i < linesA.length || j < linesB.length) {
    if (i < linesA.length && j < linesB.length) {
      if (linesA[i] === linesB[j]) {
        result.push({
          lineNumLeft: i + 1,
          lineNumRight: j + 1,
          textLeft: linesA[i],
          textRight: linesB[j],
          typeLeft: 'same',
          typeRight: 'same',
        });
        i++;
        j++;
      } else {
        // Recherche de correspondance plus bas
        const matchInB = linesB.indexOf(linesA[i], j);
        const matchInA = linesA.indexOf(linesB[j], i);

        if (matchInB !== -1 && (matchInA === -1 || matchInB - j <= matchInA - i)) {
          // B a des lignes ajoutées
          while (j < matchInB) {
            result.push({
              lineNumRight: j + 1,
              textRight: linesB[j],
              typeRight: 'add',
              typeLeft: 'empty',
            });
            j++;
          }
        } else if (matchInA !== -1) {
          // A a des lignes supprimées
          while (i < matchInA) {
            result.push({
              lineNumLeft: i + 1,
              textLeft: linesA[i],
              typeLeft: 'remove',
              typeRight: 'empty',
            });
            i++;
          }
        } else {
          // Ligne modifiée
          result.push({
            lineNumLeft: i + 1,
            lineNumRight: j + 1,
            textLeft: linesA[i],
            textRight: linesB[j],
            typeLeft: 'modify',
            typeRight: 'modify',
          });
          i++;
          j++;
        }
      }
    } else if (i < linesA.length) {
      result.push({
        lineNumLeft: i + 1,
        textLeft: linesA[i],
        typeLeft: 'remove',
        typeRight: 'empty',
      });
      i++;
    } else {
      result.push({
        lineNumRight: j + 1,
        textRight: linesB[j],
        typeRight: 'add',
        typeLeft: 'empty',
      });
      j++;
    }
  }

  return result;
}

/**
 * Calcul du diff unifié
 */
export function computeUnifiedDiff(linesA: string[], linesB: string[]): UnifiedLine[] {
  const aligned = computeAlignedLineDiff(linesA, linesB);
  const unified: UnifiedLine[] = [];

  for (const item of aligned) {
    if (item.typeLeft === 'same') {
      unified.push({
        lineNumLeft: item.lineNumLeft,
        lineNumRight: item.lineNumRight,
        type: 'same',
        text: item.textLeft ?? '',
      });
    } else {
      if (item.typeLeft === 'remove' || item.typeLeft === 'modify') {
        unified.push({
          lineNumLeft: item.lineNumLeft,
          type: 'remove',
          text: item.textLeft ?? '',
        });
      }
      if (item.typeRight === 'add' || item.typeRight === 'modify') {
        unified.push({
          lineNumRight: item.lineNumRight,
          type: 'add',
          text: item.textRight ?? '',
        });
      }
    }
  }

  return unified;
}

export const DEFAULT_LEFT = `{
  "appName": "EverydayTools",
  "version": "1.0.0",
  "port": 5000,
  "features": [
    "conversion",
    "privacy",
    "calculators"
  ],
  "author": "Lonewolf",
  "debug": false
}`;

export const DEFAULT_RIGHT = `{
  "appName": "EverydayTools Hub",
  "version": "1.2.0",
  "port": 5000,
  "features": [
    "conversion",
    "privacy",
    "calculators",
    "ocr"
  ],
  "author": "Lonewolf",
  "debug": true,
  "theme": "zinc"
}`;
