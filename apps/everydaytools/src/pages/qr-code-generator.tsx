import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { useLocale } from '@/hooks/use-locale';
import { Globe, FileText, Wifi, Contact } from 'lucide-react';
import { useQrCodeGenerator } from '@/hooks/use-qr-code-generator';
import { InputMode } from '@/lib/qr-code-logic';
import { QrViewport } from '@/components/qr/QrViewport';
import { QrInputForms } from '@/components/qr/QrInputForms';
import { QrStylingConfig } from '@/components/qr/QrStylingConfig';
import { QrColorPalette } from '@/components/qr/QrColorPalette';
import { QrIconPickerModal } from '@/components/qr/QrIconPickerModal';

export default function QrCodeGenerator() {
  const qr = useQrCodeGenerator();
  const { t, isFr, tq } = qr;

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home ?? 'Home',
        t.nav.breadcrumb.calculators ?? 'Calculators',
        t.tools['qr-code-generator']?.title ?? 'QR Code Generator',
      ]}
      title={t.tools['qr-code-generator']?.title ?? 'QR Code Generator'}
      description={
        t.tools['qr-code-generator']?.description ??
        'Generate crisp, customizable QR codes with PNG & SVG vector export.'
      }
      seoSlug="qr-code-generator"
    >
      {/* Hidden File Input for Custom Logo */}
      <input
        type="file"
        ref={qr.fileInputRef}
        onChange={qr.handleLogoUpload}
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* QR STUDIO WORKBENCH — FULL WIDTH, FLAT ARCHITECTURE, ZERO BOX SLOP        */}
      {/* ========================================================================= */}
      <div className="w-full flex flex-col gap-10 py-2">
        {/* 1. TOP DOCKED MODE NAVIGATION */}
        <div className="w-full flex items-center justify-between border-b border-zinc-200/80 dark:border-white/10 pb-5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'url', label: 'URL', icon: Globe, index: '01' },
              { id: 'text', label: isFr ? 'Texte' : 'Text', icon: FileText, index: '02' },
              { id: 'wifi', label: 'Wi-Fi', icon: Wifi, index: '03' },
              { id: 'vcard', label: isFr ? 'Contact' : 'vCard', icon: Contact, index: '04' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = qr.mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => qr.setMode(tab.id as InputMode)}
                  className={`h-9 px-3.5 rounded-lg inline-flex items-center gap-2 text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-[10px] opacity-40 font-mono">{tab.index}</span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className={qr.contrastAssessment.color}>{qr.contrastAssessment.label}</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              ({qr.contrastRatio.toFixed(1)}:1)
            </span>
          </div>
        </div>

        {/* 2. SPLIT WORKBENCH : VIEWPORT ON LEFT, ARCHITECTURAL DECK ON RIGHT */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* LEFT ZONE: MATRIX VIEWPORT & EXPORT ACTIONS */}
          <QrViewport
            isFr={isFr}
            tq={tq}
            canvasRef={qr.canvasRef}
            bgColor={qr.bgColor}
            isEmpty={qr.isEmpty}
            genError={qr.genError}
            content={qr.content}
            size={qr.size}
            downloadPng={qr.downloadPng}
            downloadSvg={qr.downloadSvg}
            copyImage={qr.copyImage}
          />

          {/* RIGHT ZONE: FLAT INSPECTOR DECK */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-8">
            <QrInputForms
              mode={qr.mode}
              isFr={isFr}
              tq={tq}
              url={qr.url}
              setUrl={qr.setUrl}
              rawText={qr.rawText}
              setRawText={qr.setRawText}
              wifiSsid={qr.wifiSsid}
              setWifiSsid={qr.setWifiSsid}
              wifiPass={qr.wifiPass}
              setWifiPass={qr.setWifiPass}
              wifiEnc={qr.wifiEnc}
              setWifiEnc={qr.setWifiEnc}
              showWifiPass={qr.showWifiPass}
              setShowWifiPass={qr.setShowWifiPass}
              vcardName={qr.vcardName}
              setVcardName={qr.setVcardName}
              vcardOrg={qr.vcardOrg}
              setVcardOrg={qr.setVcardOrg}
              vcardPhone={qr.vcardPhone}
              setVcardPhone={qr.setVcardPhone}
              vcardEmail={qr.vcardEmail}
              setVcardEmail={qr.setVcardEmail}
              vcardUrl={qr.vcardUrl}
              setVcardUrl={qr.setVcardUrl}
            />

            <QrStylingConfig
              isFr={isFr}
              dotStyle={qr.dotStyle}
              setDotStyle={qr.setDotStyle}
              eyeStyle={qr.eyeStyle}
              setEyeStyle={qr.setEyeStyle}
              logoUrl={qr.logoUrl}
              clearLogo={qr.clearLogo}
              logoScale={qr.logoScale}
              setLogoScale={qr.setLogoScale}
              fileInputRef={qr.fileInputRef}
              setIsIconModalOpen={qr.iconPicker.setIsIconModalOpen}
              activePresetId={qr.activePresetId}
              selectPresetIcon={qr.selectPresetIcon}
              iconColor={qr.iconColor}
              handleIconColorChange={qr.handleIconColorChange}
              availableIconSwatches={qr.availableIconSwatches}
            />

            <QrColorPalette
              isFr={isFr}
              fgColor={qr.fgColor}
              setFgColor={qr.setFgColor}
              bgColor={qr.bgColor}
              setBgColor={qr.setBgColor}
              invertColors={qr.invertColors}
            />
          </div>
        </div>
      </div>

      {/* ICON LIBRARY DIALOG */}
      <QrIconPickerModal
        isOpen={qr.iconPicker.isIconModalOpen}
        onOpenChange={qr.iconPicker.setIsIconModalOpen}
        isFr={isFr}
        searchQuery={qr.iconPicker.iconSearchQuery}
        setSearchQuery={qr.iconPicker.setIconSearchQuery}
        category={qr.iconPicker.iconCategory}
        setCategory={qr.iconPicker.setIconCategory}
        icons={qr.iconPicker.filteredLibraryIcons}
        activePresetId={qr.activePresetId}
        onSelectIcon={qr.selectPresetIcon}
      />
    </ToolPageLayout>
  );
}
