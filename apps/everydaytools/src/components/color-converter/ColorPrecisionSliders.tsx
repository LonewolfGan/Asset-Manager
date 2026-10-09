import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { rgbToHex, hslToRgb } from '@/lib/color-converter-logic';
import type { ColorConverterWorkflow } from '@/hooks/use-color-converter-workflow';

interface ColorPrecisionSlidersProps {
  workflow: ColorConverterWorkflow;
  isFr: boolean;
}

export function ColorPrecisionSliders({
  workflow,
  isFr,
}: ColorPrecisionSlidersProps) {
  const {
    rgb,
    hsl,
    controlMode,
    setControlMode,
    updateRgb,
    addToRecent,
  } = workflow;

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-200/80 dark:border-white/10">
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-zinc-500">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isFr ? 'Ajuster par curseurs' : 'Adjust with sliders'}</span>
        </div>

        <Tabs
          value={controlMode}
          onValueChange={(val) => setControlMode(val as 'rgb' | 'hsl')}
          className="w-auto"
        >
          <TabsList className="h-7 bg-zinc-100 dark:bg-zinc-800 p-0.5">
            <TabsTrigger
              value="rgb"
              className="text-[10px] px-2.5 h-6 font-mono font-bold"
            >
              RGB
            </TabsTrigger>
            <TabsTrigger
              value="hsl"
              className="text-[10px] px-2.5 h-6 font-mono font-bold"
            >
              HSL
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {controlMode === 'rgb' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-28 shrink-0 whitespace-nowrap font-bold text-zinc-500 dark:text-zinc-400">
              {isFr ? 'R (Rouge)' : 'R (Red)'}
            </span>
            <div className="flex-1">
              <Slider
                value={[rgb.r]}
                min={0}
                max={255}
                step={1}
                onValueChange={([val]) => updateRgb({ ...rgb, r: val }, true, false)}
                onValueCommit={([val]) => addToRecent(rgbToHex({ ...rgb, r: val }))}
              />
            </div>
            <span className="w-10 text-right font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              {rgb.r}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-28 shrink-0 whitespace-nowrap font-bold text-zinc-500 dark:text-zinc-400">
              {isFr ? 'G (Vert)' : 'G (Green)'}
            </span>
            <div className="flex-1">
              <Slider
                value={[rgb.g]}
                min={0}
                max={255}
                step={1}
                onValueChange={([val]) => updateRgb({ ...rgb, g: val }, true, false)}
                onValueCommit={([val]) => addToRecent(rgbToHex({ ...rgb, g: val }))}
              />
            </div>
            <span className="w-10 text-right font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              {rgb.g}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-28 shrink-0 whitespace-nowrap font-bold text-zinc-500 dark:text-zinc-400">
              {isFr ? 'B (Bleu)' : 'B (Blue)'}
            </span>
            <div className="flex-1">
              <Slider
                value={[rgb.b]}
                min={0}
                max={255}
                step={1}
                onValueChange={([val]) => updateRgb({ ...rgb, b: val }, true, false)}
                onValueCommit={([val]) => addToRecent(rgbToHex({ ...rgb, b: val }))}
              />
            </div>
            <span className="w-10 text-right font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              {rgb.b}
            </span>
          </div>
        </div>
      )}

      {controlMode === 'hsl' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-28 shrink-0 whitespace-nowrap font-bold text-zinc-500 dark:text-zinc-400">
              {isFr ? 'H (Teinte)' : 'H (Hue)'}
            </span>
            <div className="flex-1">
              <Slider
                value={[hsl.h]}
                min={0}
                max={360}
                step={1}
                onValueChange={([val]) =>
                  updateRgb(hslToRgb({ ...hsl, h: val }), true, false)
                }
                onValueCommit={([val]) =>
                  addToRecent(rgbToHex(hslToRgb({ ...hsl, h: val })))
                }
              />
            </div>
            <span className="w-10 text-right font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              {hsl.h}°
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-28 shrink-0 whitespace-nowrap font-bold text-zinc-500 dark:text-zinc-400">
              {isFr ? 'S (Saturation)' : 'S (Saturation)'}
            </span>
            <div className="flex-1">
              <Slider
                value={[hsl.s]}
                min={0}
                max={100}
                step={1}
                onValueChange={([val]) =>
                  updateRgb(hslToRgb({ ...hsl, s: val }), true, false)
                }
                onValueCommit={([val]) =>
                  addToRecent(rgbToHex(hslToRgb({ ...hsl, s: val })))
                }
              />
            </div>
            <span className="w-10 text-right font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              {hsl.s}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-28 shrink-0 whitespace-nowrap font-bold text-zinc-500 dark:text-zinc-400">
              {isFr ? 'L (Luminosité)' : 'L (Lightness)'}
            </span>
            <div className="flex-1">
              <Slider
                value={[hsl.l]}
                min={0}
                max={100}
                step={1}
                onValueChange={([val]) =>
                  updateRgb(hslToRgb({ ...hsl, l: val }), true, false)
                }
                onValueCommit={([val]) =>
                  addToRecent(rgbToHex(hslToRgb({ ...hsl, l: val })))
                }
              />
            </div>
            <span className="w-10 text-right font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              {hsl.l}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
