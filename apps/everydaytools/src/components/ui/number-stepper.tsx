import React, { useCallback, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';

export interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = Infinity,
  step = 1,
  suffix,
  id,
  disabled = false,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const clamp = useCallback(
    (val: number) => {
      let clamped = val;
      if (min !== undefined && clamped < min) clamped = min;
      if (max !== undefined && clamped > max) clamped = max;
      return clamped;
    },
    [min, max]
  );

  const handleDecrement = () => {
    if (disabled) return;
    const next = clamp(value - step);
    onChange(next);
  };

  const handleIncrement = () => {
    if (disabled) return;
    const next = clamp(value + step);
    onChange(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') return;
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      onChange(clamp(parsed));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    }
  };

  const isMin = min !== undefined && value <= min;
  const isMax = max !== undefined && value >= max;

  return (
    <div
      className={`h-10 flex items-center rounded-xl bg-black/[0.02] dark:bg-white/[0.03] ring-1 ring-black/[0.08] dark:ring-white/15 focus-within:ring-1 focus-within:ring-zinc-400/40 dark:focus-within:ring-zinc-600/40 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-all overflow-hidden ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      } ${className}`}
    >
      {/* Bouton Moins */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || isMin}
        aria-label="Diminuer la valeur"
        className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-[0.94] transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed select-none"
      >
        <Minus size={14} />
      </button>

      {/* Valeur & Suffixe */}
      <div className="flex-1 flex items-center justify-center px-1">
        <input
          ref={inputRef}
          id={id}
          type="number"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full text-center text-sm font-mono font-medium text-zinc-950 dark:text-zinc-50 bg-transparent outline-none select-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && (
          <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 pr-2 pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>

      {/* Bouton Plus */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || isMax}
        aria-label="Augmenter la valeur"
        className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-[0.94] transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed select-none"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
export default NumberStepper;
