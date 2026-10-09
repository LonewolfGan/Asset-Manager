export interface ConversionJobData {
  jobId: string;
  taskType: "word-to-pdf" | "excel-to-pdf" | "pptx-to-pdf" | "document-convert";
  originalName: string;
  inputExt: string;
  targetFormat: string;
  inputBufferBase64?: string;
  inputPath?: string;
}

export interface JobProgress {
  percent: number;
  label: string;
}

export interface JobResult {
  jobId: string;
  filename: string;
  size: number;
  outputPath: string;
}

export interface InMemoryJobEntry {
  data: ConversionJobData;
  status: "waiting" | "active" | "completed" | "failed";
  progress: JobProgress;
  result?: JobResult;
  error?: string;
  createdAt?: number;
  completedAt?: number;
  listeners: Array<(progress: JobProgress) => void>;
}
