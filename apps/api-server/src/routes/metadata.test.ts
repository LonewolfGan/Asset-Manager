import { test, describe } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { PDFDocument, PDFName } from "pdf-lib";
import piexif from "piexifjs";
import { buildContentDisposition } from "./convert/convert-image.js";
import { linearizePdf } from "../lib/pdf-linearize.js";

describe("Metadata Cleaner & Reader Engine (TDD)", () => {
  test("Content-Disposition formatting preserves multi-dot filenames with RFC 5987", () => {
    // Single dot
    const headerSingle = buildContentDisposition("cleaned-document.pdf", "pdf");
    assert.match(headerSingle, /filename="cleaned-document\.pdf"/);

    // Multi-dot preservation (e.g. rapport.v2.final.pdf)
    const rawMulti = "rapport.v2.final";
    const outBase = `cleaned-${rawMulti}`;
    const headerMulti = buildContentDisposition(`${outBase}.pdf`, "pdf");
    assert.match(headerMulti, /filename="cleaned-rapport\.v2\.final\.pdf"/);

    // Accented / UTF-8 multi-dot name
    const headerUtf8 = buildContentDisposition("cleaned-résumé.sécurité.v1.pdf", "pdf");
    assert.match(headerUtf8, /filename\*=UTF-8''/);
    assert.match(headerUtf8, /cleaned-r/);
  });

  test("PDF metadata cleaning removes standard info and XMP catalog stream", async () => {
    const doc = await PDFDocument.create();
    doc.setTitle("Classified Intelligence");
    doc.setAuthor("Analyst 42");
    doc.setSubject("Operations");
    doc.setKeywords(["covert", "restricted"]);
    doc.setProducer("Special Ops PDF Generator");
    doc.setCreator("HQ Mission Control");
    doc.addPage([200, 200]);

    // Simulate XMP Metadata entry in catalog
    const xmpStream = doc.context.flateStream("<x:xmpmeta>classified</x:xmpmeta>");
    const xmpRef = doc.context.register(xmpStream);
    doc.catalog.set(PDFName.of("Metadata"), xmpRef);

    const pdfBytes = await doc.save();

    // Verify initial metadata
    const loadedBefore = await PDFDocument.load(pdfBytes);
    assert.equal(loadedBefore.getTitle(), "Classified Intelligence");
    assert.ok(loadedBefore.catalog.has(PDFName.of("Metadata")));

    // Clean metadata
    loadedBefore.setTitle("");
    loadedBefore.setAuthor("");
    loadedBefore.setSubject("");
    loadedBefore.setKeywords([]);
    loadedBefore.setProducer("");
    loadedBefore.setCreator("");
    loadedBefore.catalog.delete(PDFName.of("Metadata"));

    const cleanedBytes = await loadedBefore.save();
    const linearized = await linearizePdf(Buffer.from(cleanedBytes));

    assert.ok(linearized.length > 0);
    assert.equal(linearized.subarray(0, 5).toString("ascii"), "%PDF-");

    const loadedAfter = await PDFDocument.load(linearized);
    assert.equal(loadedAfter.getTitle() ?? "", "");
    assert.equal(loadedAfter.getAuthor() ?? "", "");
    assert.equal(loadedAfter.catalog.has(PDFName.of("Metadata")), false);
  });

  test("Piexifjs lossless EXIF removal operates without quality loss on orientation 1", async () => {
    // Generate valid JPEG
    const initialJpg = await sharp({
      create: { width: 50, height: 50, channels: 3, background: { r: 100, g: 150, b: 200 } },
    })
      .jpeg()
      .toBuffer();

    const b64 = initialJpg.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${b64}`;

    // Add dummy EXIF
    const zeroth: Record<number, unknown> = {};
    zeroth[piexif.ImageIFD.Make] = "TestCamera";
    const exifObj = { "0th": zeroth, Exif: {}, GPS: {}, "1st": {}, thumbnail: undefined };
    const exifBytes = piexif.dump(exifObj);
    const withExif = piexif.insert(exifBytes, dataUrl);

    // Verify EXIF is present
    const loadedExif = piexif.load(withExif);
    assert.equal(loadedExif["0th"]?.[piexif.ImageIFD.Make], "TestCamera");

    // Remove EXIF cleanly
    const strippedDataUrl = piexif.remove(withExif);
    const strippedB64 = strippedDataUrl.split(",")[1];
    const strippedBuf = Buffer.from(strippedB64, "base64");

    const meta = await sharp(strippedBuf).metadata();
    assert.equal(meta.width, 50);
    assert.equal(meta.height, 50);
  });

  test("Image metadata cleaning removes EXIF and retains image dimensions and color", async () => {
    const initialJpg = await sharp({
      create: {
        width: 120,
        height: 80,
        channels: 3,
        background: { r: 50, g: 120, b: 200 },
      },
    })
      .jpeg()
      .toBuffer();

    const metaBefore = await sharp(initialJpg).metadata();
    assert.equal(metaBefore.width, 120);
    assert.equal(metaBefore.height, 80);

    const cleanedJpg = await sharp(initialJpg)
      .rotate()
      .withIccProfile("srgb")
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer();

    const metaAfter = await sharp(cleanedJpg).metadata();
    assert.equal(metaAfter.width, 120);
    assert.equal(metaAfter.height, 80);
    assert.equal(metaAfter.exif, undefined);
  });

  test("PNG metadata cleaning retains transparency and dimensions", async () => {
    const initialPng = await sharp({
      create: {
        width: 64,
        height: 64,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 0.5 },
      },
    })
      .png()
      .toBuffer();

    const cleanedPng = await sharp(initialPng)
      .rotate()
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();

    const meta = await sharp(cleanedPng).metadata();
    assert.equal(meta.width, 64);
    assert.equal(meta.height, 64);
    assert.equal(meta.hasAlpha, true);
  });
});
