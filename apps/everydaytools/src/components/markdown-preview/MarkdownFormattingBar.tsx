import React from 'react';
import {
  Heading,
  ChevronDown,
  Bold,
  Italic,
  Strikethrough,
  Highlighter,
  Code,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Info,
  Terminal,
  Minus,
  Link,
  Image,
  Table,
  Calculator,
  Bookmark,
} from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  HEADING_PRESETS,
  ALERT_PRESETS,
  CODE_LANGUAGE_PRESETS,
} from '@/lib/markdown-format-helpers';

export interface MarkdownFormattingBarProps {
  applyFormat: (formatType: string, extraArg?: string) => void;
  hasContent: boolean;
  metrics: {
    chars: number;
    words: number;
    lines: number;
    headings: number;
    readMinutes: number;
  };
  isFr: boolean;
}

export function MarkdownFormattingBar({
  applyFormat,
  hasContent,
  metrics,
  isFr,
}: MarkdownFormattingBarProps) {
  return (
    <div className="relative z-20 flex items-center gap-1 overflow-x-auto py-1.5 px-2 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300">
      {/* Cluster 1 : Niveaux de Titres */}
      <DropdownMenu>
        <ActionTooltip label={isFr ? "Choisir un niveau de titre (H1 à H6)" : "Select heading level (H1 to H6)"} side="bottom">
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg hover:bg-zinc-200/80 dark:hover:bg-zinc-800 transition-colors shrink-0 outline-none cursor-pointer">
              <Heading className="w-3.5 h-3.5" />
              <span>{isFr ? 'Titres' : 'Headings'}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
        </ActionTooltip>

        <DropdownMenuContent align="start" className="w-44 p-1">
          {HEADING_PRESETS.map((item) => (
            <DropdownMenuItem
              key={item.lvl}
              onSelect={() => applyFormat('heading', String(item.lvl))}
              className="flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{isFr ? item.labelFr : item.labelEn}</span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">{item.tag}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-1 shrink-0" />

      {/* Cluster 2 : Typographie */}
      <ActionTooltip label={isFr ? "Gras (**texte**)" : "Bold (**text**)"} side="bottom">
        <button onClick={() => applyFormat('bold')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Bold className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Italique (*texte*)" : "Italic (*text*)"} side="bottom">
        <button onClick={() => applyFormat('italic')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Italic className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Barré (~~texte~~)" : "Strikethrough (~~text~~)"} side="bottom">
        <button onClick={() => applyFormat('strike')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Surligner (==texte==)" : "Highlight (==text==)"} side="bottom">
        <button onClick={() => applyFormat('highlight')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Highlighter className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Code en ligne (`code`)" : "Inline code (`code`)"} side="bottom">
        <button onClick={() => applyFormat('code')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Code className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Touche clavier (<kbd>)" : "Keyboard key (<kbd>)"} side="bottom">
        <button onClick={() => applyFormat('kbd')} className="px-1.5 py-0.5 font-mono text-[11px] rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          kbd
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Exposant (<sup>)" : "Superscript (<sup>)"} side="bottom">
        <button onClick={() => applyFormat('sup')} className="px-1.5 py-0.5 text-[11px] rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors font-mono shrink-0">
          x²
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Indice (<sub>)" : "Subscript (<sub>)"} side="bottom">
        <button onClick={() => applyFormat('sub')} className="px-1.5 py-0.5 text-[11px] rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors font-mono shrink-0">
          x₂
        </button>
      </ActionTooltip>

      <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-1 shrink-0" />

      {/* Cluster 3 : Listes */}
      <ActionTooltip label={isFr ? "Liste à puces (- )" : "Bullet list (- )"} side="bottom">
        <button onClick={() => applyFormat('ul')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <List className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Liste numérotée (1. )" : "Numbered list (1. )"} side="bottom">
        <button onClick={() => applyFormat('ol')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Checklist de tâches (- [ ] )" : "Task checklist (- [ ] )"} side="bottom">
        <button onClick={() => applyFormat('task')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <ListTodo className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-1 shrink-0" />

      {/* Cluster 4 : Blocs enrichis */}
      <ActionTooltip label={isFr ? "Citation (> )" : "Blockquote (> )"} side="bottom">
        <button onClick={() => applyFormat('quote')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Quote className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      {/* Menu Alertes */}
      <DropdownMenu>
        <ActionTooltip label={isFr ? "Insérer un encart d'alerte / Callout (> [!NOTE])" : "Insert alert callout (> [!NOTE])"} side="bottom">
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg hover:bg-zinc-200/80 dark:hover:bg-zinc-800 transition-colors shrink-0 outline-none cursor-pointer">
              <Info className="w-3.5 h-3.5" />
              <span>{isFr ? 'Alerte' : 'Alert'}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
        </ActionTooltip>

        <DropdownMenuContent align="start" className="w-48 p-1">
          {ALERT_PRESETS.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onSelect={() => applyFormat('alert', item.id)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            >
              <item.icon className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
              <span className="flex-1 font-medium text-zinc-900 dark:text-zinc-100">{isFr ? item.labelFr : item.labelEn}</span>
              <span className="text-[10px] font-mono text-zinc-400">{item.id}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Menu Blocs de Code */}
      <DropdownMenu>
        <ActionTooltip label={isFr ? "Insérer un bloc de code avec coloration syntaxique" : "Insert syntax-highlighted code block"} side="bottom">
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg hover:bg-zinc-200/80 dark:hover:bg-zinc-800 transition-colors shrink-0 outline-none cursor-pointer">
              <Terminal className="w-3.5 h-3.5" />
              <span>{isFr ? 'Bloc Code' : 'Code Block'}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
        </ActionTooltip>

        <DropdownMenuContent align="start" className="w-48 max-h-72 overflow-y-auto p-1">
          {CODE_LANGUAGE_PRESETS.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onSelect={() => applyFormat('codeblock', item.id)}
              className="flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            >
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
              <span className="text-[10px] text-zinc-400 font-mono">{item.tag}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ActionTooltip label={isFr ? "Bloc repliable (<details>)" : "Collapsible block (<details>)"} side="bottom">
        <button onClick={() => applyFormat('details')} className="px-2 py-1 text-xs rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          {isFr ? 'Repliable' : 'Collapsible'}
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Séparateur horizontal (---)" : "Horizontal rule (---)"} side="bottom">
        <button onClick={() => applyFormat('hr')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Minus className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-1 shrink-0" />

      {/* Cluster 5 : Médias & Données */}
      <ActionTooltip label={isFr ? "Lien hypertexte ([titre](url))" : "Hyperlink ([title](url))"} side="bottom">
        <button onClick={() => applyFormat('link')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Link className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Image (![alt](url))" : "Image (![alt](url))"} side="bottom">
        <button onClick={() => applyFormat('image')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Image className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Insérer un tableau Markdown (3x3)" : "Insert Markdown table (3x3)"} side="bottom">
        <button onClick={() => applyFormat('table')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Table className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Formule mathématique LaTeX ($$)" : "LaTeX math formula ($$)"} side="bottom">
        <button onClick={() => applyFormat('math')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Calculator className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      <ActionTooltip label={isFr ? "Note de bas de page ([^1])" : "Footnote ([^1])"} side="bottom">
        <button onClick={() => applyFormat('footnote')} className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <Bookmark className="w-3.5 h-3.5" />
        </button>
      </ActionTooltip>

      {hasContent && (
        <div className="ml-auto hidden xl:flex items-center gap-2.5 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 pr-2 shrink-0">
          <span>{metrics.words} {isFr ? 'mots' : 'words'}</span>
          <span>·</span>
          <span>{metrics.chars} {isFr ? 'car.' : 'chars'}</span>
          <span>·</span>
          <span>~{metrics.readMinutes} {isFr ? 'min de lecture' : 'min read'}</span>
        </div>
      )}
    </div>
  );
}
