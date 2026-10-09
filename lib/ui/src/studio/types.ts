import React from 'react';

export interface StudioFileMeta {
  name: string;
  size: number;
  icon?: string;
  dimensions?: { width: number; height: number };
  pageCount?: number;
}

export interface StudioCommandBarProps {
  meta: StudioFileMeta;
  onReset: () => void;
  resetLabel?: string;
  isModified?: boolean;
  onResetChanges?: () => void;
  centerControls?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  primaryAction?: {
    label: string;
    loadingLabel?: string;
    onClick: () => void;
    isLoading?: boolean;
    isDisabled?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
  };
  actionSlot?: React.ReactNode;
}

export interface StudioResultCardProps {
  fileName: string;
  fileSize: number;
  originalSize?: number;
  fileIcon?: string;
  gain?: number;
  variant?: 'card' | 'monument';
  isFr?: boolean;
  onDownload: () => void;
  onReset: () => void;
  downloadLabel?: string;
  resetLabel?: string;
  nextActionsSlot?: React.ReactNode;
}

export interface StudioGeometryResultProps {
  fileName: string;
  previewUrl: string | null;
  origDimensions: { width: number; height: number };
  finalDimensions: { width: number; height: number };
  origRatioLabel?: string;
  finalRatioLabel?: string;
  sizeBefore: number;
  sizeAfter: number;
  onDownload: () => void;
  onBackToEditor: () => void;
  onReset: () => void;
  downloadLabel?: string;
  editLabel?: string;
  resetLabel?: string;
  isFr?: boolean;
}
