import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResultPanel, { ResultPanelProps } from '@/components/ResultPanel';

export type ToolProcessorStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';
export type ToolProcessorCategory = 'quick' | 'medium' | 'heavy';

export interface ToolProcessorProps {
  status: ToolProcessorStatus;
  category?: ToolProcessorCategory;
  steps?: string[];
  currentStep?: number;
  beforePreview?: string;
  afterPreview?: string;
  comparisonMode?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onReset?: () => void;
  // Optional delegate props for ResultPanel when not in comparisonMode
  resultProps?: Partial<ResultPanelProps>;
}

export default function ToolProcessor({
  status,
  category = 'medium',
  steps = [],
  currentStep = 0,
  beforePreview,
  afterPreview,
  comparisonMode = false,
  errorMessage,
  onRetry,
  onReset,
  resultProps,
}: ToolProcessorProps) {
  // Step message rotation for medium / heavy
  const [autoStepIndex, setAutoStepIndex] = useState(currentStep);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAutoStepIndex(currentStep);
  }, [currentStep]);

  useEffect(() => {
    if (status !== 'processing' && status !== 'uploading') return;
    if (category === 'quick') return;

    const defaultMediumSteps = ['Analyzing document...', 'Processing file...', 'Almost done...'];
    const activeSteps = steps.length > 0 ? steps : defaultMediumSteps;

    const interval = setInterval(() => {
      setAutoStepIndex((prev) => (prev + 1) % activeSteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [status, category, steps]);

  // Comparison slider dragging logic
  const handlePointerMove = useCallback(
    (clientX: number) => {
      if (!sliderContainerRef.current) return;
      const rect = sliderContainerRef.current.getBoundingClientRect();
      const pos = ((clientX - rect.left) / rect.width) * 100;
      setSliderPos(Math.max(0, Math.min(100, pos)));
    },
    []
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) handlePointerMove(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handlePointerMove(e.touches[0].clientX);
    };
    const onStop = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onStop);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onStop);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onStop);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onStop);
    };
  }, [isDragging, handlePointerMove]);

  if (status === 'idle') return null;

  // ─── ERROR STATE ──────────────────────────────────────────
  if (status === 'error') {
    const displayError =
      errorMessage && !errorMessage.includes('at ') && !errorMessage.includes('Error:') && !errorMessage.includes('Traceback')
        ? errorMessage
        : 'Unable to complete the process. Please check your file and try again.';

    return (
      <div
        role="alert"
        style={{
          marginTop: 24,
          padding: '24px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-pill)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--danger)',
          }}
        >
          <AlertCircle size={22} strokeWidth={2} aria-hidden="true" />
        </div>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
            margin: 0,
            maxWidth: 420,
            lineHeight: 1.5,
          }}
        >
          {displayError}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {onRetry && (
            <Button variant="secondary" size="md" onClick={onRetry}>
              Try again
            </Button>
          )}
          {onReset && (
            <Button variant="ghost" size="md" onClick={onReset}>
              <RotateCcw size={14} /> Start over
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ─── SUCCESS STATE ────────────────────────────────────────
  if (status === 'success') {
    if (comparisonMode && beforePreview && afterPreview) {
      return (
        <div
          style={{
            marginTop: 24,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-card)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
          data-testid="tool-processor-comparison"
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              Comparison preview
            </span>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
              }}
            >
              Drag slider to inspect
            </span>
          </div>

          {/* Draggable Comparison Viewport */}
          <div
            ref={sliderContainerRef}
            tabIndex={0}
            role="slider"
            aria-valuenow={Math.round(sliderPos)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Image comparison slider. Use left and right arrow keys to adjust view."
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setSliderPos((p) => Math.max(0, p - 5));
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setSliderPos((p) => Math.min(100, p + 5));
              }
            }}
            onMouseDown={(e) => {
              setIsDragging(true);
              handlePointerMove(e.clientX);
            }}
            onTouchStart={(e) => {
              if (e.touches[0]) {
                setIsDragging(true);
                handlePointerMove(e.touches[0].clientX);
              }
            }}
            style={{
              position: 'relative',
              width: '100%',
              height: '380px',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              cursor: 'ew-resize',
              userSelect: 'none',
            }}
            className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
          >
            {/* After image (background layer) */}
            <img
              src={afterPreview}
              alt="Processed output"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              draggable={false}
            />

            {/* Before image (clipped overlay layer) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                width: `${sliderPos}%`,
                overflow: 'hidden',
                borderRight: '2px solid var(--accent)',
              }}
            >
              <img
                src={beforePreview}
                alt="Original image"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: sliderContainerRef.current ? `${sliderContainerRef.current.clientWidth}px` : '100%',
                  height: '100%',
                  objectFit: 'contain',
                  maxWidth: 'none',
                }}
                draggable={false}
              />
            </div>

            {/* Divider Handle */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${sliderPos}%`,
                transform: 'translate(-50%, -50%)',
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-pill)',
                background: 'var(--accent)',
                color: 'var(--accent-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                pointerEvents: 'none',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              ⇄
            </div>

            {/* Corner tags */}
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 11,
                fontFamily: 'var(--font-ui)',
                pointerEvents: 'none',
              }}
            >
              Original
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 11,
                fontFamily: 'var(--font-ui)',
                pointerEvents: 'none',
              }}
            >
              Result
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {afterPreview && (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => {
                  if (resultProps?.onDownload) {
                    resultProps.onDownload();
                  } else {
                    const a = document.createElement('a');
                    a.href = afterPreview;
                    a.download = resultProps?.filename || 'processed-image.png';
                    a.click();
                  }
                }}
              >
                <Download size={18} />
                <span>
                  {resultProps?.actionLabel ||
                    (resultProps?.filename
                      ? `Download ${resultProps.filename}`
                      : 'Download processed image')}
                </span>
              </Button>
            )}
            {onReset && (
              <Button variant="ghost" size="md" fullWidth onClick={onReset}>
                <RotateCcw size={14} />
                <span>{resultProps?.resetLabel || 'Process another image'}</span>
              </Button>
            )}
          </div>
        </div>
      );
    }

    // Otherwise delegate to ResultPanel if provided
    if (resultProps && resultProps.filename) {
      return (
        <ResultPanel
          filename={resultProps.filename}
          sizeBefore={resultProps.sizeBefore}
          sizeAfter={resultProps.sizeAfter}
          blob={resultProps.blob}
          downloadUrl={resultProps.downloadUrl || afterPreview}
          onDownload={resultProps.onDownload}
          onReset={onReset}
          textOutput={resultProps.textOutput}
          warning={resultProps.warning}
          actionLabel={resultProps.actionLabel}
          resetLabel={resultProps.resetLabel}
        />
      );
    }
    return null;
  }

  // ─── LOADING / PROCESSING STATES ──────────────────────────

  // QUICK (<2s)
  if (category === 'quick') {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          marginTop: 24,
          padding: '32px 24px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          style={{ animation: 'spin 0.8s linear infinite' }}
          className="animate-spin text-[var(--accent)]"
        >
          <circle cx="10" cy="10" r="8" stroke="var(--border)" strokeWidth="2" />
          <path
            d="M10 2A8 8 0 0 1 18 10"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
          }}
        >
          Processing...
        </span>
      </div>
    );
  }

  // MEDIUM (2-10s)
  if (category === 'medium') {
    const defaultMediumSteps = ['Analyzing...', 'Processing...', 'Almost done...'];
    const activeSteps = steps.length > 0 ? steps : defaultMediumSteps;
    const currentMessage = activeSteps[autoStepIndex % activeSteps.length];

    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          marginTop: 24,
          padding: '24px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Subtle 2px indeterminate animated line */}
        <div
          style={{
            height: 2,
            width: '100%',
            background: 'var(--border)',
            borderRadius: 'var(--radius-pill)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '40%',
              background: 'var(--accent)',
              borderRadius: 'var(--radius-pill)',
              animation: 'tool-line-slide 1.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Discrete changing message */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          {currentMessage}
        </p>
      </div>
    );
  }

  // HEAVY (10s+)
  const defaultHeavySteps = [
    'Analyzing document...',
    'Extracting data...',
    'Performing operations...',
    'Finalizing file...',
  ];
  const activeSteps = steps.length > 0 ? steps : defaultHeavySteps;
  const currentMessage = activeSteps[autoStepIndex % activeSteps.length];

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        marginTop: 24,
        padding: '24px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* If beforePreview available: show original file with subtle animated pulsing veil */}
      {beforePreview && (
        <div
          style={{
            position: 'relative',
            height: 220,
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
          }}
        >
          <img
            src={beforePreview}
            alt="Source file being processed"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: 0.8,
            }}
          />
          {/* Subtle animated overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 0%, var(--accent-subtle) 100%)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
        </div>
      )}

      {/* 2px fine indeterminate animated line */}
      <div
        style={{
          height: 2,
          width: '100%',
          background: 'var(--border)',
          borderRadius: 'var(--radius-pill)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '40%',
            background: 'var(--accent)',
            borderRadius: 'var(--radius-pill)',
            animation: 'tool-line-slide 1.8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Step message changing every 3 seconds */}
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          margin: 0,
          textAlign: 'center',
          transition: 'opacity 150ms ease',
        }}
      >
        {currentMessage}
      </p>
    </div>
  );
}
