import React, { useState, useRef, useEffect } from 'react';
import { Pipette } from 'lucide-react';
import {
  ColorStudioPopover,
  useColorPickerHsv,
} from '@workspace/ui';

export interface ColorPickerProps {
  /** Hex color string (e.g. "#FF6B35" or "#18181B") */
  value: string;
  /** Callback fired when color changes */
  onChange: (hex: string) => void;
  /** Optional class name on the trigger wrapper */
  className?: string;
  /** Optional class name on the trigger button */
  triggerClassName?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Curated preset swatches (ignored - uses studio swatches in popover) */
  presets?: { label: string; hex: string }[];
  /** Optional custom trigger children */
  children?: React.ReactNode;
  /** Language flag */
  isFr?: boolean;
  /** Alignment relative to trigger */
  align?: 'start' | 'end' | 'auto';
  /** Preferred placement side */
  side?: 'top' | 'bottom' | 'auto';
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  className = '',
  triggerClassName,
  ariaLabel = 'Sélectionner une couleur',
  children,
  isFr = false,
  align = 'auto',
  side = 'auto',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | HTMLDivElement>(null);

  const [computedPlacement, setComputedPlacement] = useState<{ align: 'start' | 'end'; side: 'top' | 'bottom' }>({
    align: align === 'end' ? 'end' : 'start',
    side: side === 'top' ? 'top' : 'bottom',
  });

  useEffect(() => {
    if (!isOpen) return;
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 260;
    const popoverHeight = 350;

    const finalAlign = align === 'auto'
      ? (rect.left + popoverWidth > (typeof window !== 'undefined' ? window.innerWidth : 1024) - 16 ? 'end' : 'start')
      : align;

    const finalSide = side === 'auto'
      ? (rect.bottom + popoverHeight > (typeof window !== 'undefined' ? window.innerHeight : 768) - 16 ? 'top' : 'bottom')
      : side;

    setComputedPlacement({ align: finalAlign, side: finalSide });
  }, [isOpen, align, side]);

  const {
    hsv,
    hexInput,
    setHexInput,
    updateHsv,
    satValRef,
    hueRef,
    isDraggingSatVal,
    isDraggingHue,
    handleSatValMove,
    handleHueMove,
    hasEyeDropper,
    handleEyeDropper,
  } = useColorPickerHsv(value, onChange);

  const activeHex = value
    ? (value.startsWith('#') ? value : `#${value}`).toUpperCase()
    : '#FF6B35';

  // Fermeture au clic extérieur
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={popoverRef}>
      {children ? (
        <div
          ref={triggerRef as any}
          data-testid="color-picker-custom-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex cursor-pointer"
        >
          {children}
        </div>
      ) : (
        <button
          ref={triggerRef as any}
          type="button"
          data-testid="color-picker-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={ariaLabel}
          className={
            triggerClassName ??
            `h-9 px-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer shadow-2xs text-xs font-mono select-none active:scale-[0.98] ${
              isOpen
                ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
                : 'border-zinc-200/90 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:border-zinc-300 dark:hover:border-white/20 text-zinc-700 dark:text-zinc-300'
            }`
          }
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-4 h-4 rounded-full border border-black/15 dark:border-white/20 shrink-0 shadow-2xs"
              style={{ backgroundColor: activeHex }}
            />
            <span className="font-medium tracking-wide">
              {activeHex}
            </span>
          </div>
          <Pipette
            data-testid="color-picker-pipette"
            className="w-3.5 h-3.5 text-zinc-400 shrink-0"
          />
        </button>
      )}

      {/* POPUP STUDIO PARTAGÉ AVEC GRILLE DE NUANCES */}
      {isOpen && (
        <ColorStudioPopover
          activeHex={activeHex}
          onChange={onChange}
          onClose={() => setIsOpen(false)}
          hsv={hsv}
          hexInput={hexInput}
          setHexInput={setHexInput}
          updateHsv={updateHsv}
          satValRef={satValRef}
          hueRef={hueRef}
          handleSatValMove={handleSatValMove}
          handleHueMove={handleHueMove}
          isDraggingSatVal={isDraggingSatVal}
          isDraggingHue={isDraggingHue}
          hasEyeDropper={hasEyeDropper}
          handleEyeDropper={handleEyeDropper}
          isFr={isFr}
          align={computedPlacement.align}
          side={computedPlacement.side}
        />
      )}
    </div>
  );
};

export default ColorPicker;
