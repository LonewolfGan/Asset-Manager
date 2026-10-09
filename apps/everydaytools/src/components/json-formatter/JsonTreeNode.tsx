import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { toast } from 'sonner';

export interface JsonTreeNodeProps {
  data: any;
  keyName?: string;
  path: string;
  filter: string;
  defaultOpen: boolean;
  isFr: boolean;
}

export function JsonTreeNode({
  data,
  keyName,
  path,
  filter,
  defaultOpen,
  isFr,
}: JsonTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  const isObject = data !== null && typeof data === 'object';
  const isArray = Array.isArray(data);

  const strRep = JSON.stringify(data)?.toLowerCase() ?? '';
  const keyStr = (keyName ?? '').toLowerCase();
  const matches = !filter || keyStr.includes(filter) || strRep.includes(filter);

  if (!matches) return null;

  const currentPath = keyName ? (path ? `${path}.${keyName}` : keyName) : path;

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPath) {
      navigator.clipboard.writeText(currentPath);
      toast.success(
        isFr ? `Chemin « ${currentPath} » copié` : `Path "${currentPath}" copied`
      );
    }
  };

  if (!isObject) {
    let valueColor = 'text-emerald-600 dark:text-emerald-400';
    if (typeof data === 'number') valueColor = 'text-blue-600 dark:text-blue-400';
    if (typeof data === 'boolean') valueColor = 'text-orange-600 dark:orange-400';
    if (data === null) valueColor = 'text-zinc-400';

    return (
      <div className="flex items-center gap-1.5 py-0.5 px-1.5 font-mono text-xs rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/60 group">
        {keyName !== undefined && (
          <ActionTooltip
            label={isFr ? 'Cliquer pour copier le chemin' : 'Click to copy path'}
            side="top"
          >
            <span
              onClick={handleCopyPath}
              className="text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer hover:underline"
            >
              "{keyName}":
            </span>
          </ActionTooltip>
        )}
        <span className={`${valueColor} break-all`}>
          {typeof data === 'string' ? `"${data}"` : String(data)}
        </span>
      </div>
    );
  }

  const entries = isArray
    ? data.map((v: any, i: number) => [String(i), v])
    : Object.entries(data);

  return (
    <div className="font-mono text-xs">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 py-0.5 px-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/60 cursor-pointer select-none group"
      >
        <span className="text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </span>

        {keyName !== undefined && (
          <ActionTooltip
            label={isFr ? 'Cliquer pour copier le chemin' : 'Click to copy path'}
            side="top"
          >
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleCopyPath(e);
              }}
              className="text-zinc-800 dark:text-zinc-200 font-semibold hover:underline"
            >
              "{keyName}":
            </span>
          </ActionTooltip>
        )}

        <span className="text-zinc-400 text-[11px]">
          {isArray
            ? `[ ${entries.length} items ]`
            : `{ ${entries.length} ${isFr ? 'clés' : 'keys'} }`}
        </span>
      </div>

      {isOpen && (
        <div className="pl-4 border-l border-zinc-200 dark:border-white/10 ml-2.5 my-0.5 space-y-0.5">
          {entries.map(([childKey, childVal]) => (
            <JsonTreeNode
              key={childKey}
              data={childVal}
              keyName={childKey}
              path={isArray ? `${currentPath}[${childKey}]` : currentPath}
              filter={filter}
              defaultOpen={defaultOpen}
              isFr={isFr}
            />
          ))}
        </div>
      )}
    </div>
  );
}
