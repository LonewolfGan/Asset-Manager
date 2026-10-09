import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mkdir, writeFile, stat, utimes, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { cleanupTempFiles } from "./temp-cleanup.js";

describe("Temp Cleanup Service (TDD)", () => {
  const rootDir = join(tmpdir(), "everydaytools");
  const testSubDirOld = join(rootDir, "test-old-job");
  const testSubDirNew = join(rootDir, "test-new-job");

  before(async () => {
    await mkdir(testSubDirOld, { recursive: true });
    await mkdir(testSubDirNew, { recursive: true });

    await writeFile(join(testSubDirOld, "data.txt"), "old content");
    await writeFile(join(testSubDirNew, "data.txt"), "new content");

    // Backdate testSubDirOld and rootDir by 2 hours
    const pastTime = (Date.now() - 2 * 60 * 60 * 1000) / 1000;
    await utimes(testSubDirOld, pastTime, pastTime);
    await utimes(rootDir, pastTime, pastTime);
  });

  after(async () => {
    await rm(testSubDirOld, { recursive: true, force: true }).catch(() => {});
    await rm(testSubDirNew, { recursive: true, force: true }).catch(() => {});
  });

  it("never deletes the parent everydaytools directory itself even if old", async () => {
    // Run cleanup with maxAgeMs = 1 hour (3600000 ms)
    await cleanupTempFiles(3600000);

    // CRITICAL: The parent everydaytools folder MUST still exist!
    assert.strictEqual(
      existsSync(rootDir),
      true,
      "The root /tmp/everydaytools folder must NOT be deleted by cleanupTempFiles"
    );

    // Old subfolder must be purged
    assert.strictEqual(
      existsSync(testSubDirOld),
      false,
      "Expired subfolder should have been purged"
    );

    // Fresh subfolder must still exist
    assert.strictEqual(
      existsSync(testSubDirNew),
      true,
      "Fresh subfolder must remain untouched"
    );
  });
});
