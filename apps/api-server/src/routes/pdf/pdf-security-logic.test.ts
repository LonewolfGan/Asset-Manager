import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { protectPdf, unlockPdf } from "./pdf-security-logic.js";

async function createSamplePdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([200, 200]);
  page.drawText("Confidential Document", { x: 20, y: 100 });
  return Buffer.from(await doc.save());
}

describe("PDF Security Studio Engine (TDD)", () => {
  describe("protectPdf", () => {
    it("encrypts a PDF document with AES-256 using a user password", async () => {
      const sample = await createSamplePdf();
      const result = await protectPdf(sample, {
        userPassword: "SecretPassword123!",
        allowPrinting: true,
        allowCopying: false,
      });

      assert.strictEqual(result.buffer instanceof Buffer, true);
      assert.strictEqual(result.buffer.length > 0, true);
      assert.strictEqual(result.encryption, "AES-256");

      // Verify unlocking with the password recovers valid PDF
      const unlocked = await unlockPdf(result.buffer, {
        password: "SecretPassword123!",
      });
      assert.strictEqual(unlocked instanceof Buffer, true);
      const doc = await PDFDocument.load(unlocked);
      assert.strictEqual(doc.getPageCount(), 1);
    });

    it("throws when neither userPassword nor ownerPassword is provided", async () => {
      const sample = await createSamplePdf();
      await assert.rejects(
        async () => {
          await protectPdf(sample, {});
        },
        {
          message: /At least one password/,
        }
      );
    });

    it("throws when password exceeds 128 characters", async () => {
      const sample = await createSamplePdf();
      await assert.rejects(
        async () => {
          await protectPdf(sample, { userPassword: "a".repeat(129) });
        },
        {
          message: /Password too long/,
        }
      );
    });

    it("throws when userPassword and ownerPassword are identical", async () => {
      const sample = await createSamplePdf();
      await assert.rejects(
        async () => {
          await protectPdf(sample, {
            userPassword: "SamePassword123!",
            ownerPassword: "SamePassword123!",
          });
        },
        {
          message: /cannot be identical/,
        }
      );
    });

    it("throws when buffer does not start with %PDF- magic header", async () => {
      const fakePdf = Buffer.from("NOT_A_PDF_FILE_HEADER");
      await assert.rejects(
        async () => {
          await protectPdf(fakePdf, { userPassword: "ValidPassword123!" });
        },
        {
          message: /Invalid or corrupted PDF buffer/,
        }
      );
    });
  });

  describe("unlockPdf", () => {
    it("rejects with descriptive error when incorrect password is provided", async () => {
      const sample = await createSamplePdf();
      const protectedPdf = await protectPdf(sample, {
        userPassword: "CorrectPassword123!",
      });

      await assert.rejects(
        async () => {
          await unlockPdf(protectedPdf.buffer, {
            password: "WrongPassword999!",
          });
        },
        {
          message: /password/i,
        }
      );
    });

    it("throws when unlock password exceeds 128 characters", async () => {
      const sample = await createSamplePdf();
      await assert.rejects(
        async () => {
          await unlockPdf(sample, { password: "a".repeat(129) });
        },
        {
          message: /Password too long/,
        }
      );
    });

    it("preserves intentional spaces in passphrases roundtrip", async () => {
      const sample = await createSamplePdf();
      const protectedPdf = await protectPdf(sample, {
        userPassword: "  pass with spaces  ",
      });

      const unlocked = await unlockPdf(protectedPdf.buffer, {
        password: "  pass with spaces  ",
      });
      assert.strictEqual(unlocked instanceof Buffer, true);
      const doc = await PDFDocument.load(unlocked);
      assert.strictEqual(doc.getPageCount(), 1);
    });

    it("passes through unencrypted PDF without failing", async () => {
      const sample = await createSamplePdf();
      const unlocked = await unlockPdf(sample, {});
      assert.strictEqual(unlocked instanceof Buffer, true);
      const doc = await PDFDocument.load(unlocked);
      assert.strictEqual(doc.getPageCount(), 1);
    });
  });
});
