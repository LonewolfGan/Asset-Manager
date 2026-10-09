import React from 'react';

export interface CodeWorkspaceSplitProps {
  sourceTitle?: string;
  outputTitle?: string;
  sourceStats?: React.ReactNode;
  outputStats?: React.ReactNode;
  sourceActions?: React.ReactNode;
  outputActions?: React.ReactNode;
  sourceContent?: React.ReactNode;
  outputContent?: React.ReactNode;
  children?: React.ReactNode;
  footerSlot?: React.ReactNode;
  isDragOver?: boolean;
  dragMessage?: string;
  onDropFile?: (file: File) => void;
  isProcessing?: boolean;
  processingMessage?: string;
  className?: string;
  minHeight?: string | number;
}

export interface DocumentPageItem {
  id: string | number;
  pageNumber: number;
  dataUrl?: string;
  isSelected?: boolean;
  isRotated?: boolean;
  rotationDeg?: number;
  orderIndex?: number;
  badge?: string;
}

export interface DocumentPageGridProps {
  pages: DocumentPageItem[];
  selectedCount?: number;
  isLoading?: boolean;
  loadingMessage?: string;
  loadingProgress?: { current: number; total: number };
  isFr?: boolean;
  emptyMessage?: string;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onSelectOdd?: () => void;
  onSelectEven?: () => void;
  headerSlot?: React.ReactNode;
  renderPageCard?: (page: DocumentPageItem, index: number) => React.ReactNode;
  className?: string;
  gridRef?: React.Ref<HTMLDivElement>;
  onPointerDownGrid?: (e: React.PointerEvent) => void;
}
