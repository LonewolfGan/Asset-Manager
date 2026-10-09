import type { LibraryIcon } from './types';
import { SOCIAL_ICONS } from './social';
import { WEB_ICONS } from './web';
import { BUSINESS_ICONS } from './business';
import { SYMBOLS_ICONS } from './symbols';
import { getPresetIconSvg as getSvgWithLib } from './types';

export * from './types';
export * from './social';
export * from './web';
export * from './business';
export * from './symbols';
export * from './adapter';

export const ICON_LIBRARY: LibraryIcon[] = [
  ...SOCIAL_ICONS,
  ...WEB_ICONS,
  ...BUSINESS_ICONS,
  ...SYMBOLS_ICONS,
];

export const QUICK_FAVORITE_ICONS = ['whatsapp', 'instagram', 'globe', 'wifi', 'mail', 'phone'];

export function getPresetIconSvg(iconId: string, color: string): string {
  return getSvgWithLib(iconId, color, ICON_LIBRARY);
}
