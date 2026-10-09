import { useState, useEffect, useMemo, useCallback } from 'react';
import { UNIT_CATEGORIES } from '@/config/units.config';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { getUnitSystem } from '@/lib/unit-systems';
import { convertUnits, getFormulaExplanation } from '@/lib/unit-converter-logic';

export function useUnitConverterWorkflow() {
  const { t, locale, isFr } = useLocale();

  const [activeCategory, setActiveCategory] = useState(UNIT_CATEGORIES[0].id);
  const category = useMemo(
    () => UNIT_CATEGORIES.find((c) => c.id === activeCategory) || UNIT_CATEGORIES[0],
    [activeCategory]
  );

  const [fromUnit, setFromUnit] = useState(category.units[0].id);
  const [toUnit, setToUnit] = useState(category.units[1]?.id ?? category.units[0].id);

  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');

  const [isSwapping, setIsSwapping] = useState(false);

  const [pickerModal, setPickerModal] = useState<{
    isOpen: boolean;
    target: 'from' | 'to';
  }>({
    isOpen: false,
    target: 'from',
  });

  useEffect(() => {
    const defaultFrom = category.units[0].id;
    const defaultTo = category.units[1] ? category.units[1].id : category.units[0].id;
    setFromUnit(defaultFrom);
    setToUnit(defaultTo);
  }, [activeCategory, category]);

  useEffect(() => {
    const converted = convertUnits(fromValue, fromUnit, toUnit, category.units, locale);
    setToValue(converted);
    if (fromValue) {
      trackToolUsed('unit-converter', 'calculators');
    }
  }, [fromValue, fromUnit, toUnit, category, locale]);

  const handleFromChange = useCallback(
    (newVal: string) => {
      setFromValue(newVal);
      setToValue(convertUnits(newVal, fromUnit, toUnit, category.units, locale));
    },
    [fromUnit, toUnit, category.units, locale]
  );

  const handleToChange = useCallback(
    (newVal: string) => {
      setToValue(newVal);
      setFromValue(convertUnits(newVal, toUnit, fromUnit, category.units, locale));
    },
    [fromUnit, toUnit, category.units, locale]
  );

  const handleSwap = useCallback(() => {
    setIsSwapping(true);
    const prevFromUnit = fromUnit;
    const prevToUnit = toUnit;
    const prevFromVal = fromValue;
    const prevToVal = toValue;

    setFromUnit(prevToUnit);
    setToUnit(prevFromUnit);
    setFromValue(prevToVal || '1');
    setToValue(prevFromVal);

    setTimeout(() => setIsSwapping(false), 200);
  }, [fromUnit, toUnit, fromValue, toValue]);

  const handleSelectUnit = useCallback(
    (unitId: string) => {
      if (pickerModal.target === 'from') {
        if (unitId === toUnit) {
          setToUnit(fromUnit);
        }
        setFromUnit(unitId);
      } else {
        if (unitId === fromUnit) {
          setFromUnit(toUnit);
        }
        setToUnit(unitId);
      }
      setPickerModal((prev) => ({ ...prev, isOpen: false }));
    },
    [pickerModal.target, fromUnit, toUnit]
  );

  const fromDef = useMemo(
    () => category.units.find((u) => u.id === fromUnit) || category.units[0],
    [category.units, fromUnit]
  );

  const toDef = useMemo(
    () => category.units.find((u) => u.id === toUnit) || category.units[1] || category.units[0],
    [category.units, toUnit]
  );

  const directRateStr = useMemo(
    () => convertUnits('1', fromUnit, toUnit, category.units, locale),
    [fromUnit, toUnit, category.units, locale]
  );

  const formulaExplanation = useMemo(
    () =>
      getFormulaExplanation(
        activeCategory,
        fromUnit,
        toUnit,
        fromDef.symbol,
        toDef.symbol,
        directRateStr
      ),
    [activeCategory, fromUnit, toUnit, fromDef.symbol, toDef.symbol, directRateStr]
  );

  const fromSystem = useMemo(() => getUnitSystem(fromDef.id), [fromDef.id]);
  const toSystem = useMemo(() => getUnitSystem(toDef.id), [toDef.id]);

  const openPickerModal = useCallback((target: 'from' | 'to') => {
    setPickerModal({ isOpen: true, target });
  }, []);

  const closePickerModal = useCallback(() => {
    setPickerModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
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
  };
}
