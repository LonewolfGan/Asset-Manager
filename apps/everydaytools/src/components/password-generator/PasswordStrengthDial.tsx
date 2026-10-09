import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock } from 'lucide-react';
import type { PasswordVaultStrength } from '@/lib/password-generator-logic';

export interface PasswordStrengthDialProps {
  strengthInfo: PasswordVaultStrength;
}

export function PasswordStrengthDial({ strengthInfo }: PasswordStrengthDialProps) {
  return (
    <div className="h-11 px-3.5 rounded-xl inline-flex items-center gap-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 select-none">
      {/* Circular SVG Gauge (28x28) */}
      <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
        <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 28 28">
          {/* Background track */}
          <circle
            cx="14"
            cy="14"
            r="11"
            fill="none"
            strokeWidth="2.4"
            stroke="currentColor"
            className="text-zinc-200 dark:text-zinc-700"
          />
          {/* Animated active arc */}
          <circle
            cx="14"
            cy="14"
            r="11"
            fill="none"
            strokeWidth="2.4"
            stroke="currentColor"
            strokeDasharray="69.1"
            strokeDashoffset={69.1 - 69.1 * (strengthInfo.level / 4)}
            strokeLinecap="round"
            className={`transition-all duration-500 ease-out ${strengthInfo.stroke}`}
          />
        </svg>
        {/* Center dynamic security glyph */}
        <div className="absolute inset-0 flex items-center justify-center">
          {strengthInfo.level === 1 && <ShieldAlert className="w-3 h-3 text-red-500" />}
          {strengthInfo.level === 2 && <Shield className="w-3 h-3 text-amber-500" />}
          {strengthInfo.level === 3 && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
          {strengthInfo.level === 4 && <Lock className="w-3 h-3 text-[#FF6B35]" />}
        </div>
      </div>

      {/* Clean Strength Label (No badge, no redundant parentheses) */}
      <span className={`text-xs font-mono font-bold uppercase tracking-tight ${strengthInfo.color}`}>
        {strengthInfo.label}
      </span>
    </div>
  );
}
