import React from 'react';

export interface ColorPreset {
  label: string;
  hex: string;
}

export interface ColorPickerFieldProps {
  label?: string;
  value: string;
  onChange: (hex: string) => void;
  presets?: ColorPreset[];
  showHexInput?: boolean;
  showHexValue?: boolean;
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
  align?: 'start' | 'end' | 'auto';
  side?: 'top' | 'bottom' | 'auto';
}

export interface DimensionLockGroupProps {
  width: number;
  height: number;
  onWidthChange: (w: number) => void;
  onHeightChange: (h: number) => void;
  isLocked?: boolean;
  onToggleLock?: () => void;
  unit?: 'px' | '%';
  onUnitChange?: (unit: 'px' | '%') => void;
  onSwap?: () => void;
  disabled?: boolean;
  isFr?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

export interface CropRatioItem {
  id: string;
  name: string;
  nameEn: string;
  ratio: number | null;
}

export interface CropRatioSelectorProps {
  selectedRatio: string;
  onSelectRatio: (ratio: CropRatioItem) => void;
  ratios?: CropRatioItem[];
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface ZoomControlGroupProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom?: () => void;
  onFitScreen?: () => void;
  minScale?: number;
  maxScale?: number;
  step?: number;
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface QualityPreset {
  id: string;
  label: string;
  value: number;
}

export interface QualitySliderFieldProps {
  value: number;
  onChange: (val: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  presets?: QualityPreset[];
  estimatedLabel?: string;
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface PageRangeSelectorProps {
  value: string;
  onChange: (val: string) => void;
  totalPages: number;
  label?: string;
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
}

export type PlacementPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface PositionPlacementGridProps {
  position: PlacementPosition;
  onSelectPosition: (pos: PlacementPosition) => void;
  label?: string;
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordSecureFieldProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  showStrength?: boolean;
  allowGenerate?: boolean;
  allowCopy?: boolean;
  onGenerate?: () => void;
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export interface HashAlgorithmItem {
  id: string;
  name: string;
  bits?: number;
  recommended?: boolean;
  legacy?: boolean;
}

export interface HashAlgorithmPillsProps {
  selectedAlgorithm: string;
  onSelectAlgorithm: (algorithm: string) => void;
  algorithms?: HashAlgorithmItem[];
  label?: string;
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface DelimiterOption {
  id: string;
  labelFr: string;
  labelEn: string;
  value: string;
}

export interface DelimiterRadioGroupProps {
  value: string;
  onChange: (val: string) => void;
  options?: DelimiterOption[];
  allowCustom?: boolean;
  label?: string;
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface DataPreviewTableLiteProps {
  headers: string[];
  rows: (string | number | null | undefined)[][];
  totalRows?: number;
  maxRows?: number;
  label?: string;
  isFr?: boolean;
  className?: string;
  emptyMessage?: string;
}

export interface EncodingOption {
  id: string;
  label: string;
  nameFr?: string;
  nameEn?: string;
}

export interface EncodingSelectorProps {
  value: string;
  onChange: (val: string) => void;
  options?: EncodingOption[];
  label?: string;
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
}

export type CaseTransformType = 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab';

export interface CaseOption {
  id: CaseTransformType;
  labelFr: string;
  labelEn: string;
  preview: string;
}

export interface CaseTransformButtonGroupProps {
  value?: CaseTransformType;
  onSelectCase: (caseType: CaseTransformType) => void;
  options?: CaseOption[];
  label?: string;
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface FormatOption {
  id: string;
  label: string;
  extension?: string;
  mimeType?: string;
  badge?: string;
}

export interface FormatPillsSelectorProps {
  value: string;
  onChange: (format: string) => void;
  formats?: FormatOption[];
  label?: string;
  isFr?: boolean;
  className?: string;
  disabled?: boolean;
}

export interface FileSizeBadgeProps {
  bytes?: number;
  originalBytes?: number;
  compressedBytes?: number;
  showSavings?: boolean;
  isFr?: boolean;
  className?: string;
}

export interface MetadataViewerGridProps {
  data: Record<string, string | number | boolean | null | undefined>;
  allowSearch?: boolean;
  allowRemove?: boolean;
  onRemoveTag?: (key: string) => void;
  label?: string;
  isFr?: boolean;
  className?: string;
}

export type BatchItemStatus = 'idle' | 'processing' | 'success' | 'error';

export interface BatchItemData {
  id: string;
  name: string;
  size?: number;
  status: BatchItemStatus;
  progress?: number;
  errorMessage?: string;
}

export interface BatchItemRowProps {
  item: BatchItemData;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  onDownload?: (id: string) => void;
  isFr?: boolean;
  className?: string;
}
