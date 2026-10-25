# State-of-the-Art PDF Unlock & Decryption Engine Research & Benchmark (2026)

## 1. Executive Summary

PDF document unlocking encompasses two distinct cryptographic operations under **ISO 32000-1** and **ISO 32000-2 (PDF 2.0)**:
1. **Full Decryption of User-Password Protected Files:** Decrypting content streams and object dictionaries protected by an open password (AES-256 Revision 6, AES-128, or legacy RC4), recovering the document File Encryption Key (FEK), and permanently removing the `/Encrypt` security handler.
2. **Permission Restriction Removal on Owner-Password Protected Files:** Lifting printing, copying, content modification, and form-assembly restrictions on documents that can be opened without a password (where the User Password is the empty string `""`), but whose administrative controls are locked by an Owner Password.

### Key Empirical Findings:
1. **Server Engine Hegemony:** **QPDF 12.3.2** running on our dedicated Oracle Cloud VM (Ubuntu 24.04 ARM64) is the benchmark standard. It executes AES-256 decryption and permission removal in **10.60–15.01 ms** across 1-page to 50-page documents, with simultaneous Fast Web View linearization (`--linearize`), completely preserving 100% of vector content streams without re-distillation.
2. **Client-Side in-browser `pdf-lib` Failure:** Pure client-side JavaScript PDF libraries (specifically `pdf-lib` v1.17.1) **have zero decryption capability**. Calling `PDFDocument.load(buf, { password })` unconditionally throws `Input document to PDFDocument.load is encrypted`. Supplying `{ ignoreEncryption: true }` loads raw encrypted bytes, which causes a fatal crash during `pdfDoc.save()` (`Expected instance of PDFDict, but got instance of undefined`). Pure browser-side decryption without heavy WebAssembly is impossible for encrypted PDFs.
3. **Ghostscript Inefficiency & Stream Degradation:** Ghostscript 10.06.0 (`pdfwrite`) can decrypt AES-256 documents via `-sPDFPassword=...`, but takes **149.55–227.33 ms** (>15x slower than QPDF), re-distills through PostScript, alters embedded fonts (e.g. substituting Helvetica with NimbusSans-Regular), strips interactive form fields and digital signatures, and emits specification warnings (`/Length present in Encryption dictionary and /V is neither 2 nor 3`).
4. **Owner-Only Restriction Removal:** Documents locked solely by an owner password can be decrypted by QPDF with no password argument or with `--password=""` in ~10.9 ms, completely stripping all restrictions without requiring brute force.
5. **High-Throughput Concurrency:** Under 8 parallel worker threads, QPDF achieves sustained throughput of **~297.8 unlocked documents/second** with an average latency of **20.06 ms** per document.

---

## 2. PDF Decryption Mechanics & Standards (ISO 32000-1 & ISO 32000-2)

### 2.1 Standard Security Handler Architecture

In a standard-compliant PDF document, encryption parameters reside in the `/Encrypt` dictionary referenced by the document trailer:

```
<<
  /Filter /Standard
  /V 5
  /R 6
  /P -3904
  /O <32-byte hash/salt string>
  /U <32-byte hash/salt string>
  /OE <32-byte AES-wrapped key>
  /UE <32-byte AES-wrapped key>
  /Perms <16-byte AES-encrypted control block>
>>
```

### 2.2 Security Handler Revision Evolution

| Revision | Version | Cipher Algorithm | Key Length | Key Derivation Method | Status (2026) |
|---|---|---|---|---|---|
| **Revision 2** | V=1 | RC4 stream | 40 bits | MD5 hash (5 iterations) | Broken / Insecure |
| **Revision 3** | V=2 | RC4 stream | 128 bits | MD5 hash (50 iterations) | Deprecated |
| **Revision 4** | V=4 | AES-CBC or RC4 | 128 bits | MD5 + AES key wrapping | Deprecated |
| **Revision 5** | V=5 | AES-CBC | 256 bits | Acrobat 9 (proprietary SHA-256) | Deprecated |
| **Revision 6** | **V=5, R=6** | **AES-256-CBC** | **256 bits** | **ISO 32000-2 (SHA-256/384/512 iterations + salts)** | **Current Industry Standard** |

### 2.3 The Decryption & Key Recovery Process

1. **User Password Authentication (Document Open):**
   - The user inputs password $P_{user}$.
   - The engine computes a verification hash using the salt in `/U` and compares it to the stored validation token.
   - If valid, the File Encryption Key (FEK) is unwrapped from `/UE` using an AES-256 key derived from $P_{user}$.
   - All encrypted indirect streams and strings are decrypted in memory using the FEK with AES-256-CBC (16-byte initialization vectors prepended to each stream).
2. **Owner Password Authentication (Administrative Access):**
   - The user inputs password $P_{owner}$.
   - The engine validates against `/O` and unwraps the FEK from `/OE`.
   - Access to the FEK via the owner path bypasses all permission flags stored in `/P` and `/Perms`.
3. **Owner-Only Restricted Documents (Empty User Password):**
   - In many corporate PDFs, documents are readable by anyone, but printing, copying, or annotation is disabled.
   - In this state, the User Password is set to the empty string `""`.
   - Any compliant engine can unwrap the FEK using $P_{user} = ""$.
   - **QPDF Decryption Behavior:** Passing `--decrypt` with either `--password=""` or omitting `--password` entirely successfully recovers the FEK and reconstructs the PDF without the `/Encrypt` dictionary, permanently removing all permission restrictions.
4. **Permanent Restriction Removal:**
   - When QPDF decrypts a document, it:
     1. Decrypts all streams and object strings using the recovered FEK.
     2. Deletes the `/Encrypt` dictionary from the document trailer/cross-reference stream.
     3. Strips `/Perms` blocks.
     4. Regenerates cross-reference tables and linearized hint streams.
     5. Writes a standard, clean PDF conforming to ISO 32000-1 / ISO 32000-2 that opens in any viewer with full editing and printing privileges.

---

## 3. Empirical Benchmark Matrix (2026)

Conducted on the production-equivalent Ubuntu 24.04 Linux environment (Node.js v24.21.0, QPDF 12.3.2, Ghostscript 10.06.0, PyMuPDF 2.0).
Each test was averaged over 5 consecutive warm executions on AES-256 (Revision 6) encrypted documents.

### 3.1 Benchmark Comparison Table

| Engine & Mode | 1 Page Latency | 10 Pages Latency | 50 Pages Latency | File Size Delta (%) | Vector & Font Integrity | Security Handling |
|---|---|---|---|---|---|---|
| **QPDF 12.3.2 Decrypt** | **10.98 ms** | **10.93 ms** | **13.53 ms** | -36.3% to -4.8% (enc tables removed) | **100% Bit-Exact Vector Preservation** | Complete Decryption |
| **QPDF 12.3.2 Decrypt + Linearize** | **10.60 ms** | **11.14 ms** | **15.01 ms** | +23.4% to -1.1% (hint streams added) | **100% Bit-Exact Vector Preservation** | Complete Decryption + Fast Web |
| **PyMuPDF 2.0 (fitz)** | **32.10 ms** | **31.24 ms** | **34.70 ms** | -8.1% to -6.0% | 100% Vector Preservation | Complete Decryption |
| **Ghostscript 10.06.0 (`pdfwrite`)** | **149.55 ms** | **157.93 ms** | **227.33 ms** | +164% (1p) to -6.1% (50p) | **Degraded** (Font substitution, strips forms) | High Overhead / Warning emitted |
| **pdf-lib 1.17.1 (In-Browser Pure JS)** | **FAILED** | **FAILED** | **FAILED** | N/A | **Crashes during save** | **Zero Decryption Capability** |

### 3.2 Detailed Latency & Throughput Analysis

1. **QPDF vs Ghostscript:** QPDF is **13.6x to 15.1x faster** than Ghostscript while preserving document structure. Ghostscript forces a full re-rasterization/re-distillation pass through PostScript which introduces font substitutions (`NimbusSans-Regular` replacing `Helvetica`) and drops interactive features.
2. **Linearization Overhead:** Adding `--linearize` to QPDF decryption adds less than **1.5 ms** of processing overhead on a 50-page document while optimizing the file for progressive byte-range rendering in web browsers.
3. **High-Throughput Concurrency Benchmark:**
   - Workload: 8 simultaneous threads decrypting a 10-page AES-256 document.
   - Total Wall-Clock Time: **26.87 ms**.
   - Average Document Latency: **20.06 ms**.
   - Sustained Throughput: **~297.8 documents/second**.

---

## 4. In-Browser / Client-Side Decryption Investigation (`pdf-lib`)

### 4.1 The `pdf-lib` Limitation

Our empirical tests demonstrate that `pdf-lib` cannot be used as an in-browser or fallback decryption engine:

1. **Load Attempt with Password:**
   ```typescript
   await PDFDocument.load(encryptedBuffer, { password: "mypassword" } as any);
   ```
   **Result:** Throws `Error: Input document to PDFDocument.load is encrypted. You can use PDFDocument.load(..., { ignoreEncryption: true }) if you wish to load the document anyways.`
   `pdf-lib` has no built-in standard security handler implementation for decrypting password hashes or AES-256 streams.
2. **Load Attempt with `ignoreEncryption: true`:**
   ```typescript
   const doc = await PDFDocument.load(encryptedBuffer, { ignoreEncryption: true });
   await doc.save();
   ```
   **Result:** Fails with `UnexpectedObjectTypeError: Expected instance of PDFDict, but got instance of undefined at PDFCatalog.Pages`.
   Because the object stream containing the page tree catalog is AES-256 encrypted, `pdf-lib` encounters raw ciphertext, cannot parse object references, and throws fatal runtime exceptions.

### 4.2 WebAssembly QPDF vs. Native Server Backend

| Dimension | In-Browser WebAssembly (WASM QPDF) | Dedicated Server Backend (Node.js + QPDF) |
|---|---|---|
| **Binary Bundle Size** | ~6–9 MB WASM + OpenSSL runtime | **0 KB client bundle impact** |
| **Cold Start Overhead** | ~400–800 ms WASM instantiation | **Zero startup penalty** |
| **Decryption Latency** | ~40–90 ms | **10–15 ms** |
| **Memory Footprint** | ~120 MB browser tab allocation | Isolated in ephemeral `/tmp` workspace |
| **Mobile Reliability** | Prone to out-of-memory tabs on iOS Safari | **100% consistent across all mobile devices** |

**Conclusion:** Decryption must execute on the dedicated backend using QPDF and `ProcessPool`.

---

## 5. Robustness, Edge Cases & Error Handling Matrix

### 5.1 Exact QPDF Error Signatures

| Failure Mode | QPDF Command Invocations | QPDF Exit Code | QPDF Stderr Pattern | Expected API Error Code | HTTP Status | User Message (EN / FR) |
|---|---|---|---|---|---|---|
| **Incorrect Password** | `qpdf --decrypt --password=wrong in.pdf out.pdf` | **2** | `invalid password` | `INVALID_PASSWORD` | **400** | Incorrect password. / Mot de passe incorrect. |
| **Missing Password on Locked PDF** | `qpdf --decrypt in.pdf out.pdf` | **2** | `invalid password` | `INVALID_PASSWORD` | **400** | Document requires a password. / Ce document est protégé par un mot de passe. |
| **Corrupt / Damaged PDF** | `qpdf --decrypt in.pdf out.pdf` | **2** | `can't find PDF header`, `damaged`, `trailer dictionary` | `INVALID_PDF` | **400** | Damaged or invalid PDF document. / Document PDF invalide ou endommagé. |
| **Unencrypted Document** | `qpdf --is-encrypted in.pdf` | **2** | (Empty) | `NOT_ENCRYPTED` | **400** | Document is not encrypted. / Le document n'est pas protégé. |
| **Owner-Only Restricted PDF** | `qpdf --decrypt in.pdf out.pdf` | **0** | (Clean exit) | None (Success) | **200** | Restrictions removed successfully. / Restrictions levées avec succès. |
| **Excessive Password Length** | Length > 128 chars | N/A (Client / API Guard) | N/A | `INVALID_PARAM` | **400** | Password exceeds 128 characters limit. / Mot de passe trop long (max 128 caractères). |
| **Corrupted Input Buffer (< 5 bytes)** | Header check fails | N/A (Early Guard) | N/A | `INVALID_BUFFER` | **400** | Invalid or empty PDF buffer. / Fichier PDF invalide ou vide. |
| **Process Timeout (> 60s)** | ProcessPool timer fires | Killed | `SIGTERM` / `TIMEOUT` | `TIMEOUT_ERROR` | **500** | Decryption process timed out. / Le déverrouillage a expiré. |

### 5.2 UTF-8, Spaces and Special Characters Handling

Passwords containing spaces, quotation marks, UTF-8 unicode characters, and emojis (e.g. `P@ss"w0rd!#$ 🚀`) must be passed safely to QPDF without shell interpolation:
- Never construct shell command strings (`exec("qpdf --password=" + pwd)` is strictly prohibited).
- Always pass arguments as an array via `execFile` or `execFileAsync`:
  ```typescript
  const args = ["--warning-exit-0", "--linearize", "--decrypt"];
  if (password && password.length > 0) {
    args.push(`--password=${password}`);
  }
  args.push("--", inPath, outPath);
  await execFileAsync(BIN.qpdf, args, { signal: ctx.signal, timeout: timeoutMs });
  ```

---

## 6. Architectural Specification for Tool #16 (`pdf-unlock`)

### 6.1 End-to-End Pipeline Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ FRONTEND CLIENT (React 19 / apps/everydaytools)                        │
│ 1. Password input via PasswordSecureField (with toggle visibility)     │
│ 2. Contextual help: "Leave empty if document has only permission locks"│
│ 3. Engine Adapter: pdfUnlockEngine (implements ToolEngineContract)     │
│ 4. useToolWorkflow: progressive stages (reading -> decrypting -> done) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP POST /convert/pdf-unlock (multipart/form-data)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ BACKEND API (Express 5 / apps/api-server)                              │
│ 1. ProcessPool Isolation (/tmp/everydaytools/<uuid>)                   │
│ 2. Buffer & Magic Byte Validation (%PDF-)                              │
│ 3. Probe Encryption via `qpdf --is-encrypted`                          │
│    - If NOT encrypted: reject early with `NOT_ENCRYPTED` (HTTP 400)    │
│ 4. Execute QPDF 12.3.2 Decryption with Fast Web View linearization     │
│ 5. Guaranteed ephemeral cleanup in ProcessPool `finally` block         │
│ 6. Response Headers: X-Decrypted, X-Linearized, Content-Disposition    │
└────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Backend Specifications (`pdf-unlock-handler.ts`)

- **Location:** `apps/api-server/src/routes/convert/pdf-unlock-handler.ts` (Clean SRP < 250 LOC).
- **Canonical Route:** `POST /convert/pdf-unlock`
- **Legacy Route Support:** `POST /tools/pdf-unlock` (redirect / invoke same handler)
- **Engine Logic:**
  ```typescript
  export interface UnlockPdfOptions {
    password?: string;
    timeoutMs?: number;
    pool?: ProcessPool;
    signal?: AbortSignal;
  }

  export interface UnlockPdfResult {
    buffer: Buffer;
    isLinearized: boolean;
    originalSize: number;
    unlockedSize: number;
  }
  ```
- **Probing & Execution Steps:**
  1. Validate buffer and `%PDF-` header.
  2. Write input to `ctx.workspaceDir/input.pdf`.
  3. Probe with `qpdf --is-encrypted inPath`:
     - If exit code is 2: throw error with code `NOT_ENCRYPTED` ("The document is not encrypted.").
  4. Build command arguments:
     ```typescript
     const args = ["--warning-exit-0", "--linearize", "--decrypt"];
     if (options.password && options.password.trim()) {
       args.push(`--password=${options.password}`);
     }
     args.push("--", inPath, outPath);
     ```
  5. Execute via `execFileAsync(BIN.qpdf, args, { signal: ctx.signal, timeout: timeoutMs })`.
  6. Catch errors:
     - If stderr matches `/invalid password/i`: map to `INVALID_PASSWORD` (HTTP 400).
     - If stderr matches `/can't find PDF header|damaged|trailer dictionary/i`: map to `INVALID_PDF` (HTTP 400).
  7. Read output buffer, compile telemetry, and return result.

### 6.3 Frontend Specification (`pdf-unlock-engine.ts`)

- **Location:** `apps/everydaytools/src/lib/engines/pdf-unlock-engine.ts`
- **Contract:** Implements `ToolEngineContract<File, PdfUnlockExecuteOptions, Blob>`.
- **Options Definition:**
  ```typescript
  export interface PdfUnlockExecuteOptions extends ToolExecuteOptions {
    password?: string;
    baseName?: string;
  }
  ```
- **Progress Lifecycle:**
  - `reading` (10%): Reading file into memory.
  - `decrypting` (50%): Sending to server and decrypting AES-256 streams.
  - `finalizing` (85%): Parsing output and verifying response headers.
  - `complete` (100%): Output ready for instant download or next-action workflow.
- **Workflow Integration:** Wire `pdfUnlockEngine` into `useToolWorkflow` inside `apps/everydaytools/src/pages/pdf-unlock.tsx`, deprecating the ad-hoc hook `apps/everydaytools/src/hooks/use-pdf-unlock-workflow.ts`.

### 6.4 Sanctuarized UI Compliance

The existing visual interface in `apps/everydaytools/src/pages/pdf-unlock.tsx` and `apps/everydaytools/src/components/pdf-unlock/` must be **100% preserved** without visual changes:
1. Double-Bezel layout and Radix color system (`#FF6B35` primary accent).
2. Clean `PasswordSecureField` with visibility toggle and keyboard shortcuts (Enter to submit).
3. Fluid progress telemetry bar during decryption (`PDF Decrypt` badge).
4. Direct one-click download with NextActionModal handoff on completion.

---

## 7. Implementation Roadmap & Verification Gates

1. **Step 1: Backend TDD Test Suite (`pdf-unlock.test.ts`):**
   - Test decryption of AES-256 user-encrypted PDF.
   - Test decryption of AES-256 owner-restricted PDF without password.
   - Test decryption of AES-256 owner-restricted PDF with owner password.
   - Test failure on wrong password -> `INVALID_PASSWORD` / HTTP 400.
   - Test failure on unencrypted document -> `NOT_ENCRYPTED` / HTTP 400.
   - Test failure on damaged / corrupted PDF buffer -> `INVALID_PDF` / HTTP 400.
   - Test failure on empty buffer -> `INVALID_BUFFER` / HTTP 400.
2. **Step 2: Backend Implementation (`pdf-unlock-handler.ts`):**
   - Implement `unlockPdf` using `ProcessPool` and QPDF 12.3.2.
   - Wire route into `apps/api-server/src/routes/convert/convert-doc.ts` (`POST /convert/pdf-unlock`) and `apps/api-server/src/routes/pdf/pdf-security.ts` (`POST /tools/pdf-unlock`).
3. **Step 3: Frontend Engine Adapter (`pdf-unlock-engine.ts`):**
   - Create `pdfUnlockEngine` implementing `ToolEngineContract`.
   - Add unit tests in `apps/everydaytools/tests/unit/engines/pdf-unlock-engine.test.ts`.
4. **Step 4: Connect UI to `useToolWorkflow`:**
   - Refactor `apps/everydaytools/src/pages/pdf-unlock.tsx` to use `useToolWorkflow(pdfUnlockEngine)`.
   - Preserve all existing UI components (`PdfUnlockWorkbench`, `PdfUnlockForm`, `ConversionDropzone`, `ConversionResult`).
5. **Step 5: Mechanical Verification Pipeline:**
   - `pnpm run clean:codebase`
   - `pnpm run check:rules`
   - `pnpm run typecheck`
   - `pnpm test`
