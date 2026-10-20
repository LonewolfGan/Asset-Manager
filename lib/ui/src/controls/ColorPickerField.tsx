import React, { useState, useRef, useEffect } from 'react';
import { Pipette, Palette } from 'lucide-react';
import type { ColorPickerFieldProps } from './types';
import { useColorPickerHsv } from './color-utils';
import { ColorStudioPopover } from './ColorStudioPopover';
import { cn } from '../utils';

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  label,
  value,
  onChange,
  showHexValue = true,
  placeholder,
  isFr = false,
  className = '',
  disabled = false,
  align = 'auto',
  side = 'auto',
  size = 'md',
  onOpen,
  isActive = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [computedPlacement, setComputedPlacement] = useState<{ align: 'start' | 'end'; side: 'top' | 'bottom' }>({
    align: align === 'end' ? 'end' : 'start',
    side: side === 'top' ? 'top' : 'bottom',
  });

  useEffect(() => {
    if (!isOpen) return;
    if (align !== 'auto' && side !== 'auto') return;
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

  const hasValue = Boolean(value && value.trim() !== '');
  const activeHex = hasValue
    ? (value.startsWith('#') ? value : `#${value}`).toUpperCase()
    : '#FF6B35';

  // Fermeture au clic extérieur et touche Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn('relative', label ? 'flex flex-col gap-2' : 'inline-flex items-center', className)} ref={popoverRef}>
      {/* En-tête : Libellé + Valeur Hexadécimale (uniquement si un libellé est fourni) */}
      {label && (
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </span>
          {showHexValue && hasValue && (
            <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
              {activeHex}
            </span>
          )}
        </div>
      )}

      {/* Déclencheur Studio : Pastille + HEX + Pipette */}
      <button
        ref={triggerRef}
        type="button"
        data-testid="color-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-pressed={isActive || isOpen}
        disabled={disabled}
        onClick={() => {
          const nextOpen = !isOpen;
          setIsOpen(nextOpen);
          if (nextOpen) {
            onOpen?.();
          }
        }}
        title={isFr ? 'Ouvrir le sélecteur de couleur' : 'Open color picker'}
        className={cn(
          'border flex items-center justify-between cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-100',
          size === 'sm'
            ? 'h-7 px-2 rounded-lg text-xs font-mono gap-1.5'
            : 'h-9 px-3 rounded-xl text-xs font-mono gap-2.5 shadow-2xs',
          isActive || isOpen
            ? 'border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
            : 'border-zinc-200/90 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:border-zinc-300 dark:hover:border-white/20 text-zinc-700 dark:text-zinc-300'
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {hasValue ? (
            <>
              <span
                className={cn(
                  'rounded-full border border-black/15 dark:border-white/20 shrink-0 shadow-2xs',
                  size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
                )}
                style={{ backgroundColor: activeHex }}
              />
              {showHexValue && (
                <span className="font-medium tracking-wide">
                  {activeHex}
                </span>
              )}
            </>
          ) : (
            <>
              <Palette
                className={cn('text-zinc-500 dark:text-zinc-400 shrink-0', size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')}
              />
              <span className="font-medium tracking-wide text-zinc-700 dark:text-zinc-300">
                {placeholder || (isFr ? 'Couleur' : 'Color')}
              </span>
            </>
          )}
        </div>
        <Pipette
          data-testid="color-picker-pipette"
          className={cn('text-zinc-400 shrink-0', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')}
        />
      </button>

      {/* POPUP STUDIO FLOTTANT AVEC GRILLE DE NUANCES */}
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
