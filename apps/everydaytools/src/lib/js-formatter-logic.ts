import {
  type QuotesStyle,
  tokenizeJs,
} from './js-formatter-parser';

export type { QuotesStyle } from './js-formatter-parser';

export type Mode = 'format' | 'minify';
export type Language = 'javascript' | 'typescript';
export type IndentSize = 2 | 4 | 'tab';
export type ViewOutput = 'code' | 'console';

export interface ExecutionLog {
  type: 'log' | 'info' | 'warn' | 'error' | 'return';
  text: string;
  time: string;
}

export interface JsMetrics {
  inputChars: number;
  inputBytes: number;
  outputChars: number;
  outputBytes: number;
  totalFunctions: number;
  totalVariables: number;
  savingsBytes: number;
  savingsPercent: number;
}

export { tokenizeJs };

export function beautifyJs(
  code: string,
  indentSize: IndentSize,
  stripComments = false,
  semicolons = true,
  quotes: QuotesStyle = 'preserve'
): string {
  if (!code.trim()) return '';
  const sp = indentSize === 'tab' ? '\t' : ' '.repeat(indentSize);
  const tokens = tokenizeJs(code, stripComments, quotes);

  const lines: string[] = [];
  let currentLine = '';
  let level = 0;
  let forDepth = 0;

  function flushLine() {
    const trimmed = currentLine.trim();
    if (trimmed) lines.push(sp.repeat(level) + trimmed);
    currentLine = '';
  }

  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx];
    const prev = tokens[idx - 1];
    const next = tokens[idx + 1];

    if (t.type === 'comment-single') {
      flushLine();
      lines.push(sp.repeat(level) + t.value);
      continue;
    }

    if (t.type === 'comment-multi') {
      currentLine += (currentLine ? ' ' : '') + t.value + ' ';
      continue;
    }

    if (t.type === 'symbol') {
      if (t.value === '{') {
        currentLine += ' {';
        flushLine();
        level++;
        continue;
      }
      if (t.value === '}') {
        flushLine();
        level = Math.max(0, level - 1);
        if (next && next.type === 'word' && ['else', 'catch', 'finally'].includes(next.value)) {
          currentLine = '} ';
        } else {
          lines.push(sp.repeat(level) + '}');
        }
        continue;
      }
      if (t.value === '(') {
        if (prev && prev.type === 'word' && ['if', 'for', 'while', 'switch', 'catch'].includes(prev.value)) {
          if (prev.value === 'for') forDepth++;
          currentLine += ' (';
        } else {
          currentLine += '(';
        }
        continue;
      }
      if (t.value === ')') {
        if (forDepth > 0) forDepth = Math.max(0, forDepth - 1);
        currentLine += ')';
        continue;
      }
      if (t.value === '[' || t.value === ']') {
        currentLine += t.value;
        continue;
      }
      if (t.value === ';') {
        if (forDepth > 0) {
          currentLine += '; ';
        } else {
          if (semicolons) currentLine += ';';
          flushLine();
        }
        continue;
      }
      if (t.value === ',' || t.value === ':') {
        currentLine += t.value + ' ';
        continue;
      }
      if (t.value === '.') {
        currentLine += '.';
        continue;
      }
      if (t.value === '?') {
        currentLine += ' ? ';
        continue;
      }
      if (['<', '>'].includes(t.value)) {
        if (t.value === '<' && prev && prev.type === 'word' && ['Array', 'Promise', 'Map', 'Set', 'Record', 'Partial', 'Pick', 'Omit'].includes(prev.value)) {
          currentLine += '<';
        } else if (t.value === '>' && next && next.type === 'symbol' && next.value === '(') {
          currentLine += '>';
        } else {
          currentLine += ` ${t.value} `;
        }
        continue;
      }
      if (['=', '+', '-', '*', '/', '%', '!'].includes(t.value)) {
        if (t.value === '!' && next && (next.type === 'word' || next.type === 'symbol')) {
          currentLine += '!';
        } else if (t.value === '-' && prev && (prev.type === 'symbol' || prev.type === 'operator') && next && next.type === 'word') {
          currentLine += '-';
        } else {
          currentLine += ` ${t.value} `;
        }
        continue;
      }
      currentLine += t.value;
      continue;
    }

    if (t.type === 'operator') {
      if (t.value === '++' || t.value === '--' || t.value === '?.') {
        currentLine += t.value;
      } else {
        currentLine += ` ${t.value} `;
      }
      continue;
    }

    if (t.type === 'word' || t.type === 'string') {
      if (currentLine.length > 0 && !currentLine.endsWith(' ') && !currentLine.endsWith('(') && !currentLine.endsWith('[') && !currentLine.endsWith('<') && !currentLine.endsWith('.') && !currentLine.endsWith('!') && !currentLine.endsWith(': ') && !currentLine.endsWith(', ')) {
        currentLine += ' ';
      }
      currentLine += t.value;
      continue;
    }
  }

  flushLine();

  return lines
    .join('\n')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\[\s+/g, '[')
    .replace(/\s+\]/g, ']')
    .trim();
}

export function minifyJs(code: string, stripComments = true): string {
  if (!code.trim()) return '';
  let res = code;

  const strings: string[] = [];
  res = res.replace(/(['"`])(?:(?!\1|\\).|\\.)*\1/gs, (match) => {
    strings.push(match);
    return `___JS_STR_${strings.length - 1}___`;
  });

  if (stripComments) {
    res = res.replace(/\/\*[\s\S]*?\*\//g, '');
    res = res.replace(/\/\/.*$/gm, '');
  }

  res = res.replace(/\s*([{}();,:?+\-*/%<>=!&|^~])\s*/g, '$1');
  res = res.replace(
    /\b(return|const|let|var|function|new|typeof|instanceof|import|export|from|as|class|extends|throw|case|delete|void|yield|await|async|type|interface|default)\s+/g,
    '$1 '
  );
  res = res.replace(/\s+/g, ' ');
  res = res.replace(/___JS_STR_(\d+)___/g, (_, id) => strings[Number(id)]);

  return res.trim();
}

export function computeJsMetrics(input: string, output: string): JsMetrics {
  const inputChars = input.length;
  const inputBytes = new Blob([input]).size;
  const outputChars = output.length;
  const outputBytes = new Blob([output]).size;

  const funcMatches = input.match(/\bfunction\b|=>/g) || [];
  const totalFunctions = funcMatches.length;

  const varMatches = input.match(/\b(const|let|var)\b/g) || [];
  const totalVariables = varMatches.length;

  const savingsBytes = Math.max(0, inputBytes - outputBytes);
  const savingsPercent = inputBytes > 0 ? Math.round((savingsBytes / inputBytes) * 100) : 0;

  return {
    inputChars,
    inputBytes,
    outputChars,
    outputBytes,
    totalFunctions,
    totalVariables,
    savingsBytes,
    savingsPercent,
  };
}
