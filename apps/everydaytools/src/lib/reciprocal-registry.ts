import {
  type ReciprocalFormatType,
  type ReciprocalToolInfo,
} from './reciprocal-registry-types';
import { RECIPROCAL_DOCS_TOOLS } from './reciprocal-registry-docs';
import { RECIPROCAL_IMAGES_TOOLS } from './reciprocal-registry-images';

export type { ReciprocalFormatType, ReciprocalToolInfo };

export const RECIPROCAL_TOOLS: Record<string, ReciprocalToolInfo> = {
  ...RECIPROCAL_DOCS_TOOLS,
  ...RECIPROCAL_IMAGES_TOOLS,
};
