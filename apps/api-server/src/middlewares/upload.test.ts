import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { guardDocument, guardImage } from "./upload.js";
import type { Request, Response, NextFunction } from "express";

function createMockReq(filename: string, mimetype: string, size = 1024): Partial<Request> {
  return {
    file: {
      originalname: filename,
      mimetype,
      size,
      buffer: Buffer.from("test-content"),
    } as Express.Multer.File,
  };
}

function createMockRes(): { res: Partial<Response>; statusMock: number | null; jsonBody: any } {
  const result = {
    statusMock: null as number | null,
    jsonBody: null as any,
    res: {} as Partial<Response>,
  };

  result.res = {
    status(code: number) {
      result.statusMock = code;
      return result.res as Response;
    },
    json(body: any) {
      result.jsonBody = body;
      return result.res as Response;
    },
  };

  return result;
}

describe("Upload MIME Guard Security (TDD)", () => {
  it("rejects dangerous executable with application/octet-stream", () => {
    const req = createMockReq("payload.exe", "application/octet-stream") as Request;
    const mockRes = createMockRes();
    let nextCalled = false;
    const next: NextFunction = () => { nextCalled = true; };

    guardDocument(req, mockRes.res as Response, next);

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(mockRes.statusMock, 415);
    assert.strictEqual(mockRes.jsonBody?.error, true);
    assert.strictEqual(mockRes.jsonBody?.code, "UNSUPPORTED_TYPE");
  });

  it("accepts valid docx with generic application/octet-stream", () => {
    const req = createMockReq("report.docx", "application/octet-stream") as Request;
    const { res } = createMockRes();
    let nextCalled = false;
    const next: NextFunction = () => { nextCalled = true; };

    guardDocument(req, res as Response, next);

    assert.strictEqual(nextCalled, true);
  });

  it("accepts legitimate PDF with application/pdf", () => {
    const req = createMockReq("document.pdf", "application/pdf") as Request;
    const { res } = createMockRes();
    let nextCalled = false;
    const next: NextFunction = () => { nextCalled = true; };

    guardDocument(req, res as Response, next);

    assert.strictEqual(nextCalled, true);
  });

  it("rejects spoofed executable masquerading as application/pdf", () => {
    const req = createMockReq("malware.exe", "application/pdf") as Request;
    const mockRes = createMockRes();
    let nextCalled = false;
    const next: NextFunction = () => { nextCalled = true; };

    guardDocument(req, mockRes.res as Response, next);

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(mockRes.statusMock, 415);
    assert.strictEqual(mockRes.jsonBody?.error, true);
  });

  it("rejects files exceeding size limit with 413", () => {
    const hugeSize = 35 * 1024 * 1024; // 35 MB > 30 MB document limit
    const req = createMockReq("large.pdf", "application/pdf", hugeSize) as Request;
    const mockRes = createMockRes();
    let nextCalled = false;
    const next: NextFunction = () => { nextCalled = true; };

    guardDocument(req, mockRes.res as Response, next);

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(mockRes.statusMock, 413);
    assert.strictEqual(mockRes.jsonBody?.code, "FILE_TOO_LARGE");
  });

  it("calls next when no file is present on request", () => {
    const req = { file: undefined } as unknown as Request;
    const mockRes = createMockRes();
    let nextCalled = false;
    const next: NextFunction = () => { nextCalled = true; };

    guardDocument(req, mockRes.res as Response, next);

    assert.strictEqual(nextCalled, true);
  });
});
