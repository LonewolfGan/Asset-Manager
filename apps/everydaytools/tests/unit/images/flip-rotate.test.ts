import { describe, it, expect } from 'vitest';
import {
  normalizeRotation,
  getTransformCss,
  INITIAL_TRANSFORM_STATE,
} from '../../../src/lib/flip-rotate-logic';

describe('flip-rotate-logic', () => {
  it('normalizes negative and arbitrary degree rotations between 0 and 359', () => {
    expect(normalizeRotation(90)).toBe(90);
    expect(normalizeRotation(-90)).toBe(270);
    expect(normalizeRotation(360)).toBe(0);
    expect(normalizeRotation(450)).toBe(90);
  });

  it('generates correct CSS transform string based on rotation and flips', () => {
    expect(getTransformCss(0, false, false)).toBe('none');
    expect(getTransformCss(90, false, false)).toBe('rotate(90deg)');
    expect(getTransformCss(0, true, false)).toBe('scale(-1, 1)');
    expect(getTransformCss(180, true, true)).toBe('rotate(180deg) scale(-1, -1)');
  });

  it('defines valid initial transform state', () => {
    expect(INITIAL_TRANSFORM_STATE.rotation).toBe(0);
    expect(INITIAL_TRANSFORM_STATE.flipH).toBe(false);
    expect(INITIAL_TRANSFORM_STATE.flipV).toBe(false);
  });
});
