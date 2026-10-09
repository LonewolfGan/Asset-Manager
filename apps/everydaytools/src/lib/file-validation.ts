export interface ValidationOptions {
  accept: string[];   // MIME types
  maxSize: number;    // bytes
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/** Check if the file's MIME type is in the accepted list */
export function isMimeTypeValid(file: File, acceptedTypes: string[]): boolean {
  return acceptedTypes.includes(file.type);
}

/** Check if the file is within the size limit */
export function isFileSizeValid(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

/** Full validation — checks empty, size, and MIME type */
export function validateFile(file: File, opts: ValidationOptions): ValidationResult {
  if (file.size === 0) return { valid: false, error: 'File is empty' };
  if (!isFileSizeValid(file, opts.maxSize)) {
    const mb = (opts.maxSize / 1024 / 1024).toFixed(0);
    return { valid: false, error: `File exceeds the ${mb} MB limit` };
  }
  if (!isMimeTypeValid(file, opts.accept)) {
    return { valid: false, error: 'File type not accepted' };
  }
  return { valid: true };
}
