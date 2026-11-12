import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { BlogContentRenderer } from '@/components/blog/blog-content-renderer';
import type { ContentBlock } from '@/config/blog-data';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('BlogContentRenderer - FAQ Dialogue Hub & Boring Avatars', () => {
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

  const renderComponent = async (props: { blocks?: ContentBlock[]; className?: string }) => {
    await act(async () => {
      root.render(React.createElement(BlogContentRenderer, props));
    });
  };

  const faqBlocks: ContentBlock[] = [
    { type: 'h2', text: 'Frequently asked questions' },
    { type: 'h3', text: 'Is it free?' },
    { type: 'p', text: 'Yes, completely free with no limits.' },
    { type: 'h3', text: 'Is my data secure?' },
    { type: 'p', text: 'Your files are processed locally on your machine.' },
  ];

  it('renders monumental FAQ typographic centerpiece in the dialogue hub', async () => {
    await renderComponent({ blocks: faqBlocks });

    const monument = container.querySelector('[data-testid="blog-faq-monument"]');
    expect(monument).not.toBeNull();
    expect(monument?.textContent?.trim()).toBe('FAQ');
  });

  it('groups FAQ items into tactile message boxes with disclosure summaries', async () => {
    await renderComponent({ blocks: faqBlocks });

    const faqSection = container.querySelector('[data-testid="blog-faq-section"]');
    expect(faqSection).not.toBeNull();

    const details = container.querySelectorAll('details[data-testid="blog-faq-item"]');
    expect(details.length).toBe(2);

    const summaries = container.querySelectorAll('summary');
    expect(summaries.length).toBe(2);

    expect(summaries[0].textContent).toContain('Is it free?');
    expect(summaries[1].textContent).toContain('Is my data secure?');
  });

  it('preserves anchored heading IDs within FAQ questions for TOC scrolling', async () => {
    await renderComponent({ blocks: faqBlocks });

    const h2 = container.querySelector('h2');
    expect(h2?.getAttribute('id')).toBe('frequently-asked-questions');

    const h3Elements = container.querySelectorAll('h3');
    expect(h3Elements.length).toBe(2);
    expect(h3Elements[0].getAttribute('id')).toBe('is-it-free');
    expect(h3Elements[1].getAttribute('id')).toBe('is-my-data-secure');
  });

  it('has the first FAQ question open by default for immediate discoverability', async () => {
    await renderComponent({ blocks: faqBlocks });

    const details = container.querySelectorAll('details[data-testid="blog-faq-item"]');
    expect(details[0].hasAttribute('open')).toBe(true);
    expect(details[1].hasAttribute('open')).toBe(false);
  });

  it('renders dedicated Boring Avatars beam graphic vector avatars without fallback text initials', async () => {
    await renderComponent({ blocks: faqBlocks });

    const userAvatars = container.querySelectorAll('[data-testid="user-chat-avatar"]');
    expect(userAvatars.length).toBe(2);
    expect(userAvatars[0].querySelector('svg')).not.toBeNull();
    expect(userAvatars[0].textContent).not.toBe('Q');

    const assistantAvatars = container.querySelectorAll('[data-testid="assistant-chat-avatar"]');
    expect(assistantAvatars.length).toBe(2);
    expect(assistantAvatars[0].querySelector('svg')).not.toBeNull();
    expect(assistantAvatars[0].textContent).not.toBe('ET');
  });
});
