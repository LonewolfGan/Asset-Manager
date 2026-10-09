import { describe, it, expect } from 'vitest';
import {
  convertData,
  parseData,
  serializeData,
} from '../../../src/lib/data-converter-logic';

describe('data-converter-logic', () => {
  const sampleJson = JSON.stringify([
    { id: 1, name: 'Alpha', role: 'Admin' },
    { id: 2, name: 'Beta', role: 'Dev' },
  ]);

  it('converts JSON to CSV accurately', () => {
    const res = convertData(sampleJson, 'json', 'csv');
    expect(res.success).toBe(true);
    expect(res.output).toContain('id,name,role');
    expect(res.output).toContain('1,Alpha,Admin');
    expect(res.output).toContain('2,Beta,Dev');
  });

  it('converts CSV to JSON accurately', () => {
    const csv = `id,name,role\n1,Alpha,Admin\n2,Beta,Dev`;
    const res = convertData(csv, 'csv', 'json');
    expect(res.success).toBe(true);
    const parsed = JSON.parse(res.output);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe('Alpha');
  });

  it('converts JSON to YAML and back', () => {
    const yamlRes = convertData(sampleJson, 'json', 'yaml');
    expect(yamlRes.success).toBe(true);
    expect(yamlRes.output).toContain('name: Alpha');

    const jsonBack = convertData(yamlRes.output, 'yaml', 'json');
    expect(jsonBack.success).toBe(true);
    const backParsed = JSON.parse(jsonBack.output);
    expect(backParsed[1].name).toBe('Beta');
  });

  it('converts JSON to XML and back', () => {
    const xmlRes = convertData(sampleJson, 'json', 'xml');
    expect(xmlRes.success).toBe(true);
    expect(xmlRes.output).toContain('<name>Alpha</name>');

    const jsonBack = convertData(xmlRes.output, 'xml', 'json');
    expect(jsonBack.success).toBe(true);
    expect(jsonBack.output).toContain('Alpha');
  });

  it('handles invalid syntax gracefully with informative error', () => {
    const invalidJson = `{ id: 1, name: broken `;
    const res = convertData(invalidJson, 'json', 'csv');
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });
});
