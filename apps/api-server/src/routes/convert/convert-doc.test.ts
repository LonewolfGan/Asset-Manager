import { describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import { PDFDocument } from "pdf-lib";
import convertDocRouter from "./convert-doc.js";

function startTestServer(): Promise<{ server: http.Server; port: number }> {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.use(convertDocRouter);
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const addr = server.address() as { port: number };
      resolve({ server, port: addr.port });
    });
  });
}

async function createSamplePdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([300, 300]);
  page.drawText("Quarterly Financial Report Q3", { x: 20, y: 250 });
  page.drawText("Total Revenue: $1,250,000", { x: 20, y: 220 });
  return Buffer.from(await doc.save());
}

describe("Convert Doc Routes (TDD)", () => {
  describe("POST /convert/pdf-to-word", () => {
    it("returns 400 when no file is uploaded", async () => {
      const { server, port } = await startTestServer();
      try {
        const res = await fetch(`http://127.0.0.1:${port}/convert/pdf-to-word`, {
          method: "POST",
        });
        assert.strictEqual(res.status, 400);
        const json = await res.json() as any;
        assert.strictEqual(json.code, "NO_FILE");
      } finally {
        server.close();
      }
    });

    it("converts PDF to DOCX and sets RFC 5987 Content-Disposition headers", async () => {
      const { server, port } = await startTestServer();
      try {
        const pdfBuf = await createSamplePdf();
        const formData = new FormData();
        const blob = new Blob([pdfBuf], { type: "application/pdf" });
        formData.append("file", blob, "rapport_trimestriel_été_2024.pdf");

        const res = await fetch(`http://127.0.0.1:${port}/convert/pdf-to-word`, {
          method: "POST",
          body: formData,
        });

        assert.strictEqual(res.status, 200);
        const ct = res.headers.get("content-type") ?? "";
        assert.ok(ct.includes("openxmlformats-officedocument.wordprocessingml.document"));

        const disposition = res.headers.get("content-disposition") ?? "";
        assert.ok(disposition.includes("filename="));
        assert.ok(disposition.includes("filename*="));
        assert.ok(disposition.includes("UTF-8''"));

        const arrayBuf = await res.arrayBuffer();
        assert.ok(arrayBuf.byteLength > 100);
      } finally {
        server.close();
      }
    });
  });

  describe("POST /convert/pdf-to-excel", () => {
    it("returns 400 when no file is uploaded", async () => {
      const { server, port } = await startTestServer();
      try {
        const res = await fetch(`http://127.0.0.1:${port}/convert/pdf-to-excel`, {
          method: "POST",
        });
        assert.strictEqual(res.status, 400);
        const json = await res.json() as any;
        assert.strictEqual(json.code, "NO_FILE");
      } finally {
        server.close();
      }
    });

    it("converts PDF to XLSX and sets RFC 5987 Content-Disposition headers", async () => {
      const { server, port } = await startTestServer();
      try {
        const pdfBuf = await createSamplePdf();
        const formData = new FormData();
        const blob = new Blob([pdfBuf], { type: "application/pdf" });
        formData.append("file", blob, "données_comptables_clôture.pdf");

        const res = await fetch(`http://127.0.0.1:${port}/convert/pdf-to-excel`, {
          method: "POST",
          body: formData,
        });

        assert.strictEqual(res.status, 200);
        const ct = res.headers.get("content-type") ?? "";
        assert.ok(ct.includes("openxmlformats-officedocument.spreadsheetml.sheet"));

        const disposition = res.headers.get("content-disposition") ?? "";
        assert.ok(disposition.includes("filename="));
        assert.ok(disposition.includes("filename*="));
        assert.ok(disposition.includes("UTF-8''"));

        const arrayBuf = await res.arrayBuffer();
        assert.ok(arrayBuf.byteLength > 100);
      } finally {
        server.close();
      }
    });
  });
});
