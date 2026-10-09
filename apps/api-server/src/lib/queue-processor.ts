import { join } from "path";
import { tmpdir } from "os";
import { mkdir, writeFile, readFile, stat } from "fs/promises";
import { convertWithLibreOffice } from "./libreoffice.js";
import type { ConversionJobData, JobResult } from "./queue-types.js";

export const JOBS_DIR = join(tmpdir(), "everydaytools", "jobs");

/**
 * Core processing logic shared by both BullMQ and in-memory fallback.
 */
export async function processConversionJob(
  data: ConversionJobData,
  onProgress: (percent: number, label: string) => Promise<void>,
): Promise<JobResult> {
  const { jobId, originalName, inputExt, targetFormat } = data;
  const jobFolder = join(JOBS_DIR, jobId);
  await mkdir(jobFolder, { recursive: true });

  await onProgress(15, "Préparation du document...");

  let inputBuf: Buffer;
  if (data.inputBufferBase64) {
    inputBuf = Buffer.from(data.inputBufferBase64, "base64");
    // Free base64 string immediately to prevent lingering in memory
    delete data.inputBufferBase64;
  } else if (data.inputPath) {
    inputBuf = await readFile(data.inputPath);
  } else {
    throw new Error("No input buffer or path provided for conversion job");
  }

  await onProgress(40, "Conversion en cours...");
  const convertedBuffer = await convertWithLibreOffice(inputBuf, inputExt, targetFormat);

  await onProgress(85, "Finalisation du fichier...");
  const outputBaseName = originalName.replace(/\.[a-zA-Z0-9]+$/, "");
  const outputFilename = `${outputBaseName}.${targetFormat}`;
  const outputPath = join(jobFolder, outputFilename);

  await writeFile(outputPath, convertedBuffer);
  const fileStat = await stat(outputPath);

  await onProgress(100, "Document prêt pour le téléchargement");

  return {
    jobId,
    filename: outputFilename,
    size: fileStat.size,
    outputPath,
  };
}
