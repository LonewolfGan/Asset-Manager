import { describe, it, expect } from 'vitest';
import {
  DASH_TOOLS,
  CATEGORIES,
  filterDashTools,
  groupToolsByCategory,
} from '@/lib/home-tools-data';

describe('Home Tools Data Logic (Phase RED)', () => {
  it('maps all tools with categories and icons', () => {
    expect(DASH_TOOLS.length).toBeGreaterThan(30);
    expect(CATEGORIES.length).toBe(8);
  });

  it('filters tools by search query across names and slugs', () => {
    const results = filterDashTools('pdf', DASH_TOOLS);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((t) => t.slug.includes('pdf') || t.name.toLowerCase().includes('pdf') || t.description.toLowerCase().includes('pdf'))).toBe(true);
  });

  it('groups tools by category according to defined category order', () => {
    const groups = groupToolsByCategory(DASH_TOOLS);
    expect(groups.length).toBeGreaterThan(0);
    expect(groups[0].cat.key).toBe('pdf');
    expect(groups[0].tools.length).toBeGreaterThan(0);
  });
});
