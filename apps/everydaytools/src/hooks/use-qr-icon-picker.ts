import { useState, useMemo } from 'react';
import { ICON_LIBRARY } from '@/lib/qr-icons';

export type IconCategory = 'all' | 'web' | 'social' | 'business' | 'symbols';

export function useQrIconPicker() {
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  const [iconCategory, setIconCategory] = useState<IconCategory>('all');

  const filteredLibraryIcons = useMemo(() => {
    return ICON_LIBRARY.filter((item) => {
      const matchesCat = iconCategory === 'all' || item.category === iconCategory;
      const matchesSearch =
        !iconSearchQuery.trim() ||
        item.label.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(iconSearchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [iconCategory, iconSearchQuery]);

  return {
    isIconModalOpen,
    setIsIconModalOpen,
    iconSearchQuery,
    setIconSearchQuery,
    iconCategory,
    setIconCategory,
    filteredLibraryIcons,
  };
}
