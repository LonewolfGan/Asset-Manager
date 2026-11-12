import { describe, it, expect, beforeEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import {
  getReciprocalTool,
  getReciprocalPath,
  RECIPROCAL_TOOLS,
} from '@/lib/reciprocal-tools';
import {
  setHandoffFile,
  consumeHandoffFile,
  setHandoffText,
  consumeHandoffText,
} from '@/lib/file-handoff';
import { ReciprocalDirectionTabs } from '@/components/conversion/ReciprocalDirectionTabs';

describe('Reciprocal Tools Integration Suite', () => {
  beforeEach(() => {
    consumeHandoffFile();
    consumeHandoffText();
  });

  it('guarantees bidirectional reciprocity for all registered canonical pairs', () => {
    for (const [slug, info] of Object.entries(RECIPROCAL_TOOLS)) {
      if (info.unidirectional) continue;
      const mirror = getReciprocalTool(info.mirrorSlug!);
      expect(mirror, `Expected mirror for ${info.mirrorSlug} to exist`).toBeDefined();
      if (!info.isVariant) {
        expect(mirror?.mirrorSlug, `Expected reciprocal cycle for ${slug}`).toBe(slug);
      }
    }
  });

  it('stages file during direction tab click', () => {
    const dummyFile = new File(['test,data'], 'test.csv', { type: 'text/csv' });
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);

    act(() => {
      root.render(
        React.createElement(ReciprocalDirectionTabs, {
          currentSlug: 'csv-to-json',
          isFr: false,
          getCurrentFile: () => dummyFile,
        })
      );
    });

    const buttons = div.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    act(() => {
      buttons[1]?.click();
    });

    const transferred = consumeHandoffFile();
    expect(transferred?.name).toBe('test.csv');

    act(() => {
      root.unmount();
    });
    div.remove();
  });

  it('stages text during direction tab click', () => {
    const textData = '{"col": "val"}';
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);

    act(() => {
      root.render(
        React.createElement(ReciprocalDirectionTabs, {
          currentSlug: 'json-to-csv',
          isFr: false,
          getCurrentText: () => textData,
        })
      );
    });

    const buttons = div.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    act(() => {
      buttons[0]?.click();
    });

    const transferredText = consumeHandoffText();
    expect(transferredText).toBe(textData);

    act(() => {
      root.unmount();
    });
    div.remove();
  });

  it('correctly resolves paths across French and English locales', () => {
    expect(getReciprocalPath('/csv-to-json', 'json-to-csv')).toBe('/json-to-csv');
    expect(getReciprocalPath('/fr/csv-to-json', 'json-to-csv')).toBe('/fr/json-to-csv');
    expect(getReciprocalPath('/en/csv-to-json', 'json-to-csv')).toBe('/en/json-to-csv');
  });

  it('verifies ReciprocalDirectionTabs renders in correct canonical order for Word and PDF', () => {
    const tabs = getReciprocalTool('word-to-pdf');
    expect(tabs).not.toBeNull();
    expect(tabs?.mirrorSlug).toBe('pdf-to-word');
  });

  it('guarantees directional tool titles without double-arrow in translations', async () => {
    const { TRANSLATIONS } = await import('@/i18n/translations');
    expect(TRANSLATIONS.EN.tools['csv-to-json'].title).toBe('CSV to JSON');
    expect(TRANSLATIONS.FR.tools['csv-to-json'].title).toBe('CSV en JSON');
    expect(TRANSLATIONS.EN.tools['json-to-csv']?.title).toBe('JSON to CSV');
    expect(TRANSLATIONS.FR.tools['json-to-csv']?.title).toBe('JSON en CSV');
  });
});

