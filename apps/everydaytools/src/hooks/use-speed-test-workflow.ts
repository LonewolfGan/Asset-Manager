import { useState, useRef, useCallback } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import { assessNetworkQuality, type SpeedTestAssessment } from '@/lib/speed-test-logic';
import { formatSpeedReportSummary } from '@/lib/speed-test-dial-logic';
import {
  measurePingAndJitter,
  measureDownloadSpeed,
  measureUploadSpeed,
} from '@/lib/speed-test-network-runner';

export type TestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'complete' | 'error';

export function useSpeedTestWorkflow(isFr: boolean) {
  const [phase, setPhase] = useState<TestPhase>('idle');
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [assessment, setAssessment] = useState<SpeedTestAssessment | null>(null);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelTest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setPhase('idle');
    setCurrentSpeed(0);
  }, []);

  const runTest = useCallback(async () => {
    cancelTest();
    const ac = new AbortController();
    abortControllerRef.current = ac;

    setPhase('ping');
    setCurrentSpeed(0);
    setPing(null);
    setJitter(null);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setAssessment(null);
    setWaveform([]);
    setErrorMessage(null);

    trackToolUsed('speed-test', 'calculators');

    try {
      // 1. PING & JITTER
      const { ping: finalPing, jitter: finalJitter } = await measurePingAndJitter(
        ac,
        (currentAvg) => setPing(currentAvg)
      );
      setPing(finalPing);
      setJitter(finalJitter);

      // 2. DOWNLOAD BANDWIDTH
      setPhase('download');
      const wavePoints: number[] = [];
      const finalDownloadMbps = await measureDownloadSpeed(ac, (instantMbps) => {
        setCurrentSpeed(instantMbps);
        wavePoints.push(instantMbps);
        setWaveform([...wavePoints.slice(-25)]);
      });

      setDownloadSpeed(finalDownloadMbps);
      setCurrentSpeed(finalDownloadMbps);

      await new Promise((r) => setTimeout(r, 200));

      // 3. UPLOAD BANDWIDTH
      setPhase('upload');
      setCurrentSpeed(0);
      const finalUploadMbps = await measureUploadSpeed(
        ac,
        finalDownloadMbps,
        (instantMbps) => {
          setCurrentSpeed(instantMbps);
          wavePoints.push(instantMbps);
          setWaveform([...wavePoints.slice(-25)]);
        }
      );

      setUploadSpeed(finalUploadMbps);
      setCurrentSpeed(finalUploadMbps);

      // 4. NETWORK QUALITY ASSESSMENT
      const assessmentResult = assessNetworkQuality({
        downloadMbps: finalDownloadMbps,
        uploadMbps: finalUploadMbps,
        pingMs: finalPing,
        jitterMs: finalJitter,
      });

      setAssessment(assessmentResult);
      setPhase('complete');
    } catch (err: unknown) {
      if (ac.signal.aborted || (err instanceof Error && err.message === 'Aborted')) return;
      setPhase('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : isFr
          ? 'Impossible de compléter le test de connexion. Vérifiez votre accès internet.'
          : 'Unable to complete network speed benchmark. Please check your internet connection.'
      );
    } finally {
      abortControllerRef.current = null;
    }
  }, [cancelTest, isFr]);

  const getSummaryText = useCallback(() => {
    return formatSpeedReportSummary({
      downloadSpeed: downloadSpeed ?? 0,
      uploadSpeed: uploadSpeed ?? 0,
      ping: ping ?? 0,
      jitter: jitter ?? 0,
      streamingMaxResolution: assessment?.streamingMaxResolution ?? 'HD',
      gamingRating: assessment?.suitability?.gaming?.rating ?? 'Good',
      isFr,
    });
  }, [assessment, downloadSpeed, uploadSpeed, ping, jitter, isFr]);

  return {
    phase,
    currentSpeed,
    ping,
    jitter,
    downloadSpeed,
    uploadSpeed,
    assessment,
    waveform,
    errorMessage,
    runTest,
    cancelTest,
    getSummaryText,
  };
}
