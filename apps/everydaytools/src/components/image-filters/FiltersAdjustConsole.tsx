import React from 'react';
import { SunMedium, Contrast, Droplet, Palette } from 'lucide-react';
import { GradingDial } from '@/components/ui/slider';
import type { FilterSettings } from '@/lib/image-filters-logic';

interface FiltersAdjustConsoleProps {
  settings: FilterSettings;
  onAdjustChannel: <K extends keyof FilterSettings>(channel: K, value: FilterSettings[K]) => void;
  onResetChannel: (channel: keyof FilterSettings) => void;
  isFr: boolean;
}

export function FiltersAdjustConsole({
  settings,
  onAdjustChannel,
  onResetChannel,
  isFr,
}: FiltersAdjustConsoleProps) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
      {/* Luminosité */}
      <GradingDial
        label={isFr ? 'Luminosité' : 'Brightness'}
        icon={<SunMedium className="w-3.5 h-3.5" />}
        value={settings.brightness}
        min={20}
        max={180}
        defaultValue={100}
        step={5}
        unit="%"
        isBipolar={true}
        onChange={(v) => onAdjustChannel('brightness', v)}
        onReset={() => onResetChannel('brightness')}
      />

      {/* Contraste */}
      <GradingDial
        label={isFr ? 'Contraste' : 'Contrast'}
        icon={<Contrast className="w-3.5 h-3.5" />}
        value={settings.contrast}
        min={20}
        max={180}
        defaultValue={100}
        step={5}
        unit="%"
        isBipolar={true}
        onChange={(v) => onAdjustChannel('contrast', v)}
        onReset={() => onResetChannel('contrast')}
      />

      {/* Saturation */}
      <GradingDial
        label={isFr ? 'Saturation' : 'Saturation'}
        icon={<Droplet className="w-3.5 h-3.5" />}
        value={settings.saturation}
        min={0}
        max={200}
        defaultValue={100}
        step={5}
        unit="%"
        isBipolar={true}
        onChange={(v) => onAdjustChannel('saturation', v)}
        onReset={() => onResetChannel('saturation')}
      />

      {/* Teinte (Hue Rotate) */}
      <GradingDial
        label={isFr ? 'Teinte (Hue)' : 'Hue'}
        icon={<Palette className="w-3.5 h-3.5" />}
        value={settings.hueRotate}
        min={0}
        max={360}
        defaultValue={0}
        step={5}
        unit="°"
        isBipolar={false}
        onChange={(v) => onAdjustChannel('hueRotate', v)}
        onReset={() => onResetChannel('hueRotate')}
      />

      {/* Chaleur Sépia */}
      <GradingDial
        label={isFr ? 'Chaleur Sépia' : 'Sepia Warmth'}
        value={settings.sepia}
        min={0}
        max={100}
        defaultValue={0}
        step={5}
        unit="%"
        isBipolar={false}
        onChange={(v) => onAdjustChannel('sepia', v)}
        onReset={() => onResetChannel('sepia')}
      />

      {/* Noir & Blanc */}
      <GradingDial
        label={isFr ? 'Noir & Blanc' : 'Black & White'}
        value={settings.grayscale}
        min={0}
        max={100}
        defaultValue={0}
        step={5}
        unit="%"
        isBipolar={false}
        onChange={(v) => onAdjustChannel('grayscale', v)}
        onReset={() => onResetChannel('grayscale')}
      />

      {/* Négatif */}
      <GradingDial
        label={isFr ? 'Négatif (Inverser)' : 'Negative (Invert)'}
        value={settings.invert}
        min={0}
        max={100}
        defaultValue={0}
        step={5}
        unit="%"
        isBipolar={false}
        onChange={(v) => onAdjustChannel('invert', v)}
        onReset={() => onResetChannel('invert')}
      />

      {/* Flou artistique */}
      <GradingDial
        label={isFr ? 'Flou artistique' : 'Artistic Blur'}
        value={settings.blur}
        min={0}
        max={15}
        defaultValue={0}
        step={0.5}
        unit="px"
        isBipolar={false}
        onChange={(v) => onAdjustChannel('blur', v)}
        onReset={() => onResetChannel('blur')}
      />
    </div>
  );
}
