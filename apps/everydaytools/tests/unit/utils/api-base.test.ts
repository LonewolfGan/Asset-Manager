import { describe, it, expect } from 'vitest';
import { apiUrl, API_BASE, formatFetchError, getResponseError } from '@/lib/apiBase';

describe('apiBase Utility Suite', () => {
  it('correctly formats local apiUrl paths', () => {
    expect(apiUrl('/api/tools/pdf-to-word')).toBe('/api/tools/pdf-to-word');
    expect(API_BASE).toBe('/api');
  });

  it('translates browser NetworkError into a clear actionable error message', () => {
    const networkErr = new TypeError('NetworkError when attempting to fetch resource.');
    const frMessage = formatFetchError(networkErr, true);
    const enMessage = formatFetchError(networkErr, false);

    expect(frMessage).toContain('Impossible de joindre le serveur API');
    expect(frMessage).toContain('3001');
    expect(enMessage).toContain('Unable to reach the API server');
    expect(enMessage).toContain('3001');
  });

  it('translates chrome Failed to fetch into a clear actionable error message', () => {
    const chromeErr = new TypeError('Failed to fetch');
    const msg = formatFetchError(chromeErr, true);

    expect(msg).toContain('Impossible de joindre le serveur API');
    expect(msg).toContain('3001');
  });

  it('preserves specific business logic errors that are not network drops', () => {
    const businessErr = new Error('Invalid document password');
    expect(formatFetchError(businessErr, true)).toBe('Invalid document password');
  });

  it('extracts human-readable messages from json response errors', async () => {
    const mockResponse = new Response(JSON.stringify({ message: 'Fichier corrompu' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

    const errorMsg = await getResponseError(mockResponse);
    expect(errorMsg).toBe('Fichier corrompu');
  });
});
