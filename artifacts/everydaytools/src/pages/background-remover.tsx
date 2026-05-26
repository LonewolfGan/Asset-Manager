import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';

export default function BackgroundRemover() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingEngine, setLoadingEngine] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0); setLoadingEngine(true);
    try {
      const file = files[0];
      const { removeBackground } = await import('@imgly/background-removal');
      setLoadingEngine(false);
      
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          setProgress(Math.round((current / total) * 100));
        }
      });
      
      setResult({ blob, filename: file.name.replace(/\.[^/.]+$/, '_nobg.png'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); setLoadingEngine(false); }
  };

  const faqs = [
    { q: "Is my image uploaded anywhere?", a: "No, processing happens entirely on your device." },
    { q: "Why does it take long the first time?", a: "The AI model (~40MB) must be downloaded and cached in your browser." },
    { q: "Does it work well with hair?", a: "Yes, the AI model is trained to handle complex edges like hair and fur." },
    { q: "What happens if the background is complex?", a: "It usually works well, but highly cluttered backgrounds might have minor artifacts." },
    { q: "Can I swap the AI model?", a: "Currently, this uses the default @imgly/background-removal model optimized for web." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Image Tools', 'Background Remover']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Background Remover</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Remove image backgrounds entirely in your browser using local AI.</p>
      
      <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius)', marginBottom: 24, fontSize: 14 }}>
        <strong>Note:</strong> The AI model is downloaded once and cached in your browser (~40MB). Processing is entirely on your device — no image is uploaded.
      </div>
      
      <FileUpload accept={['image/jpeg', 'image/png', 'image/webp']} maxSizeMB={10} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Remove Background
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label={loadingEngine ? "Loading AI model..." : "Processing image..."} />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      
      {result && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Original</p>
              <img src={URL.createObjectURL(files[0])} style={{ width: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} alt="Original" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Result</p>
              <div style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h10v10H0zm10 10h10v10H10z\' fill=\'%23e5e5e5\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <img src={URL.createObjectURL(result.blob)} style={{ width: '100%', display: 'block' }} alt="Result" />
              </div>
            </div>
          </div>
          <ResultPanel {...result} />
        </div>
      )}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
