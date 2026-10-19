import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { usePasswordSpeech } from '@/hooks/use-password-speech';
import { usePasswordGeneratorWorkflow } from '@/hooks/use-password-generator-workflow';
import {
  PasswordHeroStage,
  PasswordControlsDeck,
} from '@/components/password-generator';
import { PasswordSecureField } from '@workspace/ui/controls';
import { setHandoffText } from '@/lib/file-handoff';
import { useLocation } from 'wouter';
import { Hash, QrCode } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';

export default function PasswordGenerator() {
  const { t, locale } = useLocale();
  const [, setLocation] = useLocation();
  const isFr = locale === 'FR';
  const pg = t.passwordGenerator;

  const { isSpeaking, speakPassword, stopSpeaking } = usePasswordSpeech({ isFr });
  const [testPassword, setTestPassword] = React.useState('');

  const {
    mode,
    setMode,
    activePresetId,
    applyPreset,
    length,
    setLength,
    uppercase,
    setUppercase,
    lowercase,
    setLowercase,
    numbers,
    setNumbers,
    symbols,
    setSymbols,
    excludeAmbiguous,
    setExcludeAmbiguous,
    pronounceable,
    setPronounceable,
    wordCount,
    setWordCount,
    separator,
    setSeparator,
    capitalizeWords,
    setCapitalizeWords,
    includeNumberInPassphrase,
    setIncludeNumberInPassphrase,
    password,
    isSpinning,
    regenerate,
    undo,
    redo,
    canUndo,
    canRedo,
    strengthInfo,
    textSizeClass,
    entropyBits,
    crackTime,
  } = usePasswordGeneratorWorkflow({
    onStopSpeaking: stopSpeaking,
    onHandoffText: (importedText) => setTestPassword(importedText),
    isFr,
    labels: pg.strength,
  });

  const titleText = t.tools['password-generator']?.title ?? 'Password Generator';
  const descText =
    t.tools['password-generator']?.description ??
    'Generate strong, secure passwords instantly in your browser.';

  const handleSendToHash = () => {
    if (!password) return;
    setHandoffText(password);
    setLocation('/hash-generator');
  };

  const handleSendToQr = () => {
    if (!password) return;
    setHandoffText(password);
    setLocation('/qr-code-generator');
  };

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home ?? 'Home',
        t.nav.breadcrumb.calculators ?? 'Calculators',
        titleText,
      ]}
      title={titleText}
      description={descText}
      seoSlug="password-generator"
    >
      <div className="w-full flex flex-col gap-10 py-2">
        {/* 1. HERO READOUT STAGE (Open, Monolithic, Floating) */}
        <PasswordHeroStage
          password={password}
          textSizeClass={textSizeClass}
          strengthInfo={strengthInfo}
          entropyBits={entropyBits}
          crackTime={crackTime}
          isSpinning={isSpinning}
          regenerate={regenerate}
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          mode={mode}
          pronounceable={pronounceable}
          isSpeaking={isSpeaking}
          speakPassword={speakPassword}
          isFr={isFr}
          regenerateLabel={pg.regenerate}
          copyLabel={pg.copy}
          copiedLabel={t.common.copied}
        />

        {/* 2. INTER-TOOL HANDOFF SHORTCUTS */}
        <div className="flex items-center justify-center gap-3 -mt-6">
          <ActionTooltip label={isFr ? 'Calculer le hash (SHA-256, MD5...)' : 'Calculate hash (SHA-256, MD5...)'}>
            <button
              type="button"
              onClick={handleSendToHash}
              className="h-8 px-3 rounded-lg inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-white/10 transition-colors duration-150 cursor-pointer"
            >
              <Hash className="w-3.5 h-3.5 text-[var(--accent,#f97316)]" />
              <span>{isFr ? 'Hacher ce mot de passe' : 'Hash this password'}</span>
            </button>
          </ActionTooltip>

          <ActionTooltip label={isFr ? 'Créer un QR code scannable' : 'Generate scannable QR code'}>
            <button
              type="button"
              onClick={handleSendToQr}
              className="h-8 px-3 rounded-lg inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-white/10 transition-colors duration-150 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-[var(--accent,#f97316)]" />
              <span>{isFr ? 'Créer un QR code' : 'Create QR code'}</span>
            </button>
          </ActionTooltip>
        </div>

        {/* 3. CONTROLS DECK WITH SECURITY PRESETS */}
        <PasswordControlsDeck
          mode={mode}
          onModeChange={setMode}
          activePresetId={activePresetId}
          onSelectPreset={applyPreset}
          length={length}
          onLengthChange={setLength}
          uppercase={uppercase}
          onUppercaseChange={setUppercase}
          lowercase={lowercase}
          onLowercaseChange={setLowercase}
          numbers={numbers}
          onNumbersChange={setNumbers}
          symbols={symbols}
          onSymbolsChange={setSymbols}
          excludeAmbiguous={excludeAmbiguous}
          onExcludeAmbiguousChange={setExcludeAmbiguous}
          pronounceable={pronounceable}
          onPronounceableChange={setPronounceable}
          isSpeaking={isSpeaking}
          onSpeak={() => speakPassword(password)}
          onStopSpeaking={stopSpeaking}
          lengthLabel={pg.length}
          uppercaseLabel={pg.uppercase}
          lowercaseLabel={pg.lowercase}
          numbersLabel={pg.numbers}
          symbolsLabel={pg.symbols}
          pronounceableLabel={pg.pronounceable}
          wordCount={wordCount}
          onWordCountChange={setWordCount}
          separator={separator}
          onSeparatorChange={setSeparator}
          capitalizeWords={capitalizeWords}
          onCapitalizeWordsChange={setCapitalizeWords}
          includeNumberInPassphrase={includeNumberInPassphrase}
          onIncludeNumberInPassphraseChange={setIncludeNumberInPassphrase}
          isFr={isFr}
        />

        {/* 4. INTEGRATED PASSWORD TESTER */}
        <div className="w-full max-w-xl mx-auto pt-6 border-t border-zinc-200/80 dark:border-white/10">
          <PasswordSecureField
            value={testPassword}
            onChange={setTestPassword}
            label={isFr ? 'Tester un mot de passe existant' : 'Test an existing password'}
            placeholder={isFr ? 'Saisir ou coller un mot de passe à tester...' : 'Enter or paste a password to test...'}
            showStrength
            allowCopy
            allowGenerate
            onGenerate={regenerate}
            isFr={isFr}
          />
        </div>
      </div>
    </ToolPageLayout>
  );
}
