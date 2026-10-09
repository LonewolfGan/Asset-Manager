import ToolPageLayout from '@/components/ToolPageLayout';
import UnitPickerModal from '@/components/UnitPickerModal';
import { useUnitConverterWorkflow } from '@/hooks/use-unit-converter-workflow';
import {
  UnitCategoryNav,
  UnitConverterConsole,
} from '@/components/unit-converter';

export default function UnitConverter() {
  const {
    t,
    isFr,
    activeCategory,
    setActiveCategory,
    category,
    fromUnit,
    toUnit,
    fromValue,
    toValue,
    isSwapping,
    pickerModal,
    fromDef,
    toDef,
    fromSystem,
    toSystem,
    formulaExplanation,
    handleFromChange,
    handleToChange,
    handleSwap,
    handleSelectUnit,
    openPickerModal,
    closePickerModal,
  } = useUnitConverterWorkflow();

  const pageTitle =
    t.tools['unit-converter']?.title ??
    (isFr ? "Convertisseur d'Unités" : 'Unit Converter');
  const pageDesc =
    t.tools['unit-converter']?.description ??
    (isFr
      ? 'Convertissez instantanément plus de 200 unités de mesure dans 13 catégories.'
      : 'Convert between 200+ units across 13 measurement categories.');

  return (
    <ToolPageLayout
      breadcrumb={[
        'Home',
        t.nav.breadcrumb?.calculators ??
          (isFr ? 'Calculateurs' : 'Calculators'),
        pageTitle,
      ]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="unit-converter"
    >
      <div className="w-full px-2 sm:px-6 lg:px-8 space-y-6">
        <UnitCategoryNav
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          categoryNames={t.unitConverter?.categoryNames}
        />

        <UnitConverterConsole
          formulaExplanation={formulaExplanation}
          fromDef={fromDef}
          toDef={toDef}
          fromSystem={fromSystem}
          toSystem={toSystem}
          fromValue={fromValue}
          toValue={toValue}
          isSwapping={isSwapping}
          isFr={isFr}
          unitNames={t.unitConverter?.unitNames}
          onFromChange={handleFromChange}
          onToChange={handleToChange}
          onSwap={handleSwap}
          onOpenPicker={openPickerModal}
        />

        <UnitPickerModal
          isOpen={pickerModal.isOpen}
          onClose={closePickerModal}
          units={category.units}
          selectedUnit={pickerModal.target === 'from' ? fromUnit : toUnit}
          onSelect={handleSelectUnit}
          title={
            pickerModal.target === 'from'
              ? (isFr ? "Sélectionner l'unité A" : 'Select unit A')
              : (isFr ? "Sélectionner l'unité B" : 'Select unit B')
          }
        />
      </div>
    </ToolPageLayout>
  );
}
