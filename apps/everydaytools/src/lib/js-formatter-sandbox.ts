import type { ExecutionLog } from './js-formatter-logic';

export interface SandboxResult {
  logs: ExecutionLog[];
  duration: number;
  returnValue?: unknown;
  error?: string;
}

export function runJsInSandbox(code: string, isFr: boolean): SandboxResult {
  if (!code.trim()) {
    return { logs: [], duration: 0 };
  }

  const logs: ExecutionLog[] = [];
  const startTime = performance.now();
  const nowStr = () => new Date().toLocaleTimeString();

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  try {
    const win = iframe.contentWindow;
    if (!win) {
      throw new Error(
        isFr
          ? "Impossible d'initialiser le bac à sable d'exécution"
          : 'Unable to initialize execution sandbox'
      );
    }

    const formatArg = (a: unknown): string => {
      if (typeof a === 'object' && a !== null) {
        try {
          return JSON.stringify(a, null, 2);
        } catch {
          return String(a);
        }
      }
      return String(a);
    };

    const winConsole = (win as any).console;
    if (winConsole) {
      winConsole.log = (...args: unknown[]) => {
        logs.push({ type: 'log', text: args.map(formatArg).join(' '), time: nowStr() });
      };
      winConsole.info = (...args: unknown[]) => {
        logs.push({ type: 'info', text: args.map(formatArg).join(' '), time: nowStr() });
      };
      winConsole.warn = (...args: unknown[]) => {
        logs.push({ type: 'warn', text: args.map(formatArg).join(' '), time: nowStr() });
      };
      winConsole.error = (...args: unknown[]) => {
        logs.push({ type: 'error', text: args.map(formatArg).join(' '), time: nowStr() });
      };
    }

    let codeToRun = code
      .replace(
        /:\s*(?:string|number|boolean|any|void|unknown|never|Record<[^>]+>|Array<[^>]+>|\[[^\]]+\])(?=[,)=;])/g,
        ''
      )
      .replace(/\bas\s+[a-zA-Z0-9_<>\[\]]+/g, '');

    const result = (win as any).eval(codeToRun);
    const duration = Math.round((performance.now() - startTime) * 10) / 10;

    if (result !== undefined) {
      logs.push({
        type: 'return',
        text: `${isFr ? 'Valeur retournée' : 'Return value'} : ${formatArg(result)}`,
        time: nowStr(),
      });
    }

    document.body.removeChild(iframe);
    return { logs, duration, returnValue: result };
  } catch (err: any) {
    const duration = Math.round((performance.now() - startTime) * 10) / 10;
    const errorMsg = err.name ? `${err.name}: ${err.message}` : String(err);
    logs.push({
      type: 'error',
      text: errorMsg,
      time: nowStr(),
    });
    try {
      document.body.removeChild(iframe);
    } catch {
      // Safely ignore if already detached
    }
    return { logs, duration, error: errorMsg };
  }
}
