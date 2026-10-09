import React, { useState } from 'react';
import { Pipette, X, Copy, Check } from 'lucide-react';
import {
  hexToRgb,
  rgbToHsv,
  isLightColor,
  CURATED_STUDIO_SWATCHES,
  type HsvColor,
} from './color-utils';

export interface ColorStudioPopoverProps {
  activeHex: string;
  onChange: (hex: string) => void;
  onClose: () => void;
  hsv: HsvColor;
  hexInput: string;
  setHexInput: (hex: string) => void;
  updateHsv: (hsv: HsvColor) => void;
  satValRef: React.RefObject<HTMLDivElement | null>;
  hueRef: React.RefObject<HTMLDivElement | null>;
  handleSatValMove: (clientX: number, clientY: number) => void;
  handleHueMove: (clientX: number) => void;
  isDraggingSatVal: React.MutableRefObject<boolean>;
  isDraggingHue: React.MutableRefObject<boolean>;
  hasEyeDropper: boolean;
  handleEyeDropper: () => void;
  isFr?: boolean;
}

export const ColorStudioPopover: React.FC<ColorStudioPopoverProps> = ({
  activeHex,
  onChange,
  onClose,
  hsv,
  hexInput,
  setHexInput,
  updateHsv,
  satValRef,
  hueRef,
  handleSatValMove,
  handleHueMove,
  isDraggingSatVal,
  isDraggingHue,
  hasEyeDropper,
  handleEyeDropper,
  isFr = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(activeHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      data-testid="color-picker-popover"
      className="absolute top-full left-0 mt-2 z-50 w-64 p-3 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-white/15 shadow-2xl space-y-3 select-none"
    >
      {/* En-tête popover */}
      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/15 dark:border-white/20 shrink-0 shadow-2xs"
            style={{ backgroundColor: activeHex }}
          />
          <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 font-mono">
            {isFr ? 'Sélecteur de couleur' : 'Color Studio'}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. Canvas 2D Saturation / Luminosité (Gradient fluide) */}
      <div
        ref={satValRef}
        onPointerDown={(e) => {
          isDraggingSatVal.current = true;
          handleSatValMove(e.clientX, e.clientY);
        }}
        className="relative w-full h-32 rounded-xl overflow-hidden cursor-crosshair touch-none shadow-inner border border-black/5 dark:border-white/10"
        style={{
          backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #FFFFFF, transparent)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent, #000000)',
          }}
        />
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2 ring-1 ring-black/40"
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            backgroundColor: activeHex,
          }}
        />
      </div>

      {/* 2. Barre de contrôle : Pipette écran + Curseur Spectre Rainbow + Pastille d'aperçu */}
      <div className="flex items-center gap-2">
        {hasEyeDropper && (
          <button
            type="button"
            onClick={handleEyeDropper}
            title={isFr ? "Prélever à l'écran" : 'Eyedropper'}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-750 transition-colors cursor-pointer shrink-0 active:scale-95"
          >
            <Pipette className="w-3.5 h-3.5" />
          </button>
        )}

        <div
          ref={hueRef}
          onPointerDown={(e) => {
            isDraggingHue.current = true;
            handleHueMove(e.clientX);
          }}
          className="relative flex-1 h-3 rounded-full cursor-pointer touch-none shadow-inner border border-black/5 dark:border-white/10"
          style={{
            background:
              'linear-gradient(to right, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)',
          }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border border-black/20 shadow-md pointer-events-none"
            style={{
              left: `${(hsv.h / 360) * 100}%`,
            }}
          />
        </div>

        <div
          className="w-7 h-7 rounded-lg border border-black/10 dark:border-white/15 shrink-0 shadow-2xs"
          style={{ backgroundColor: activeHex }}
        />
      </div>

      {/* 3. Saisie Hexadécimale + Copie */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <span className="absolute left-2.5 text-[10px] font-mono text-zinc-400 font-semibold select-none">
            HEX
          </span>
          <input
            type="text"
            data-testid="color-hex-input"
            value={hexInput}
            onChange={(e) => {
              let val = e.target.value.toUpperCase();
              if (!val.startsWith('#')) val = '#' + val;
              setHexInput(val);
              if (/^#[0-9A-F]{6}$/i.test(val)) {
                const rgb = hexToRgb(val);
                updateHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
              }
            }}
            maxLength={7}
            placeholder="#FF6B35"
            className="w-full h-7 pl-10 pr-2 text-xs font-mono font-medium rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 uppercase focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
          />
        </div>

        <button
          type="button"
          onClick={handleCopy}
          title={isFr ? 'Copier le code HEX' : 'Copy HEX'}
          className="h-7 w-7 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center cursor-pointer transition-colors shrink-0"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* 4. Grille de Nuances en-popover (Figma / Linear style) */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold select-none">
          {isFr ? 'Nuances' : 'Swatches'}
        </span>
        <div
          className="grid grid-cols-6 gap-1"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '4px' }}
        >
          {CURATED_STUDIO_SWATCHES.map((hex) => {
            const isSelected = activeHex.toLowerCase() === hex.toLowerCase();
            const isLight = isLightColor(hex);

            return (
              <button
                key={hex}
                type="button"
                data-testid="popover-swatch-btn"
                title={hex}
                onClick={() => {
                  const rgb = hexToRgb(hex);
                  updateHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
                  onChange(hex);
                }}
                className={`h-5 rounded-md relative flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                  isLight
                    ? 'border border-zinc-300 dark:border-zinc-700'
                    : 'border border-black/10 dark:border-white/15'
                } ${
                  isSelected
                    ? 'scale-105 border-2 border-zinc-950 dark:border-white shadow-xs z-10'
                    : 'hover:scale-105 opacity-90 hover:opacity-100'
                }`}
                style={{ backgroundColor: hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 stroke-[2.5] ${
                      isLight ? 'text-zinc-950' : 'text-white'
                    } drop-shadow-xs`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
