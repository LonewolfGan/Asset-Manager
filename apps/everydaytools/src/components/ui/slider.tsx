import * as React from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/ui/tooltip";

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: number[] | number;
  defaultValue?: number[] | number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  onChange?: (value: number) => void;
  onReset?: () => void;
  showSteppers?: boolean;
  isBipolar?: boolean;
  bipolarCenter?: number;
  trackClassName?: string;
  fillClassName?: string;
  // Optional Header integration
  label?: React.ReactNode;
  icon?: React.ReactNode;
  unit?: string;
  showValue?: boolean;
  formatValue?: (val: number) => string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      onValueChange,
      onValueCommit,
      onChange,
      onReset,
      showSteppers = true,
      isBipolar = false,
      bipolarCenter,
      trackClassName,
      fillClassName,
      label,
      icon,
      unit = '%',
      showValue = true,
      formatValue,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined;
    const resolvedMin = Number.isFinite(min) ? min : 0;
    const resolvedMax = Number.isFinite(max) && max > resolvedMin ? max : resolvedMin + 100;
    const resolvedStep = Number.isFinite(step) && step > 0 ? step : 1;

    // Internal state for uncontrolled mode
    const [internalVal, setInternalVal] = React.useState<number>(() => {
      if (defaultValue !== undefined) {
        return Array.isArray(defaultValue) ? (defaultValue[0] ?? resolvedMin) : defaultValue;
      }
      return resolvedMin;
    });

    const currentVal = React.useMemo(() => {
      const raw = isControlled
        ? (Array.isArray(value) ? (value[0] ?? resolvedMin) : (value ?? resolvedMin))
        : internalVal;
      return Math.max(resolvedMin, Math.min(resolvedMax, raw));
    }, [isControlled, value, internalVal, resolvedMin, resolvedMax]);

    const updateValue = React.useCallback(
      (nextVal: number) => {
        if (disabled) return;
        const stepped = Math.round((nextVal - resolvedMin) / resolvedStep) * resolvedStep + resolvedMin;
        const precision = resolvedStep.toString().split('.')[1]?.length || 0;
        const clamped = Number(Math.max(resolvedMin, Math.min(resolvedMax, stepped)).toFixed(precision));

        if (!isControlled) {
          setInternalVal(clamped);
        }
        onValueChange?.([clamped]);
        onChange?.(clamped);
      },
      [disabled, resolvedMin, resolvedMax, resolvedStep, isControlled, onValueChange, onChange]
    );

    const trackRef = React.useRef<HTMLDivElement>(null);
    const isDraggingRef = React.useRef(false);

    const updateFromPointer = React.useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track || disabled) return;
        const rect = track.getBoundingClientRect();
        if (rect.width <= 0) return;
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const rawVal = resolvedMin + pct * (resolvedMax - resolvedMin);
        updateValue(rawVal);
      },
      [disabled, resolvedMin, resolvedMax, updateValue]
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      isDraggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      updateFromPointer(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current || disabled) return;
      updateFromPointer(e.clientX);
    };

    const currentValRef = React.useRef(currentVal);
    currentValRef.current = currentVal;

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        try {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        } catch {
          // pointer capture might already be released
        }
        onValueCommit?.([currentValRef.current]);
      }
    };

    const handleDecrement = (e: React.MouseEvent) => {
      e.stopPropagation();
      const next = currentVal - resolvedStep;
      updateValue(next);
      onValueCommit?.([Math.max(resolvedMin, next)]);
    };

    const handleIncrement = (e: React.MouseEvent) => {
      e.stopPropagation();
      const next = currentVal + resolvedStep;
      updateValue(next);
      onValueCommit?.([Math.min(resolvedMax, next)]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      let handled = true;
      const range = resolvedMax - resolvedMin;
      const largeStep = Math.max(resolvedStep * 10, range / 10);

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          updateValue(currentVal - resolvedStep);
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          updateValue(currentVal + resolvedStep);
          break;
        case 'PageDown':
          updateValue(currentVal - largeStep);
          break;
        case 'PageUp':
          updateValue(currentVal + largeStep);
          break;
        case 'Home':
          updateValue(resolvedMin);
          break;
        case 'End':
          updateValue(resolvedMax);
          break;
        default:
          handled = false;
      }

      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const defaultNum = defaultValue !== undefined
      ? (Array.isArray(defaultValue) ? defaultValue[0] : defaultValue)
      : undefined;

    const handleReset = React.useCallback(() => {
      if (disabled) return;
      if (onReset) {
        onReset();
      } else if (defaultNum !== undefined && typeof defaultNum === 'number') {
        updateValue(defaultNum);
      }
    }, [disabled, onReset, defaultNum, updateValue]);

    const isModified = defaultNum !== undefined ? currentVal !== defaultNum : false;

    // Visual gauge fill calculation
    const gaugeStyle = React.useMemo(() => {
      const range = resolvedMax - resolvedMin;
      if (range <= 0) return { left: '0%', width: '0%' };

      if (isBipolar) {
        const center = bipolarCenter !== undefined
          ? bipolarCenter
          : (defaultNum !== undefined && typeof defaultNum === 'number'
              ? defaultNum
              : (resolvedMin + resolvedMax) / 2);
        const centerPct = Math.max(0, Math.min(100, ((center - resolvedMin) / range) * 100));
        const currentPct = Math.max(0, Math.min(100, ((currentVal - resolvedMin) / range) * 100));

        if (currentPct >= centerPct) {
          return {
            left: `${centerPct}%`,
            width: `${currentPct - centerPct}%`,
          };
        } else {
          return {
            left: `${currentPct}%`,
            width: `${centerPct - currentPct}%`,
          };
        }
      } else {
        const currentPct = Math.max(0, Math.min(100, ((currentVal - resolvedMin) / range) * 100));
        return {
          left: '0%',
          width: `${currentPct}%`,
        };
      }
    }, [currentVal, resolvedMin, resolvedMax, isBipolar, bipolarCenter, defaultNum]);

    // Format display string
    const formattedDisplay = React.useMemo(() => {
      if (formatValue) return formatValue(currentVal);
      if (isBipolar && defaultNum !== undefined && typeof defaultNum === 'number') {
        const delta = currentVal - defaultNum;
        const sign = delta > 0 ? '+' : '';
        return `${sign}${delta}${unit}`;
      }
      if (unit === 'px') return `${currentVal} px`;
      if (unit === '°') return `${currentVal}°`;
      if (unit === '%') return `${currentVal}%`;
      return unit ? `${currentVal}${unit}` : `${currentVal}`;
    }, [currentVal, formatValue, isBipolar, defaultNum, unit]);

    const gaugeBar = (
      <div
        className={cn(
          "h-8 flex items-center gap-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 p-1 select-none",
          disabled && "opacity-40 pointer-events-none cursor-not-allowed",
          !label && className
        )}
      >
        {/* Step Minus */}
        {showSteppers && (
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || currentVal <= resolvedMin}
            aria-label="Diminuer"
            className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 active:scale-[0.92] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <Minus className="w-3 h-3" />
          </button>
        )}

        {/* Interactive Track Area */}
        <div
          ref={trackRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuenow={currentVal}
          aria-valuemin={resolvedMin}
          aria-valuemax={resolvedMax}
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={handleReset}
          className={cn(
            "relative flex-1 h-5 rounded-md bg-zinc-200/70 dark:bg-zinc-800/80 overflow-hidden cursor-ew-resize touch-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B35]",
            trackClassName
          )}
        >
          {/* Active Gauge Fill */}
          <div
            style={gaugeStyle}
            className={cn(
              "absolute top-0 bottom-0 bg-[#FF6B35] transition-[width,left] duration-75",
              fillClassName
            )}
          />

          {/* Bipolar Center Mark */}
          {isBipolar && (
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -ml-px bg-zinc-400 dark:bg-zinc-500 z-10 pointer-events-none" />
          )}
        </div>

        {/* Step Plus */}
        {showSteppers && (
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || currentVal >= resolvedMax}
            aria-label="Augmenter"
            className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 active:scale-[0.92] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>
    );

    if (!label) {
      return (
        <div ref={ref} {...props} className={cn(!label && className)}>
          {gaugeBar}
        </div>
      );
    }

    return (
      <div ref={ref} {...props} className={cn("space-y-1.5 select-none", className)}>
        {/* Label & Value Header */}
        <div className="flex items-center justify-between text-xs">
          {onReset || defaultNum !== undefined ? (
            <ActionTooltip label="Double-clic pour réinitialiser" side="top">
              <div
                onDoubleClick={handleReset}
                className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer"
              >
                {icon && <span className="text-zinc-400 dark:text-zinc-500">{icon}</span>}
                <span>{label}</span>
              </div>
            </ActionTooltip>
          ) : (
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium">
              {icon && <span className="text-zinc-400 dark:text-zinc-500">{icon}</span>}
              <span>{label}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {showValue && (
              <span
                className={cn(
                  "font-mono text-[11px] font-semibold",
                  isModified ? "text-[#FF6B35]" : "text-zinc-600 dark:text-zinc-400"
                )}
              >
                {formattedDisplay}
              </span>
            )}
            {isModified && (onReset || defaultNum !== undefined) && (
              <ActionTooltip label="Réinitialiser" side="top">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </ActionTooltip>
            )}
          </div>
        </div>

        {/* Tactile Gauge Bar */}
        {gaugeBar}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export interface GradingDialProps {
  label: string;
  icon?: React.ReactNode;
  value: number;
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
  unit?: string;
  isBipolar?: boolean;
  onChange: (val: number) => void;
  onReset?: () => void;
  className?: string;
  disabled?: boolean;
}

export function GradingDial({
  label,
  icon,
  value,
  min,
  max,
  defaultValue,
  step = 1,
  unit = '%',
  isBipolar = false,
  onChange,
  onReset,
  className,
  disabled,
}: GradingDialProps) {
  return (
    <Slider
      label={label}
      icon={icon}
      value={value}
      min={min}
      max={max}
      defaultValue={defaultValue}
      step={step}
      unit={unit}
      isBipolar={isBipolar}
      onChange={onChange}
      onReset={onReset}
      className={className}
      disabled={disabled}
    />
  );
}

export const TactileSlider = GradingDial;

export { Slider };
