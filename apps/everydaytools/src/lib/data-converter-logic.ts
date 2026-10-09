import Papa from 'papaparse';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import * as yaml from 'js-yaml';

export type DataFormat = 'json' | 'csv' | 'xml' | 'yaml';

export interface ConversionResult {
  success: boolean;
  output: string;
  error?: string;
  itemCount?: number;
}

/**
 * Parse raw string input into a structured JavaScript object or array
 */
export function parseData(input: string, format: DataFormat): unknown {
  const trimmed = input.trim();
  if (!trimmed) return null;

  switch (format) {
    case 'json': {
      return JSON.parse(trimmed);
    }
    case 'csv': {
      const res = Papa.parse<Record<string, unknown>>(trimmed, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
      if (res.errors.length > 0 && res.data.length === 0) {
        throw new Error(res.errors[0].message);
      }
      return res.data;
    }
    case 'xml': {
      const parser = new XMLParser({
        ignoreAttributes: false,
        parseAttributeValue: true,
        trimValues: true,
      });
      return parser.parse(trimmed);
    }
    case 'yaml': {
      return yaml.load(trimmed);
    }
    default:
      throw new Error(`Format source non pris en charge: ${format}`);
  }
}

/**
 * Serialize JavaScript value into target format string
 */
export function serializeData(data: unknown, format: DataFormat): string {
  if (data === null || data === undefined) return '';

  switch (format) {
    case 'json': {
      return JSON.stringify(data, null, 2);
    }
    case 'csv': {
      let arrayData: unknown[] = [];
      if (Array.isArray(data)) {
        arrayData = data;
      } else if (typeof data === 'object') {
        // If object has a root list, extract it
        const keys = Object.keys(data as Record<string, unknown>);
        const firstVal = (data as Record<string, unknown>)[keys[0]];
        if (Array.isArray(firstVal)) {
          arrayData = firstVal;
        } else {
          arrayData = [data];
        }
      } else {
        arrayData = [{ value: data }];
      }
      return Papa.unparse(arrayData as Record<string, unknown>[]);
    }
    case 'xml': {
      const builder = new XMLBuilder({
        format: true,
        ignoreAttributes: false,
        indentBy: '  ',
      });
      const rootObj =
        typeof data === 'object' && data !== null && !Array.isArray(data)
          ? data
          : { root: { item: data } };
      return builder.build(rootObj);
    }
    case 'yaml': {
      return yaml.dump(data, { indent: 2, lineWidth: -1 });
    }
    default:
      throw new Error(`Format cible non pris en charge: ${format}`);
  }
}

/**
 * Universal conversion pipeline
 */
export function convertData(
  input: string,
  from: DataFormat,
  to: DataFormat
): ConversionResult {
  if (!input.trim()) {
    return { success: true, output: '', itemCount: 0 };
  }

  try {
    const parsed = parseData(input, from);
    const output = serializeData(parsed, to);
    const itemCount = Array.isArray(parsed)
      ? parsed.length
      : parsed && typeof parsed === 'object'
      ? Object.keys(parsed).length
      : 1;

    return {
      success: true,
      output,
      itemCount,
    };
  } catch (err) {
    return {
      success: false,
      output: '',
      error: err instanceof Error ? err.message : 'Erreur de conversion de format',
    };
  }
}
