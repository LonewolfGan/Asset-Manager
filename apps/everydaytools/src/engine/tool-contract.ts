/**
 * Universal Tool Engine Contract & Core Types
 * Ensures strict decoupling between visual UI (Awwwards design) and execution engines.
 */

export interface ToolProgress {
  percent: number;
  stage?: string;
  message?: string;
}

export interface ToolExecuteOptions {
  signal?: AbortSignal;
  onProgress?: (progress: ToolProgress) => void;
}

export interface ToolResult<T = unknown> {
  data: T;
  filename: string;
  mimeType?: string;
  originalSize?: number;
  resultSize?: number;
  metadata?: Record<string, unknown>;
}

export type ToolWorkflowStatus = 'idle' | 'staged' | 'processing' | 'completed' | 'error';

export interface ToolEngineContract<
  TInput = File,
  TOptions extends ToolExecuteOptions = ToolExecuteOptions,
  TOutput = Blob,
> {
  id: string;
  name: string;
  execute(input: TInput, options?: TOptions): Promise<ToolResult<TOutput>>;
  abort?(): void;
}

export {
  useToolWorkflow,
  type UseToolWorkflowOptions,
  type UseToolWorkflowReturn,
} from './use-tool-workflow';
