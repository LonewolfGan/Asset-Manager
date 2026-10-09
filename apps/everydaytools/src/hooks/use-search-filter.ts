import { useMemo } from 'react';
import { tools } from '@/config/tools.config';

export type ToolConfig = (typeof tools)[number];

const SUGGESTED_SLUGS = [
  'pdf-to-word',
  'png-to-webp',
  'background-remover',
  'password-generator',
  'metadata-cleaner',
  'unit-converter',
];

export function useSearchFilter(query: string, toolTranslations: Record<string, any>) {
  const trimmed = query.trim().toLowerCase();

  const results: ToolConfig[] = useMemo(() => {
    if (!trimmed) {
      return tools
        .filter((item) => SUGGESTED_SLUGS.includes(item.slug))
        .sort((a, b) => SUGGESTED_SLUGS.indexOf(a.slug) - SUGGESTED_SLUGS.indexOf(b.slug));
    }

    return tools
      .filter((item) => {
        const titleEn = item.title.toLowerCase();
        const descEn = item.description.toLowerCase();
        const titleLoc = (toolTranslations[item.slug]?.title ?? '').toLowerCase();
        const descLoc = (toolTranslations[item.slug]?.description ?? '').toLowerCase();
        return (
          titleEn.includes(trimmed) ||
          descEn.includes(trimmed) ||
          titleLoc.includes(trimmed) ||
          descLoc.includes(trimmed) ||
          item.formats.some((f) => f.toLowerCase().includes(trimmed))
        );
      })
      .slice(0, 9);
  }, [trimmed, toolTranslations]);

  return { results, trimmed };
}
