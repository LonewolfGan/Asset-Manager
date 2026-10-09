import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import jsLang from 'highlight.js/lib/languages/javascript';
import tsLang from 'highlight.js/lib/languages/typescript';
import pyLang from 'highlight.js/lib/languages/python';
import bashLang from 'highlight.js/lib/languages/bash';
import jsonLang from 'highlight.js/lib/languages/json';
import cssLang from 'highlight.js/lib/languages/css';
import xmlLang from 'highlight.js/lib/languages/xml';
import mdLang from 'highlight.js/lib/languages/markdown';
import sqlLang from 'highlight.js/lib/languages/sql';
import yamlLang from 'highlight.js/lib/languages/yaml';

// Enregistrement des langages pour la coloration syntaxique
hljs.registerLanguage('javascript', jsLang);
hljs.registerLanguage('js', jsLang);
hljs.registerLanguage('typescript', tsLang);
hljs.registerLanguage('ts', tsLang);
hljs.registerLanguage('python', pyLang);
hljs.registerLanguage('py', pyLang);
hljs.registerLanguage('bash', bashLang);
hljs.registerLanguage('sh', bashLang);
hljs.registerLanguage('json', jsonLang);
hljs.registerLanguage('css', cssLang);
hljs.registerLanguage('html', xmlLang);
hljs.registerLanguage('xml', xmlLang);
hljs.registerLanguage('markdown', mdLang);
hljs.registerLanguage('md', mdLang);
hljs.registerLanguage('sql', sqlLang);
hljs.registerLanguage('yaml', yamlLang);
hljs.registerLanguage('yml', yamlLang);

export function createMarkdownRenderer(isFr: boolean) {
  const r = new marked.Renderer();

  r.code = ({ text, lang }: { text: string; lang?: string }) => {
    const language = (lang || '').toLowerCase();
    if (language && hljs.getLanguage(language)) {
      try {
        const highlighted = hljs.highlight(text, { language, ignoreIllegals: true }).value;
        return `<div class="my-4 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-950">
          <div class="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 select-none">
            <span>${language}</span>
          </div>
          <pre class="p-3.5 text-xs font-mono overflow-x-auto text-zinc-200 leading-relaxed"><code>${highlighted}</code></pre>
        </div>`;
      } catch {}
    }
    return `<pre class="p-3.5 text-xs font-mono my-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-950 text-zinc-200 overflow-x-auto"><code>${text}</code></pre>`;
  };

  r.blockquote = ({ text }: { text: string }) => {
    const match = text.match(/^\s*(?:<p>)?\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*<br\s*\/?>|\n)?([\s\S]*?)(?:<\/p>)?\s*$/i);
    if (match) {
      const type = match[1].toUpperCase();
      const content = match[2];
      const configs: Record<string, { label: string; border: string; bg: string; text: string }> = {
        NOTE: { label: isFr ? 'Note' : 'Note', border: 'border-sky-500', bg: 'bg-sky-500/5', text: 'text-sky-600 dark:text-sky-400' },
        TIP: { label: isFr ? 'Astuce' : 'Tip', border: 'border-emerald-500', bg: 'bg-emerald-500/5', text: 'text-emerald-600 dark:text-emerald-400' },
        IMPORTANT: { label: isFr ? 'Important' : 'Important', border: 'border-purple-500', bg: 'bg-purple-500/5', text: 'text-purple-600 dark:text-purple-400' },
        WARNING: { label: isFr ? 'Attention' : 'Warning', border: 'border-amber-500', bg: 'bg-amber-500/5', text: 'text-amber-600 dark:text-amber-400' },
        CAUTION: { label: isFr ? 'Avertissement' : 'Caution', border: 'border-red-500', bg: 'bg-red-500/5', text: 'text-red-600 dark:text-red-400' },
      };
      const c = configs[type] || configs.NOTE;
      return `<div class="my-4 p-4 rounded-xl border-l-4 ${c.border} ${c.bg} text-sm leading-relaxed">
        <div class="font-semibold text-xs uppercase tracking-wider mb-1.5 ${c.text}">${c.label}</div>
        <div class="text-zinc-700 dark:text-zinc-300">${content}</div>
      </div>`;
    }
    return `<blockquote class="border-l-4 border-[#FF6B35] pl-4 py-1 my-4 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-600 dark:text-zinc-400 rounded-r-lg">${text}</blockquote>`;
  };

  return r;
}

export function renderSafeHtml(markdown: string, renderer: any): string {
  if (!markdown.trim()) return '';
  try {
    const parsed = marked.parse(markdown, { gfm: true, breaks: true, renderer }) as string;
    return DOMPurify.sanitize(parsed, {
      ADD_TAGS: ['input', 'kbd', 'mark', 'details', 'summary', 'sub', 'sup'],
      ADD_ATTR: ['target', 'type', 'checked', 'disabled']
    });
  } catch {
    return '';
  }
}

export function highlightHtml(safeHtml: string): string {
  if (!safeHtml) return '';
  try {
    return hljs.highlight(safeHtml, { language: 'xml', ignoreIllegals: true }).value;
  } catch {
    return safeHtml;
  }
}

export function generateStandaloneHtml(safeHtml: string, isFr: boolean): string {
  return `<!DOCTYPE html>
<html lang="${isFr ? 'fr' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Document</title>
  <style>
    body { max-width: 820px; margin: 40px auto; padding: 0 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.65; color: #18181b; }
    h1, h2, h3, h4 { color: #09090b; }
    h1 { border-bottom: 1px solid #e4e4e7; padding-bottom: 8px; }
    h2 { border-bottom: 1px solid #e4e4e7; padding-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th, td { border: 1px solid #e4e4e7; padding: 10px 14px; text-align: left; }
    th { background: #f4f4f5; font-weight: 600; }
    tr:nth-child(even) { background: #fafafa; }
    code:not(pre code) { background: #f4f4f5; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #ea580c; }
    pre code { display: block; padding: 16px; background: #09090b; color: #f4f4f5; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 13px; line-height: 1.5; }
    blockquote { border-left: 4px solid #FF6B35; margin: 20px 0; padding: 8px 18px; background: #fafafa; color: #52525b; }
    img { max-width: 100%; height: auto; border-radius: 8px; }
    hr { border: 0; border-top: 1px solid #e4e4e7; margin: 32px 0; }
  </style>
</head>
<body>
${safeHtml}
</body>
</html>`;
}
