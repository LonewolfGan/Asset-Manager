import type { LucideIcon } from 'lucide-react';
import type { SimpleIcon } from 'simple-icons';
import type { LibraryIcon } from './types';

/**
 * Extracts inner SVG elements (paths, circles, rects, lines...) from a Lucide icon component
 * using its internal iconNode representation without requiring react-dom/server.
 */
export function extractLucideSvgPath(IconComponent: LucideIcon): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elem = (IconComponent as any).render?.({}, null);
    const iconNode = elem?.props?.iconNode as [string, Record<string, string>][] | undefined;
    if (!iconNode || !Array.isArray(iconNode)) return '';

    return iconNode
      .map(([tag, attrs]) => {
        const attrStr = Object.entries(attrs)
          .filter(([key]) => key !== 'key')
          .map(([key, val]) => `${key}="${val}"`)
          .join(' ');
        return `<${tag} ${attrStr}/>`;
      })
      .join('');
  } catch {
    return '';
  }
}

export function createLucideLibraryIcon(
  id: string,
  label: string,
  category: LibraryIcon['category'],
  IconComponent: LucideIcon
): LibraryIcon {
  return {
    id,
    label,
    category,
    path: extractLucideSvgPath(IconComponent),
    renderMode: 'stroke',
  };
}

export function createSimpleIconLibraryIcon(
  id: string,
  label: string,
  category: LibraryIcon['category'],
  simpleIcon: SimpleIcon
): LibraryIcon {
  return {
    id,
    label,
    category,
    path: `<path d="${simpleIcon.path}"/>`,
    renderMode: 'fill',
  };
}

