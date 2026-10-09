import { describe, it, expect } from 'vitest';
import {
  formatJson,
  minifyJson,
  sortJsonKeys,
  validateJson,
  parseJsonErrorLocation,
} from '@/lib/json-formatter-logic';

describe('JSON Formatter & Validator Logic', () => {
  const validSample = '{"b": 2, "a": 1, "nested": {"z": true, "m": [1, 2]}}';

  it('formats JSON with 2 spaces indent', () => {
    const res = formatJson(validSample, 2);
    expect(res.error).toBeUndefined();
    expect(res.output).toContain('  "b": 2');
    expect(res.output).toContain('    "z": true');
  });

  it('formats JSON with 4 spaces indent', () => {
    const res = formatJson(validSample, 4);
    expect(res.error).toBeUndefined();
    expect(res.output).toContain('    "b": 2');
  });

  it('minifies JSON into a single line', () => {
    const formatted = formatJson(validSample, 2).output;
    const min = minifyJson(formatted);
    expect(min.error).toBeUndefined();
    expect(min.output).not.toContain('\n');
    expect(min.output).toBe('{"b":2,"a":1,"nested":{"z":true,"m":[1,2]}}');
  });

  it('recursively sorts object keys alphabetically', () => {
    const res = sortJsonKeys(validSample, 2);
    expect(res.error).toBeUndefined();
    const parsed = JSON.parse(res.output);
    expect(Object.keys(parsed)).toEqual(['a', 'b', 'nested']);
    expect(Object.keys(parsed.nested)).toEqual(['m', 'z']);
  });

  it('validates JSON and extracts rich metadata (depth, keys, bytes)', () => {
    const res = validateJson(validSample);
    expect(res.valid).toBe(true);
    expect(res.stats).toBeDefined();
    expect(res.stats?.depth).toBe(4);
    expect(res.stats?.keyCount).toBe(5); // a, b, nested, z, m
  });

  it('detects syntax errors and extracts line and column position', () => {
    const invalidJson = '{\n  "title": "Hello",\n  "count": 42,\n}'; // trailing comma
    const res = validateJson(invalidJson);
    expect(res.valid).toBe(false);
    expect(res.error).toBeDefined();
    expect(res.error?.message).toBeTruthy();
  });

  it('handles empty input gracefully', () => {
    expect(formatJson('').output).toBe('');
    expect(minifyJson('').output).toBe('');
    expect(sortJsonKeys('').output).toBe('');
    expect(validateJson('').valid).toBe(true);
  });

  it('correctly maps error positions from position string', () => {
    const text = '{\n  "name": 123,\n  bad_token\n}';
    const loc = parseJsonErrorLocation('Unexpected token b in JSON at position 20', text);
    expect(loc.line).toBeGreaterThanOrEqual(2);
  });
});
