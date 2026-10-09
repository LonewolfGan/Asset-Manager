import React from 'react';
import type { IconShape } from '@/lib/favicon-logic';

export function ShapeGlyph({ shape }: { shape: IconShape }) {
  if (shape === 'square') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="0" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (shape === 'rounded') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (shape === 'squircle') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
        <path
          d="M 8 2 C 12.5 2 14 3.5 14 8 C 14 12.5 12.5 14 8 14 C 3.5 14 2 12.5 2 8 C 2 3.5 3.5 2 8 2 Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
