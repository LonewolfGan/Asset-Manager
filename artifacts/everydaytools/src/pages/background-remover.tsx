import { useState, useRef } from 'react';
import JSZip from 'jszip';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import FileUpload from '@/components/FileUpload';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

type ItemStatus = 'pending' | 'processing' | 'done' | 'error';

interface QueueItem {
  file: File;
  status: ItemStatus;
  resultBlob?: Blob;
  error?: string;
  previewUrl?: string;
  resultUrl?: string;
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" fill="var(--accent)" />
      <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
      <circle cx="7" cy="7" r="5.5" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
      <path d="M5 5l4 4M9 5l-4 4" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export default function BackgroundRemover() {
  const { t } = useLocale();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const cancelledRef = useRef(false);

  const handleFiles = (files: File[]) => {
    const items: QueueItem[] = files.map(file => ({
      file,
      status: 'pending',
      previewUrl: URL.createObjectURL(file),
    }));
    setQueue(items);
    setDoneCount(0);
  };

  const updateItem = (index: number, patch: Partial<QueueItem>) => {
    setQueue(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleProcess = async () => {
    if (queue.length === 0) return;
    cancelledRef.current = false;
    setIsProcessing(true);
    setDoneCount(0);

    let completed = 0;

    for (let i = 0; i < queue.length; i++) {
      if (cancelledRef.current) break;

      updateItem(i, { status: 'processing', error: undefined });

      try {
        const formData = new FormData();
        formData.append('file', queue[i].file);

        const response = await fetch('/api/remove-background', {
          method: 'POST',
          body: formData,
        });

        if (cancelledRef.current) break;

        if (!response.ok) {
          let msg = 'Failed';
          try { const j = await response.json(); if (j?.error) msg = j.error; } catch {}
          updateItem(i, { status: 'error', error: msg });
          trackToolError('background-remover', 'general-error');
          completed++;
          setDoneCount(completed);
          continue;
        }

        const blob = await response.blob();
        const resultUrl = URL.createObjectURL(blob);

        if (cancelledRef.current) break;

        updateItem(i, { status: 'done', resultBlob: blob, resultUrl });
        trackToolUsed('background-remover', 'images');
        completed++;
        setDoneCount(completed);
      } catch (e) {
        if (cancelledRef.current) break;
        const msg = e instanceof Error ? e.message : 'Failed';
        updateItem(i, { status: 'error', error: msg });
        completed++;
        setDoneCount(completed);
      }
    }

    setIsProcessing(false);
  };

  const handleCancel = () => {
    cancelledRef.current = true;
    setIsProcessing(false);
  };

  const handleDownloadAll = async () => {
    const done = queue.filter(q => q.status === 'done' && q.resultBlob);
    if (done.length === 1) {
      const item = done[0];
      downloadBlob(item.resultBlob!, item.file.name.replace(/\.[^/.]+$/, '_nobg.png'));
      return;
    }
    const zip = new JSZip();
    for (const item of done) {
      const filename = item.file.name.replace(/\.[^/.]+$/, '_nobg.png');
      zip.file(filename, item.resultBlob!);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, 'backgrounds_removed.zip');
  };

  const handleReset = () => {
    queue.forEach(q => {
      if (q.previewUrl) URL.revokeObjectURL(q.previewUrl);
      if (q.resultUrl) URL.revokeObjectURL(q.resultUrl);
    });
    setQueue([]);
    setDoneCount(0);
  };

  const doneItems = queue.filter(q => q.status === 'done');
  const hasResults = doneItems.length > 0;
  const allFinished = !isProcessing && queue.length > 0 && queue.every(q => q.status === 'done' || q.status === 'error');
  const overallProgress = queue.length > 0 ? Math.round((doneCount / queue.length) * 100) : 0;

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Image Tools', 'Background Remover']} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>
          {t.tools['background-remover']?.title ?? 'Background Remover'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>
          {t.tools['background-remover']?.description ?? 'Remove backgrounds from photos instantly. Free, no account required.'}
        </p>

        {!isProcessing && !allFinished && (
          <FileUpload
            accept={['image/jpeg', 'image/png', 'image/webp']}
            maxSizeMB={20}
            multiple={true}
            onFiles={handleFiles}
          />
        )}

        {queue.length > 0 && !isProcessing && !allFinished && (
          <button
            onClick={handleProcess}
            style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', width: '100%' }}
          >
            Remove Background{queue.length > 1 ? ` — ${queue.length} images` : ''}
          </button>
        )}

        {(isProcessing || (queue.length > 0 && doneCount > 0 && !allFinished)) && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)' }}>
                Processing {doneCount} / {queue.length}
              </span>
              {isProcessing && (
                <button
                  onClick={handleCancel}
                  style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '4px 12px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-ui)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
            </div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${overallProgress}%`, background: 'var(--accent)', borderRadius: 99, transition: 'width 300ms ease' }} />
            </div>
          </div>
        )}

        {queue.length > 0 && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {queue.map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                    {item.previewUrl && <img src={item.previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.file.name}
                    </p>
                    {item.status === 'error' && (
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--danger)', margin: '2px 0 0' }}>{item.error}</p>
                    )}
                    {item.status === 'done' && (
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                        {(item.resultBlob!.size / 1024).toFixed(0)} KB PNG
                      </p>
                    )}
                    {item.status === 'processing' && (
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--accent)', margin: '2px 0 0' }}>Processing...</p>
                    )}
                    {item.status === 'pending' && (
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>Waiting...</p>
                    )}
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {item.status === 'pending' && <div style={{ width: 14, height: 14, borderRadius: 99, background: 'var(--border-strong)' }} />}
                    {item.status === 'processing' && <SpinnerIcon />}
                    {item.status === 'done' && <CheckIcon />}
                    {item.status === 'error' && <ErrorIcon />}
                    {item.status === 'done' && (
                      <button
                        onClick={() => downloadBlob(item.resultBlob!, item.file.name.replace(/\.[^/.]+$/, '_nobg.png'))}
                        style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-ui)', color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        Download
                      </button>
                    )}
                  </div>
                </div>

                {item.status === 'done' && item.resultUrl && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid var(--border)' }}>
                    <div style={{ padding: 12, borderRight: '1px solid var(--border)' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--text-tertiary)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Original</p>
                      <img src={item.previewUrl} alt="Original" style={{ width: '100%', borderRadius: 6, border: '1px solid var(--border)' }} />
                    </div>
                    <div style={{ padding: 12 }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--text-tertiary)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Result</p>
                      <div style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h8v8H0zm8 8h8v8H8z\' fill=\'%23e5e5e5\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', borderRadius: 6, border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <img src={item.resultUrl} alt="Result" style={{ width: '100%', display: 'block' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {allFinished && (
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            {hasResults && (
              <button
                onClick={handleDownloadAll}
                style={{ flex: 1, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer' }}
              >
                {doneItems.length > 1 ? `Download all as ZIP (${doneItems.length} images)` : 'Download'}
              </button>
            )}
            <button
              onClick={handleReset}
              style={{ flex: hasResults ? '0 0 auto' : 1, padding: '12px 20px', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              New batch
            </button>
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="background-remover" />
    </>
  );
}
