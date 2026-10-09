import { describe, it, expect } from 'vitest';
import {
  executeRegex,
  REGEX_PRESETS,
} from '@/lib/regex-logic';

describe('Regex Tester Logic', () => {
  it('correctly matches emails in text and splits segments for visual highlighting', () => {
    const preset = REGEX_PRESETS[0]; // Email
    const res = executeRegex(preset.pattern, preset.flags, preset.sample);
    expect(res.isValid).toBe(true);
    expect(res.matches.length).toBe(2);
    expect(res.matches[0].match).toBe('dev@everydaytools.org');
    expect(res.matches[1].match).toBe('support@cloud.fr');
    expect(res.segments.some((s) => s.isMatch && s.text === 'dev@everydaytools.org')).toBe(true);
  });

  it('correctly extracts named capture groups', () => {
    const preset = REGEX_PRESETS.find((p) => p.name.includes('Date'))!;
    const res = executeRegex(preset.pattern, preset.flags, 'Event on 2026-03-09.');
    expect(res.isValid).toBe(true);
    expect(res.matches.length).toBe(1);
    expect(res.matches[0].namedGroups).toBeDefined();
    expect(res.matches[0].namedGroups?.year).toBe('2026');
    expect(res.matches[0].namedGroups?.month).toBe('03');
    expect(res.matches[0].namedGroups?.day).toBe('09');
  });

  it('performs substitutions with replacement text and group backreferences', () => {
    const pattern = '(\\w+)@(\\w+)\\.org';
    const text = 'Contact alex@company.org now.';
    const res = executeRegex(pattern, 'g', text, '$1 at $2');
    expect(res.replacedText).toBe('Contact alex at company now.');
  });

  it('handles invalid regex patterns gracefully without throwing uncaught errors', () => {
    const invalidPattern = '[unclosed-bracket';
    const res = executeRegex(invalidPattern, 'g', 'sample');
    expect(res.isValid).toBe(false);
    expect(res.error).toBeDefined();
    expect(res.matches.length).toBe(0);
  });
});
