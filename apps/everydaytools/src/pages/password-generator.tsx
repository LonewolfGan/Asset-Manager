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

export default function PasswordGenerator() {
  const { t, locale } = useLocale();
  const isFr = locale === 'FR';
  const pg = t.passwordGenerator;

  const { isSpeaking, speakPassword, stopSpeaking } = usePasswordSpeech({ isFr });
  const [testPassword, setTestPassword] = React.useState('');

  const {
    mode,
    setMode,
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
    strengthInfo,
    textSizeClass,
  } = usePasswordGeneratorWorkflow({
    onStopSpeaking: stopSpeaking,
    labels: pg.strength,
  });

  const titleText = t.tools['password-generator']?.title ?? 'Password Generator';
  const descText =
    t.tools['password-generator']?.description ??
    'Generate strong, secure passwords instantly in your browser.';

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
      <div className="w-full flex flex-col gap-12 py-4">
        {/* 1. HERO READOUT STAGE (Open, Floating, Monolithic) */}
        <PasswordHeroStage
          password={password}
          textSizeClass={textSizeClass}
          strengthInfo={strengthInfo}
          isSpinning={isSpinning}
          regenerate={regenerate}
          mode={mode}
          pronounceable={pronounceable}
          isSpeaking={isSpeaking}
          speakPassword={speakPassword}
          isFr={isFr}
          regenerateLabel={pg.regenerate}
          copyLabel={pg.copy}
          copiedLabel={t.common.copied}
        />

        {/* 2. CONTROLS DECK (Posé à Plat, Minimal, Sans Sous-Boîtes) */}
        <PasswordControlsDeck
          mode={mode}
          onModeChange={setMode}
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

        {/* 3. TESTEUR DE MOT DE PASSE INTÉGRÉ (PasswordSecureField) */}
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
