import { CheckCircle2, Download, Copy } from 'lucide-react';
import { useState } from 'react';

interface ResultPanelProps {
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
  blob: Blob;
  textOutput?: string;
}

export default function ResultPanel({ filename, sizeBefore, sizeAfter, blob, textOutput }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const formatSize = (bytes: number) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (textOutput) {
      await navigator.clipboard.writeText(textOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-[var(--success)] rounded-[var(--radius)] p-6 mt-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle2 className="w-6 h-6 text-[var(--success)]" />
        <h3 className="text-xl font-medium text-[var(--text)]">Ready to download</h3>
      </div>
      
      <div className="mb-6 p-4 bg-[var(--bg)] rounded-md">
        <p className="font-medium text-[var(--text)] truncate mb-1">{filename}</p>
        <div className="text-sm text-[var(--muted)] flex items-center gap-2">
          {sizeBefore && (
            <>
              <span className="line-through">{formatSize(sizeBefore)}</span>
              <span>→</span>
            </>
          )}
          <span className="font-medium text-[var(--text)]">{formatSize(sizeAfter)}</span>
          {sizeBefore && sizeAfter < sizeBefore && (
            <span className="text-[var(--success)] ml-2 text-xs bg-[var(--success)]/10 px-2 py-0.5 rounded-full">
              -{Math.round((1 - sizeAfter / sizeBefore) * 100)}%
            </span>
          )}
        </div>
      </div>

      <button 
        onClick={handleDownload}
        className="w-full md:w-auto px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <Download className="w-5 h-5" />
        Download File
      </button>

      {textOutput && (
        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-[var(--text)]">Extracted Text</h4>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className="text-sm px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg)] flex items-center gap-1 transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy all'}
              </button>
              <button 
                onClick={handleDownload}
                className="text-sm px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--bg)] flex items-center gap-1 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download .txt
              </button>
            </div>
          </div>
          <pre className="font-mono text-sm bg-[var(--bg)] p-4 rounded-md overflow-y-auto max-h-[400px] whitespace-pre-wrap border border-[var(--border)] text-[var(--text)]">
            {textOutput}
          </pre>
        </div>
      )}
    </div>
  );
}
