import ToolPageLayout from '@/components/ToolPageLayout';
import CurrencyPickerModal from '@/components/CurrencyPickerModal';
import { useCurrencyConverterWorkflow } from '@/hooks/use-currency-converter-workflow';
import {
  CurrencyTelemetryBar,
  CurrencySourceInput,
  CurrencyTargetOutput,
  CurrencySwapDivider,
} from '@/components/currency-converter';

export default function CurrencyConverter() {
  const {
    t,
    locale,
    isFr,
    sourceInfo,
    isRefreshing,
    fetchRates,
    fromCurrency,
    toCurrency,
    amount,
    setAmount,
    isSwapping,
    pickerModal,
    setPickerModal,
    convertedValue,
    directRate,
    inverseRate,
    fromMeta,
    toMeta,
    fromInfo,
    toInfo,
    handleSwap,
    handleSelectCurrency,
    handleSelectPair,
  } = useCurrencyConverterWorkflow();

  const pageTitle =
    t.tools['currency-converter']?.title ??
    (isFr ? 'Convertisseur de Devises' : 'Currency Converter');
  const pageDesc =
    t.tools['currency-converter']?.description ??
    (isFr
      ? 'Convertissez plus de 170 devises mondiales avec les taux de change moyens du marché en direct.'
      : 'Convert between 170+ world currencies with live mid-market exchange rates.');

  return (
    <ToolPageLayout
      breadcrumb={[
        'Home',
        t.nav.breadcrumb?.calculators ?? (isFr ? 'Calculateurs' : 'Calculators'),
        pageTitle,
      ]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="currency-converter"
    >
      <div className="w-full max-w-4xl mx-auto space-y-4">
        {/* Monolithic Studio FX Cockpit */}
        <div className="w-full rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
          {/* Integrated Top Header: Live Telemetry Pulse & Quick FX Chips */}
          <CurrencyTelemetryBar
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            directRate={directRate}
            inverseRate={inverseRate}
            sourceInfo={sourceInfo}
            isRefreshing={isRefreshing}
            onRefresh={() => fetchRates(true)}
            onSelectPair={handleSelectPair}
            locale={locale}
            isFr={isFr}
          />

          {/* Deck Tier 1: Source Currency ("Vous envoyez") */}
          <CurrencySourceInput
            amount={amount}
            onAmountChange={setAmount}
            currency={fromCurrency}
            currencyName={isFr ? (fromMeta?.nameFr || fromInfo.name) : fromInfo.name}
            currencySymbol={fromInfo.symbol}
            onOpenPicker={() => setPickerModal({ isOpen: true, target: 'from' })}
            label={t.currencyConverter.from || (isFr ? 'Vous envoyez' : 'You send')}
            isFr={isFr}
          />

          {/* Central Seamless Divider & Floating Swap Control */}
          <CurrencySwapDivider
            isSwapping={isSwapping}
            onSwap={handleSwap}
            isFr={isFr}
          />

          {/* Deck Tier 2: Destination Currency ("Vous recevez") */}
          <CurrencyTargetOutput
            convertedValue={convertedValue}
            currency={toCurrency}
            currencyName={isFr ? (toMeta?.nameFr || toInfo.name) : toInfo.name}
            currencySymbol={toInfo.symbol}
            onOpenPicker={() => setPickerModal({ isOpen: true, target: 'to' })}
            label={t.currencyConverter.to || (isFr ? 'Vous recevez' : 'You receive')}
            isFr={isFr}
          />
        </div>

        {/* Currency Selector Modal */}
        <CurrencyPickerModal
          isOpen={pickerModal.isOpen}
          onClose={() => setPickerModal((prev) => ({ ...prev, isOpen: false }))}
          selectedCurrency={pickerModal.target === 'from' ? fromCurrency : toCurrency}
          onSelect={handleSelectCurrency}
          title={
            pickerModal.target === 'from'
              ? isFr
                ? 'Sélectionner la devise source'
                : 'Select source currency'
              : isFr
              ? 'Sélectionner la devise cible'
              : 'Select target currency'
          }
        />
      </div>
    </ToolPageLayout>
  );
}
