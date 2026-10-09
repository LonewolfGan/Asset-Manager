import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CodeWorkspace } from '@/components/ui/code-workspace';

interface HtmlToMarkdownPastePaneProps {
  htmlInput: string;
  onHtmlInputChange: (val: string) => void;
  onSubmit: () => void;
  isFr: boolean;
}

export function HtmlToMarkdownPastePane({
  htmlInput,
  onHtmlInputChange,
  onSubmit,
  isFr,
}: HtmlToMarkdownPastePaneProps) {
  const placeholder = isFr
    ? '<h1>Titre de la page</h1>\n<p>Ceci est un paragraphe avec un <a href="https://example.com">lien</a> et du texte en <strong>gras</strong>.</p>\n<ul>\n  <li>Premier élément</li>\n  <li>Second élément</li>\n</ul>'
    : '<h1>Page Title</h1>\n<p>This is a paragraph with a <a href="https://example.com">link</a> and <strong>bold</strong> text.</p>\n<ul>\n  <li>First item</li>\n  <li>Second item</li>\n</ul>';

  const sampleText = isFr
    ? `<article>\n  <h1>Guide d'Architecture Système</h1>\n  <p>Ce guide résume les principes de <strong>conception résiliente</strong> et les bonnes pratiques pour les architectures distribuées.</p>\n  <h2>Points d'attention</h2>\n  <ul>\n    <li>Isolation stricte des pannes de sous-systèmes</li>\n    <li>Idempotence des opérations de conversion</li>\n    <li>Contrôles cryptographiques d'intégrité</li>\n  </ul>\n  <p>Pour en savoir plus, consultez la <a href="https://example.com">documentation officielle</a>.</p>\n</article>\n`
    : `<article>\n  <h1>System Architecture Guide</h1>\n  <p>This guide summarizes the principles of <strong>resilient design</strong> and best practices for distributed architectures.</p>\n  <h2>Focus Points</h2>\n  <ul>\n    <li>Strict isolation of subsystem failures</li>\n    <li>Idempotency of conversion operations</li>\n    <li>Cryptographic integrity controls</li>\n  </ul>\n  <p>To learn more, check the <a href="https://example.com">official documentation</a>.</p>\n</article>\n`;

  return (
    <div className="space-y-4">
      <CodeWorkspace
        value={htmlInput}
        onChange={onHtmlInputChange}
        mode="input"
        format="html"
        formatLabel={isFr ? 'Code Source HTML5' : 'HTML5 Source Code'}
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
