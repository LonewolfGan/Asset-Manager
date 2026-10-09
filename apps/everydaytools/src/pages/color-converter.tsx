import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { useColorConverterWorkflow } from '@/hooks/use-color-converter-workflow';
import {
  ColorConverterHeader,
  ColorVisualMonolith,
  ColorPrecisionSliders,
  ColorFormatsList,
} from '@/components/color-converter';

export default function ColorConverter() {
  const { t, isFr } = useLocale();
  const workflow = useColorConverterWorkflow(isFr);

  const title =
    t.tools['color-converter']?.title ??
    (isFr
      ? 'Convertisseur de Couleurs Universel (HEX, RGB, HSL, CMYK)'
      : 'Universal Color Converter (HEX, RGB, HSL, CMYK)');
  const desc =
    t.tools['color-converter']?.description ??
    (isFr
      ? 'Atelier de colorimétrie de haute précision : conversion bidirectionnelle instantanée, spectres tonals et calibration de précision.'
      : 'Precision colorimetry workshop: instant bidirectional conversion, tonal spectrums, and sliders.');

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home ?? 'Home',
        t.nav.breadcrumb.textCode ?? 'Data & Code',
        t.tools['color-converter']?.title ??
          (isFr ? 'Convertisseur de Couleurs' : 'Color Converter'),
      ]}
      title={title}
      description={desc}
      seoSlug="color-converter"
    >
      <div className="w-full space-y-8">
        {/* 1. En-tête d'atelier parfaitement aligné */}
        <ColorConverterHeader workflow={workflow} isFr={isFr} />

        {/* 2. Atelier en deux colonnes (50% / 50%) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-start">
          {/* Colonne Gauche : Monolithe visuel, Spectre & Sliders */}
          <div className="w-full space-y-5">
            <ColorVisualMonolith workflow={workflow} isFr={isFr} />
            <ColorPrecisionSliders workflow={workflow} isFr={isFr} />
          </div>

          {/* Colonne Droite : Formats convertis avec boutons Copier */}
          <ColorFormatsList workflow={workflow} isFr={isFr} />
        </div>
      </div>
    </ToolPageLayout>
  );
}
