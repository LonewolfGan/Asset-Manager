export type QuotesStyle = 'preserve' | 'single' | 'double';

export interface JsToken {
  type: 'comment-single' | 'comment-multi' | 'string' | 'operator' | 'symbol' | 'word';
  value: string;
}

export function tokenizeJs(
  code: string,
  stripComments = false,
  quotes: QuotesStyle = 'preserve'
): JsToken[] {
  const tokens: JsToken[] = [];
  let i = 0;
  const n = code.length;

  while (i < n) {
    const c = code[i];

    if (c === '/' && code[i + 1] === '/') {
      const start = i;
      i += 2;
      while (i < n && code[i] !== '\n') i++;
      const val = code.slice(start, i);
      if (!stripComments) tokens.push({ type: 'comment-single', value: val });
      continue;
    }

    if (c === '/' && code[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < n && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      const val = code.slice(start, i);
      if (!stripComments) tokens.push({ type: 'comment-multi', value: val });
      continue;
    }

    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      const start = i;
      i++;
      while (i < n && code[i] !== quote) {
        if (code[i] === '\\') i++;
        i++;
      }
      i++;
      let val = code.slice(start, i);
      if (quote !== '`') {
        if (quotes === 'single' && quote === '"') {
          const inner = val.slice(1, -1);
          if (!inner.includes("'")) val = `'${inner.replace(/\\"/g, '"')}'`;
        } else if (quotes === 'double' && quote === "'") {
          const inner = val.slice(1, -1);
          if (!inner.includes('"')) val = `"${inner.replace(/\\'/g, "'")}"`;
        }
      }
      tokens.push({ type: 'string', value: val });
      continue;
    }

    if (/\s/.test(c)) {
      i++;
      continue;
    }

    const three = code.slice(i, i + 3);
    if (['===', '!==', '>>>', '<<=', '>>=', '&&=', '||=', '??='].includes(three)) {
      tokens.push({ type: 'operator', value: three });
      i += 3;
      continue;
    }

    const two = code.slice(i, i + 2);
    if (['=>', '==', '!=', '<=', '>=', '&&', '||', '??', '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '**', '?.', '::'].includes(two)) {
      tokens.push({ type: 'operator', value: two });
      i += 2;
      continue;
    }

    const symbols = ['{', '}', '(', ')', '[', ']', ';', ',', '.', ':', '?', '+', '-', '*', '/', '%', '<', '>', '=', '!', '&', '|', '^', '~'];
    if (symbols.includes(c)) {
      tokens.push({ type: 'symbol', value: c });
      i++;
      continue;
    }

    const start = i;
    while (i < n && !/\s/.test(code[i]) && !symbols.includes(code[i]) && code[i] !== "'" && code[i] !== '"' && code[i] !== '`') {
      i++;
    }
    const word = code.slice(start, i);
    if (word) {
      tokens.push({ type: 'word', value: word });
    } else {
      i++;
    }
  }

  return tokens;
}
