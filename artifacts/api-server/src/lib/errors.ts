/**
 * Uniform API error helper.
 * All backend routes must return errors in this format:
 *   { error: true, code: "MACHINE_CODE", message: "Human description", details?: "..." }
 */
import type { Response } from "express";

export function apiError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: string,
): void {
  const body: Record<string, unknown> = { error: true, code, message };
  if (details) body["details"] = details;
  res.status(status).json(body);
}
