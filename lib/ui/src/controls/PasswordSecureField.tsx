import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound, Copy, Check } from 'lucide-react';
import type { PasswordSecureFieldProps, PasswordStrength } from './types';

export function evaluatePasswordStrength(password: string): { score: number; label: PasswordStrength; textFr: string; textEn: string } {
  if (!password) {
    return { score: 0, label: 'weak', textFr: 'Vide', textEn: 'Empty' };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return { score: 1, label: 'weak', textFr: 'Faible', textEn: 'Weak' };
  }
  if (score === 2) {
    return { score: 2, label: 'fair', textFr: 'Moyen', textEn: 'Fair' };
  }
  if (score === 3) {
    return { score: 3, label: 'good', textFr: 'Bon', textEn: 'Good' };
  }
  return { score: 4, label: 'strong', textFr: 'Fort', textEn: 'Strong' };
}

export function generateRandomPassword(length = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let result = '';
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : null;
  if (cryptoObj?.getRandomValues) {
    const values = new Uint32Array(length);
    cryptoObj.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += chars[values[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return result;
}

export const PasswordSecureField: React.FC<PasswordSecureFieldProps> = ({
  value,
  onChange,
  label,
  placeholder,
  showStrength = false,
  allowGenerate = false,
  allowCopy = false,
  onGenerate,
  isFr = false,
  className = '',
  disabled = false,
  required = false,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const strength = evaluatePasswordStrength(value);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleGenerateClick = () => {
    if (onGenerate) {
      onGenerate();
    } else {
      const generated = generateRandomPassword(16);
      onChange(generated);
    }
  };

  const handleCopyClick = () => {
    if (!value) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const strengthColor = {
    weak: 'bg-red-500',
    fair: 'bg-amber-500',
    good: 'bg-blue-500',
    strong: 'bg-emerald-500',
  }[strength.label];

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || (showStrength && value)) && (
        <div className="flex items-center justify-between text-xs">
          {label ? (
            <label className="font-medium text-zinc-700 dark:text-zinc-300">
              {label}
              {required && <span className="text-[#FF6B35] ml-0.5">*</span>}
            </label>
          ) : (
            <span />
          )}
          {showStrength && value && (
            <span
              data-testid="password-strength"
              className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400"
            >
              {isFr ? strength.textFr : strength.textEn}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || (isFr ? 'Saisir le mot de passe...' : 'Enter password...')}
          disabled={disabled}
          required={required}
          className={`w-full h-9 pl-3 pr-20 text-xs sm:text-sm bg-white dark:bg-zinc-900 border rounded-lg transition-colors font-mono focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] disabled:opacity-40 disabled:cursor-not-allowed ${
            error
              ? 'border-red-500 text-red-900 dark:text-red-300'
              : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100'
          }`}
        />

        <div className="absolute right-1 flex items-center gap-0.5">
          {allowGenerate && (
            <button
              type="button"
              disabled={disabled}
              data-testid="generate-password"
              onClick={handleGenerateClick}
              title={isFr ? 'Générer un mot de passe sécurisé' : 'Generate secure password'}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition-colors focus:outline-none"
            >
              <KeyRound className="w-3.5 h-3.5" />
            </button>
          )}

          {allowCopy && value && (
            <button
              type="button"
              disabled={disabled}
              data-testid="copy-password"
              onClick={handleCopyClick}
              title={isFr ? 'Copier' : 'Copy'}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition-colors focus:outline-none"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            data-testid="toggle-visibility"
            onClick={handleToggleVisibility}
            title={showPassword ? (isFr ? 'Masquer' : 'Hide') : isFr ? 'Afficher' : 'Show'}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {showStrength && value && (
        <div className="flex gap-1 pt-0.5">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full transition-colors ${
                step <= strength.score ? strengthColor : 'bg-zinc-200 dark:bg-zinc-800'
              }`}
            />
          ))}
        </div>
      )}

      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
};
