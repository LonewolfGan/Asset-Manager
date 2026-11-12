import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  UserChatAvatar,
  AssistantChatAvatar,
  BORING_BEAM_COLORS,
} from '@/components/blog/blog-chat-avatars';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('BlogChatAvatars (Harmonized White Features)', () => {
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
    document.body.innerHTML = '';
  });

  it('renders UserChatAvatar with boring-avatars beam SVG and exact palette', async () => {
    await act(async () => {
      root.render(React.createElement(UserChatAvatar, { name: 'User Question' }));
    });

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(container.textContent).not.toBe('Q');
    expect(BORING_BEAM_COLORS).toEqual([
      '#723e4e',
      '#b03851',
      '#ef3353',
      '#f17144',
      '#f4b036',
    ]);
  });

  it('harmonizes eyes and mouth elements strictly to white for names with light wrapper colors', async () => {
    // 'Is my data secure?' in default boring-avatars produces black (#000000) eyes and mouth
    await act(async () => {
      root.render(React.createElement(UserChatAvatar, { name: 'Is my data secure?' }));
    });

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();

    // Verify face elements (rect for eyes, path for mouth) inside the face group
    const innerFaceGroup = svg?.querySelectorAll('g > g');
    expect(innerFaceGroup?.length).toBe(1);

    const faceRects = innerFaceGroup![0].querySelectorAll('rect');
    expect(faceRects.length).toBe(2); // Two eyes
    faceRects.forEach((rect) => {
      expect(rect.getAttribute('fill')).toBe('#FFFFFF');
    });

    const facePath = innerFaceGroup![0].querySelector('path');
    expect(facePath).not.toBeNull();
    const mouthColor = facePath?.getAttribute('stroke') || facePath?.getAttribute('fill');
    expect(mouthColor).toBe('#FFFFFF');
  });

  it('harmonizes AssistantChatAvatar face elements strictly to white', async () => {
    await act(async () => {
      root.render(React.createElement(AssistantChatAvatar, { name: 'EverydayTools Assistant' }));
    });

    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();

    const innerFaceGroup = svg?.querySelectorAll('g > g');
    expect(innerFaceGroup?.length).toBe(1);

    const faceRects = innerFaceGroup![0].querySelectorAll('rect');
    expect(faceRects.length).toBe(2);
    faceRects.forEach((rect) => {
      expect(rect.getAttribute('fill')).toBe('#FFFFFF');
    });

    const facePath = innerFaceGroup![0].querySelector('path');
    expect(facePath).not.toBeNull();
    const mouthColor = facePath?.getAttribute('stroke') || facePath?.getAttribute('fill');
    expect(mouthColor).toBe('#FFFFFF');
  });
});
