import { useState, useRef, useEffect, useCallback } from 'react';
import {
  type ViewMode,
  type BackdropType,
  getStageBackgroundStyle,
} from '@/lib/background-remover-logic';

export function useBackgroundRemoverBackdrop() {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [backdropType, setBackdropType] = useState<BackdropType>('transparent');
  const [customColor, setCustomColor] = useState<string>('#2563eb');
  const [customBgFile, setCustomBgFile] = useState<File | null>(null);
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const customBgInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (customBgUrl) URL.revokeObjectURL(customBgUrl);
    };
  }, [customBgUrl]);

  const handleCustomBgChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (customBgUrl) {
      URL.revokeObjectURL(customBgUrl);
    }
    const url = URL.createObjectURL(file);
    setCustomBgFile(file);
    setCustomBgUrl(url);
    setBackdropType('image');
    e.target.value = '';
  }, [customBgUrl]);

  const resetBackdrop = useCallback(() => {
    if (customBgUrl) {
      URL.revokeObjectURL(customBgUrl);
      setCustomBgUrl(null);
      setCustomBgFile(null);
    }
    setViewMode('split');
    setBackdropType('transparent');
  }, [customBgUrl]);

  const stageBackgroundStyle = getStageBackgroundStyle(
    viewMode,
    backdropType,
    customColor,
    customBgUrl
  );

  return {
    viewMode,
    setViewMode,
    backdropType,
    setBackdropType,
    customColor,
    setCustomColor,
    customBgFile,
    customBgUrl,
    customBgInputRef,
    stageBackgroundStyle,
    handleCustomBgChange,
    resetBackdrop,
  };
}
