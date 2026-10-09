import { describe, it, expect } from 'vitest';
import {
  encodeUrl,
  decodeUrl,
  parseUrlDetails,
  encodeUrlLines,
  decodeUrlLines,
  removeQueryParam,
} from '../../../src/lib/url-logic';

describe('url-logic', () => {
  it('encodes component preserving or encoding characters properly', () => {
    const raw = 'name=Alexandre Martin&role=dev/ops';
    expect(encodeUrl(raw, 'component')).toBe('name%3DAlexandre%20Martin%26role%3Ddev%2Fops');
    expect(encodeUrl(raw, 'full')).toBe('name=Alexandre%20Martin&role=dev/ops');
    expect(encodeUrl(raw, 'form')).toBe('name%3DAlexandre+Martin%26role%3Ddev%2Fops');
  });

  it('decodes percent-encoded and plus-encoded URLs', () => {
    expect(decodeUrl('hello%20world%21')).toBe('hello world!');
    expect(decodeUrl('hello+world%21')).toBe('hello world!');
  });

  it('parses URL components and query parameters accurately', () => {
    const url = 'https://everydaytools.app/tools/search?q=pdf+converter&lang=fr&page=2#results';
    const res = parseUrlDetails(url);

    expect(res.isValid).toBe(true);
    expect(res.protocol).toBe('https:');
    expect(res.host).toBe('everydaytools.app');
    expect(res.pathname).toBe('/tools/search');
    expect(res.hash).toBe('#results');
    expect(res.params).toHaveLength(3);
    expect(res.params[0]).toEqual({ key: 'q', value: 'pdf converter' });
    expect(res.params[1]).toEqual({ key: 'lang', value: 'fr' });
    expect(res.params[2]).toEqual({ key: 'page', value: '2' });
  });

  it('processes multiline input line-by-line seamlessly', () => {
    const lines = 'https://example.com/a?q=café\nhttps://example.com/b?q=thé';
    const encoded = encodeUrlLines(lines, 'component');
    const decoded = decodeUrlLines(encoded);
    expect(decoded).toBe(lines);
  });

  it('removes an individual query parameter from a URL', () => {
    const url = 'https://example.com/list?page=1&sort=desc&limit=20';
    const updated = removeQueryParam(url, 'sort');
    expect(updated).toBe('https://example.com/list?page=1&limit=20');
  });
});
