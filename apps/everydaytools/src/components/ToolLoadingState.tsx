import React from 'react';
import ToolProcessor, { ToolProcessorStatus, ToolProcessorCategory } from './ToolProcessor';

export interface ToolLoadingStateProps {
  status: 'idle' | 'loading' | 'success' | 'error' | ToolProcessorStatus;
  progress?: number;
  label?: string;
  steps?: string[];
  currentStep?: number;
  errorMessage?: string;
  onRetry?: () => void;
  category?: ToolProcessorCategory;
  beforePreview?: string;
  afterPreview?: string;
  comparisonMode?: boolean;
}

export default function ToolLoadingState({
  status,
  label,
  steps = [],
  currentStep = 0,
  errorMessage,
  onRetry,
  category = 'medium',
  beforePreview,
  afterPreview,
  comparisonMode = false,
}: ToolLoadingStateProps) {
  const processorStatus: ToolProcessorStatus =
    status === 'loading' ? 'processing' : (status as ToolProcessorStatus);
  const activeSteps = steps.length > 0 ? steps : (label ? [label] : []);

  return (
    <ToolProcessor
      status={processorStatus}
      category={category}
      steps={activeSteps}
      currentStep={currentStep}
      errorMessage={errorMessage}
      onRetry={onRetry}
      beforePreview={beforePreview}
      afterPreview={afterPreview}
      comparisonMode={comparisonMode}
    />
  );
}

export { ToolProcessor };
