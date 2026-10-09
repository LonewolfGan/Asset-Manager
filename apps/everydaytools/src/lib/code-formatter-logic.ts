/**
 * Pure formatting and minification engines for CSS and HTML.
 */

export type CodeIndent = 2 | 4 | '\t';

/**
 * Clean and format CSS stylesheets with nested block support
 */
export function formatCss(rawCss: string, indentOption: CodeIndent = 2): string {
  if (!rawCss.trim()) return '';

  const indentStr = indentOption === '\t' ? '\t' : ' '.repeat(indentOption);
  // Normalize whitespace and comments
  let clean = rawCss
    .replace(/\r\n/g, '\n')
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.trim())
    .replace(/\s+/g, ' ');

  let formatted = '';
  let level = 0;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];

    if (char === '{') {
      level++;
      formatted = formatted.trimEnd() + ' {\n' + indentStr.repeat(level);
    } else if (char === '}') {
      level = Math.max(0, level - 1);
      formatted = formatted.trimEnd() + '\n' + indentStr.repeat(level) + '}\n\n' + indentStr.repeat(level);
    } else if (char === ';') {
      formatted += ';\n' + indentStr.repeat(level);
    } else if (char === ':') {
      formatted += ': ';
      // Skip extra spaces after colon
      while (clean[i + 1] === ' ') i++;
    } else {
      formatted += char;
    }
  }

  return formatted
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\n\s*;/g, ';')
    .trim();
}

/**
 * Minify CSS stylesheet aggressively for web production
 */
export function minifyCss(rawCss: string): string {
  if (!rawCss.trim()) return '';
  return rawCss
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/\s*([:;{}])\s*/g, '$1') // remove spaces around delimiters
    .replace(/;}/g, '}') // remove useless trailing semicolons
    .replace(/\s+/g, ' ') // collapse remaining spaces
    .trim();
}

/**
 * Format HTML markup with proper tree indentation and void tag recognition
 */
export function formatHtml(rawHtml: string, indentOption: CodeIndent = 2): string {
  if (!rawHtml.trim()) return '';

  const sp = indentOption === '\t' ? '\t' : ' '.repeat(indentOption);
  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
    'meta', 'param', 'source', 'track', 'wbr', '!doctype',
  ]);

  let result = '';
  let level = 0;
  const tokens = rawHtml.replace(/\r\n/g, '\n').split(/(<[^>]+>)/g);

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('</')) {
      // Closing tag
      level = Math.max(0, level - 1);
      result += `\n${sp.repeat(level)}${trimmed}`;
    } else if (trimmed.startsWith('<') && !trimmed.startsWith('<!--')) {
      // Opening or self-closing tag
      const match = trimmed.match(/^<([a-zA-Z0-9-]+)/);
      const tag = match ? match[1].toLowerCase() : '';
      const isVoid = voidTags.has(tag) || trimmed.endsWith('/>');

      result += `\n${sp.repeat(level)}${trimmed}`;
      if (!isVoid) {
        level++;
      }
    } else {
      // Text content
      result += `\n${sp.repeat(level)}${trimmed}`;
    }
  }

  return result.trimStart();
}

/**
 * Minify HTML markup
 */
export function minifyHtml(rawHtml: string): string {
  if (!rawHtml.trim()) return '';
  return rawHtml
    .replace(/<!--[\s\S]*?-->/g, '') // remove comments
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

/**
 * Format JavaScript/TypeScript code cleanly with indentation and operator spacing
 */
export function formatJs(rawJs: string, indentOption: CodeIndent = 2): string {
  if (!rawJs.trim()) return '';

  const indentStr = indentOption === '\t' ? '\t' : ' '.repeat(indentOption);
  let formatted = '';
  let level = 0;
  let inString: false | '"' | "'" | '`' = false;
  let inLineComment = false;
  let inBlockComment = false;

  const src = rawJs.replace(/\r\n/g, '\n');

  for (let i = 0; i < src.length; i++) {
    const char = src[i];
    const next = src[i + 1];

    // Inside comments
    if (inLineComment) {
      formatted += char;
      if (char === '\n') {
        inLineComment = false;
        formatted += indentStr.repeat(level);
      }
      continue;
    }
    if (inBlockComment) {
      formatted += char;
      if (char === '*' && next === '/') {
        formatted += '/';
        i++;
        inBlockComment = false;
      }
      continue;
    }

    // Comment starts
    if (!inString && char === '/' && next === '/') {
      inLineComment = true;
      formatted += '//';
      i++;
      continue;
    }
    if (!inString && char === '/' && next === '*') {
      inBlockComment = true;
      formatted += '/*';
      i++;
      continue;
    }

    // String literals
    if (inString) {
      formatted += char;
      if (char === '\\') {
        // Escaped character
        formatted += next ?? '';
        i++;
      } else if (char === inString) {
        inString = false;
      }
      continue;
    } else if (char === '"' || char === "'" || char === '`') {
      inString = char;
      formatted += char;
      continue;
    }

    // Empty braces {}
    if (char === '{' && next === '}') {
      formatted += '{}';
      i++;
      continue;
    }

    // Code structure
    if (char === '{') {
      level++;
      formatted = formatted.trimEnd() + ' {\n' + indentStr.repeat(level);
    } else if (char === '}') {
      level = Math.max(0, level - 1);
      formatted = formatted.trimEnd() + '\n' + indentStr.repeat(level) + '}\n' + indentStr.repeat(level);
    } else if (char === ';') {
      formatted += ';\n' + indentStr.repeat(level);
    } else if (char === '\n') {
      // Ignore multiple extra empty lines
      if (!formatted.endsWith('\n\n')) {
        formatted += '\n' + indentStr.repeat(level);
      }
    } else {
      formatted += char;
    }
  }

  return formatted
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\{\s*\}/g, '{}')
    .trim();
}

/**
 * Minify JavaScript code by removing comments and unneeded whitespaces
 */
export function minifyJs(rawJs: string): string {
  if (!rawJs.trim()) return '';
  return rawJs
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
    .replace(/\/\/[^\n]*/g, '') // remove line comments
    .replace(/\s*([=+\-*/%&|!<>?:;,{}()[\]])\s*/g, '$1') // collapse around operators
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * CSS, HTML and JS sample presets for immediate testing
 */
export const CODE_SAMPLES = {
  css: `.btn-primary{background-color:#2563eb;color:#ffffff;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:600;border:none;cursor:pointer;transition:all .2s ease}.btn-primary:hover{background-color:#1d4ed8;transform:translateY(-1px)}.card{background:#ffffff;border:1px solid #e2e8f0;border-radius:1rem;padding:1.5rem;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)}@media (max-width:768px){.card{padding:1rem}}`,
  html: `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>EverydayTools</title><link rel="stylesheet" href="style.css"></head><body><header class="navbar"><div class="logo">EverydayTools</div><nav><ul><li><a href="#home">Accueil</a></li><li><a href="#tools">Outils</a></li></ul></nav></header><main><section class="hero"><h1>Outils Gratuits & Rapides</h1><p>Traitement local sécurisé sans upload.</p><button class="btn-primary">Commencer</button></section></main></body></html>`,
  js: `async function fetchUserData(userId,options={}){try{const response=await fetch(\`/api/users/\${userId}\`,{headers:{'Content-Type':'application/json'}});if(!response.ok){throw new Error(\`HTTP error! status: \${response.status}\`);}const data=await response.json();return{success:true,data,timestamp:Date.now()};}catch(error){console.error('Failed to load user:',error);return{success:false,error:error.message};}}`,
};

