import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CodeWorkspace } from '@/components/ui/code-workspace';

interface HtmlToPdfPastePaneProps {
  htmlInput: string;
  onHtmlInputChange: (val: string) => void;
  onSubmit: () => void;
  isFr: boolean;
}

export function HtmlToPdfPastePane({
  htmlInput,
  onHtmlInputChange,
  onSubmit,
  isFr,
}: HtmlToPdfPastePaneProps) {
  const placeholder = isFr
    ? '<!DOCTYPE html>\n<html>\n<head><title>Document</title></head>\n<body>\n  <h1>Titre</h1>\n  <p>Insérez votre code HTML ici pour le compiler directement en PDF haute fidélité.</p>\n</body>\n</html>'
    : '<!DOCTYPE html>\n<html>\n<head><title>Document</title></head>\n<body>\n  <h1>Title</h1>\n  <p>Insert your HTML code here to compile directly into high-fidelity PDF.</p>\n</body>\n</html>';

  const sampleText = isFr
    ? `<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <title>Facture Commerciale</title>\n  <style>\n    body { font-family: system-ui, sans-serif; padding: 32px; color: #111; }\n    h1 { color: #0f172a; margin-bottom: 8px; }\n    table { width: 100%; border-collapse: collapse; margin-top: 24px; }\n    th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }\n    th { background-color: #f8fafc; font-weight: 600; }\n    .total { font-weight: bold; text-align: right; margin-top: 16px; }\n  </style>\n</head>\n<body>\n  <h1>Facture #FA-2026-089</h1>\n  <p>Date : 1er Octobre 2026</p>\n  <table>\n    <thead><tr><th>Description</th><th>Qté</th><th>Prix unitaire</th><th>Total</th></tr></thead>\n    <tbody>\n      <tr><td>Abonnement Plateforme Cloud Pro</td><td>1</td><td>450,00 €</td><td>450,00 €</td></tr>\n      <tr><td>Support Technique Prioritaire 24/7</td><td>1</td><td>120,00 €</td><td>120,00 €</td></tr>\n    </tbody>\n  </table>\n  <p class="total">Total TTC : 570,00 €</p>\n</body>\n</html>\n`
    : `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Commercial Invoice</title>\n  <style>\n    body { font-family: system-ui, sans-serif; padding: 32px; color: #111; }\n    h1 { color: #0f172a; margin-bottom: 8px; }\n    table { width: 100%; border-collapse: collapse; margin-top: 24px; }\n    th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }\n    th { background-color: #f8fafc; font-weight: 600; }\n    .total { font-weight: bold; text-align: right; margin-top: 16px; }\n  </style>\n</head>\n<body>\n  <h1>Invoice #INV-2026-089</h1>\n  <p>Date: October 1, 2026</p>\n  <table>\n    <thead><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>\n    <tbody>\n      <tr><td>Cloud Platform Pro Subscription</td><td>1</td><td>$450.00</td><td>$450.00</td></tr>\n      <tr><td>Priority 24/7 Technical Support</td><td>1</td><td>$120.00</td><td>$120.00</td></tr>\n    </tbody>\n  </table>\n  <p class="total">Total: $570.00</p>\n</body>\n</html>\n`;

  return (
    <div className="space-y-4">
      <CodeWorkspace
        value={htmlInput}
        onChange={onHtmlInputChange}
        mode="input"
        format="html"
        formatLabel={isFr ? 'Document HTML5' : 'HTML5 Document'}
        placeholder={placeholder}
        sampleText={sampleText}
        onSubmit={onSubmit}
        minHeight="380px"
        maxHeight="520px"
      />

      <div className="flex items-center justify-end">
        <button
          type="button"
          disabled={!htmlInput.trim()}
          onClick={onSubmit}
          className="h-11 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-sm transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <span>{isFr ? 'Valider et configurer' : 'Confirm and configure'}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
