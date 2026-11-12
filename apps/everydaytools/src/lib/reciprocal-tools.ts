import {
  type ReciprocalFormatType,
  type ReciprocalToolInfo,
  RECIPROCAL_TOOLS,
} from './reciprocal-registry';

export type { ReciprocalFormatType, ReciprocalToolInfo };
export { RECIPROCAL_TOOLS };

export function getReciprocalTool(slug: string): ReciprocalToolInfo | null {
  if (!slug) return null;
  return RECIPROCAL_TOOLS[slug] ?? null;
}

export function getReciprocalPath(currentLocation: string, mirrorSlug: string): string {
  if (!mirrorSlug) return '/';
  if (currentLocation.startsWith('/fr/')) {
    return `/fr/${mirrorSlug}`;
  }
  if (currentLocation.startsWith('/en/')) {
    return `/en/${mirrorSlug}`;
  }
  return `/${mirrorSlug}`;
}

export interface ReciprocalTab {
  slug: string;
  label: string;
  isActive: boolean;
  sourceFormat?: ReciprocalFormatType;
}

export function getReciprocalTabs(
  currentSlug: string,
  isFr: boolean
): [ReciprocalTab, ReciprocalTab] | null {
  const currentInfo = RECIPROCAL_TOOLS[currentSlug];
  if (!currentInfo || !currentInfo.mirrorSlug || currentInfo.unidirectional) return null;

  const mirrorInfo = RECIPROCAL_TOOLS[currentInfo.mirrorSlug];
  if (!mirrorInfo) return null;

  const isCurrentPrimary = Boolean(currentInfo.isPrimary);
  const lang = isFr ? 'fr' : 'en';

  const currentTab: ReciprocalTab = {
    slug: currentSlug,
    label: `${currentInfo.sourceLabel[lang]} → ${currentInfo.targetLabel[lang]}`,
    isActive: true,
    sourceFormat: currentInfo.sourceFormat,
  };

  const mirrorTab: ReciprocalTab = {
    slug: currentInfo.mirrorSlug,
    label: `${mirrorInfo.sourceLabel[lang]} → ${mirrorInfo.targetLabel[lang]}`,
    isActive: false,
    sourceFormat: mirrorInfo.sourceFormat,
  };

  return isCurrentPrimary ? [currentTab, mirrorTab] : [mirrorTab, currentTab];
}
