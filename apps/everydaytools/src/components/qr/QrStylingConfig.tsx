import React from 'react';
import { DotStyle, EyeStyle } from '@/lib/qr-code-logic';
import { IconSwatch } from '@/lib/qr-code-swatches';
import { QrShapeConfig } from './QrShapeConfig';
import { QrLogoConfig } from './QrLogoConfig';

export interface QrStylingConfigProps {
  isFr: boolean;
  dotStyle: DotStyle;
  setDotStyle: (v: DotStyle) => void;
  eyeStyle: EyeStyle;
  setEyeStyle: (v: EyeStyle) => void;
  logoUrl: string | null;
  clearLogo: () => void;
  logoScale: number;
  setLogoScale: (v: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setIsIconModalOpen: (v: boolean) => void;
  activePresetId: string | null;
  selectPresetIcon: (id: string) => void;
  iconColor: string;
  handleIconColorChange: (c: string) => void;
  availableIconSwatches: IconSwatch[];
}

export function QrStylingConfig({
  isFr,
  dotStyle,
  setDotStyle,
  eyeStyle,
  setEyeStyle,
  logoUrl,
  clearLogo,
  logoScale,
  setLogoScale,
  fileInputRef,
  setIsIconModalOpen,
  activePresetId,
  selectPresetIcon,
  iconColor,
  handleIconColorChange,
  availableIconSwatches,
}: QrStylingConfigProps) {
  return (
    <div className="flex flex-col gap-5 pb-7 border-b border-zinc-200/70 dark:border-white/10">
      <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
        {isFr ? 'Style & Personnalisation' : 'Styling & Branding'}
      </span>

      <QrShapeConfig
        isFr={isFr}
        dotStyle={dotStyle}
        setDotStyle={setDotStyle}
        eyeStyle={eyeStyle}
        setEyeStyle={setEyeStyle}
      />

      <QrLogoConfig
        isFr={isFr}
        eyeStyle={eyeStyle}
        logoUrl={logoUrl}
        clearLogo={clearLogo}
        logoScale={logoScale}
        setLogoScale={setLogoScale}
        fileInputRef={fileInputRef}
        setIsIconModalOpen={setIsIconModalOpen}
        activePresetId={activePresetId}
        selectPresetIcon={selectPresetIcon}
        iconColor={iconColor}
        handleIconColorChange={handleIconColorChange}
        availableIconSwatches={availableIconSwatches}
      />
    </div>
  );
}
