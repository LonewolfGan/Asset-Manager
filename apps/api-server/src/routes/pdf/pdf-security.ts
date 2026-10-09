import { Router } from "express";
import { PDFDocument } from "pdf-lib";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { upload } from "../../middlewares/upload.js";
import { BIN } from "../../lib/binaries.js";
import { apiError } from "../../lib/errors.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";

const execFileAsync = promisify(execFile);
const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-protect
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-protect", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const userPassword  = String(req.body.userPassword  ?? req.body.password ?? "").trim();
  const ownerPassword = String(req.body.ownerPassword ?? "").trim();

  if (!userPassword && !ownerPassword) {
    apiError(res, 400, "MISSING_PARAM", "At least one password (user or owner) is required."); return;
  }
  if (userPassword.length > 128 || ownerPassword.length > 128) {
    apiError(res, 400, "INVALID_PARAM", "Password too long (max 128 characters)."); return;
  }

  const allowPrinting  = String(req.body.allowPrinting  ?? "true")  !== "false";
  const allowCopying   = String(req.body.allowCopying   ?? "true")  !== "false";
  const allowModifying = String(req.body.allowModifying ?? "false") === "true";
  const baseName = pdfBaseName(req.file.originalname);

  const ownerPw = ownerPassword || (userPassword + "_o_et");
  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath  = join(workDir, "input.pdf");
  const outPath = join(workDir, "output.pdf");

  try {
    await writeFile(inPath, req.file.buffer);

    const args: string[] = [
      "--encrypt", userPassword, ownerPw, "256",
      `--print=${allowPrinting ? "full" : "none"}`,
      `--extract=${allowCopying ? "y" : "n"}`,
    ];
    if (allowModifying) {
      args.push("--modify-other=y", "--annotate=y", "--form=y", "--assemble=y");
    } else {
      args.push("--modify-other=n", "--annotate=n", "--form=n", "--assemble=n");
    }
    args.push("--", inPath, outPath);

    await execFileAsync(BIN.qpdf, args, { timeout: 30_000 });

    const output = await readFile(outPath);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_protected.pdf"`,
      "X-Encryption": "AES-256",
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Encryption",
    });
    res.send(output);
  } catch (_qpdfErr) {
    // Fallback: pdf-lib RC4-128
    try {
      const pdfDoc = await PDFDocument.load(req.file.buffer);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfBytes = await pdfDoc.save({
        userPassword:  userPassword  || undefined,
        ownerPassword: ownerPw,
        permissions: {
          printing: allowPrinting ? "highResolution" : undefined,
          modifying: allowModifying,
          copying: allowCopying,
          annotating: false,
          fillingForms: allowModifying,
          contentAccessibility: true,
          documentAssembly: false,
        },
      } as any);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}_protected.pdf"`,
        "X-Encryption": "RC4-128",
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": "X-Encryption",
      });
      res.send(Buffer.from(pdfBytes));
    } catch (err) {
      apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Protection failed");
    }
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-unlock
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-unlock", upload.single("file"), async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  if (req.file.mimetype !== "application/pdf") {
    apiError(res, 415, "UNSUPPORTED_TYPE", "Only PDF files are accepted."); return;
  }

  const password = String(req.body.password ?? "").trim();
  const baseName = pdfBaseName(req.file.originalname);

  // 1. Primary: qpdf --decrypt (supports AES-256, AES-128, RC4)
  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath = join(workDir, "input.pdf");
  const outPath = join(workDir, "output.pdf");

  try {
    await writeFile(inPath, req.file.buffer);
    const args = ["--decrypt"];
    if (password) {
      args.push(`--password=${password}`);
    }
    args.push("--", inPath, outPath);

    await execFileAsync(BIN.qpdf, args, { timeout: 30_000 });
    const output = await readFile(outPath);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_unlocked.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(output);
    return;
  } catch (qpdfErr) {
    const qMsg = qpdfErr instanceof Error ? qpdfErr.message : "";
    if (qMsg.includes("invalid password") || qMsg.includes("password incorrect")) {
      apiError(res, 400, "INVALID_PASSWORD", "Mot de passe incorrect. Veuillez vérifier et réessayer.");
      return;
    }
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }

  // 2. Fallback: pdf-lib
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfDoc = await PDFDocument.load(req.file.buffer, {
      password: password || undefined,
      ignoreEncryption: !password,
    } as any);
    const pdfBytes = await pdfDoc.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_unlocked.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    const raw = err instanceof Error ? err.message : "";
    const msg = raw.toLowerCase().includes("password") || raw.toLowerCase().includes("encrypt")
      ? "Mot de passe incorrect ou chiffrement non pris en charge."
      : raw || "Unlock failed";
    apiError(res, 500, "CONVERSION_FAILED", msg);
  }
});

export default router;
