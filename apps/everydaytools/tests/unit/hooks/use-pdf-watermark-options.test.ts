import { describe, it, expect, beforeEach, afterEach } from 'vitest';
// TDD GREEN: use-pdf-watermark-options hook tests
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  usePdfWatermarkOptions,
  type UsePdfWatermarkOptionsProps,
} from '@/hooks/use-pdf-watermark-options';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePdfWatermarkOptions (Unit Test)', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function renderHook(props?: UsePdfWatermarkOptionsProps) {
    let hookValue!: ReturnType<typeof usePdfWatermarkOptions>;
    function TestComponent() {
      hookValue = usePdfWatermarkOptions(props);
      return null;
    }
    act(() => {
      root.render(React.createElement(TestComponent));
    });
    return {
      get current() {
        return hookValue;
      },
    };
  }

  it('initializes with default watermark options', () => {
    const hook = renderHook();

    expect(hook.current.text).toBe('CONFIDENTIAL');
    expect(hook.current.opacity).toBe(0.3);
    expect(hook.current.angle).toBe(45);
    expect(hook.current.color).toBe('#FF0000');
    expect(hook.current.fontSize).toBe(48);
    expect(hook.current.position).toBe('center');
    expect(hook.current.pattern).toBe('single');
    expect(hook.current.pages).toBe('all');
    expect(hook.current.imageFile).toBeNull();
    expect(hook.current.watermarkType).toBe('text');
    expect(hook.current.isValid).toBe(true);
  });

  it('updates text, opacity, angle, fontSize, and color', () => {
    const hook = renderHook();

    act(() => {
      hook.current.setText('TOP SECRET');
      hook.current.setOpacity(0.6);
      hook.current.setAngle(0);
      hook.current.setFontSize(64);
      hook.current.setColor('#0000FF');
    });

    expect(hook.current.text).toBe('TOP SECRET');
    expect(hook.current.opacity).toBe(0.6);
    expect(hook.current.angle).toBe(0);
    expect(hook.current.fontSize).toBe(64);
    expect(hook.current.color).toBe('#0000FF');
    expect(hook.current.isValid).toBe(true);
  });

  it('updates position, pattern, and pages scope', () => {
    const hook = renderHook();

    act(() => {
      hook.current.setPosition('top-right');
      hook.current.setPattern('repeat');
      hook.current.setPages('1');
    });

    expect(hook.current.position).toBe('top-right');
    expect(hook.current.pattern).toBe('repeat');
    expect(hook.current.pages).toBe('1');
  });

  it('updates imageFile and automatically switches watermarkType to image', () => {
    const hook = renderHook();
    const mockImage = new File(['mock content'], 'stamp.png', { type: 'image/png' });

    act(() => {
      hook.current.setImageFile(mockImage);
    });

    expect(hook.current.imageFile).toBe(mockImage);
    expect(hook.current.watermarkType).toBe('image');
    expect(hook.current.isValid).toBe(true);
  });

  it('marks isValid as false when text is blank and no image is attached', () => {
    const hook = renderHook();

    act(() => {
      hook.current.setText('   ');
      hook.current.setImageFile(null);
    });

    expect(hook.current.isValid).toBe(false);
  });

  it('resets options cleanly to default state', () => {
    const hook = renderHook();
    const mockImage = new File(['mock content'], 'stamp.png', { type: 'image/png' });

    act(() => {
      hook.current.setText('MODIFIED TEXT');
      hook.current.setOpacity(0.9);
      hook.current.setAngle(-45);
      hook.current.setColor('#123456');
      hook.current.setFontSize(24);
      hook.current.setPosition('bottom-left');
      hook.current.setPattern('repeat');
      hook.current.setImageFile(mockImage);
    });

    act(() => {
      hook.current.resetOptions();
    });

    expect(hook.current.text).toBe('CONFIDENTIAL');
    expect(hook.current.opacity).toBe(0.3);
    expect(hook.current.angle).toBe(45);
    expect(hook.current.color).toBe('#FF0000');
    expect(hook.current.fontSize).toBe(48);
    expect(hook.current.position).toBe('center');
    expect(hook.current.pattern).toBe('single');
    expect(hook.current.imageFile).toBeNull();
    expect(hook.current.watermarkType).toBe('text');
    expect(hook.current.isValid).toBe(true);
  });
});
