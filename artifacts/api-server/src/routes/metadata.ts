import { Router, type IRouter } from "express";
import { PDFDocument } from "pdf-lib";
import piexif from "piexifjs";
import { upload, guardMetadata } from "../middlewares/upload.js";

const router: IRouter = Router();

router.post("/metadata/read", upload.single("file"), guardMetadata, async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const mime = req.file.mimetype;

  try {
    if (mime === "image/jpeg") {
      const b64 = req.file.buffer.toString("base64");
      const dataUrl = `data:image/jpeg;base64,${b64}`;
      const exifObj = piexif.load(dataUrl);
      res.json({ type: "jpeg", metadata: exifObj });
    } else if (mime === "application/pdf") {
      const pdfDoc = await PDFDocument.load(req.file.buffer);
      res.json({
        type: "pdf",
        metadata: {
          title: pdfDoc.getTitle() ?? "",
          author: pdfDoc.getAuthor() ?? "",
          subject: pdfDoc.getSubject() ?? "",
          producer: pdfDoc.getProducer() ?? "",
          creator: pdfDoc.getCreator() ?? "",
          keywords: pdfDoc.getKeywords() ?? "",
        },
      });
    } else {
      res.status(400).json({ error: "Unsupported file type. Only JPEG and PDF are supported." });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to read metadata";
    res.status(500).json({ error: message });
  }
});

router.post("/metadata/clean", upload.single("file"), guardMetadata, async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const mime = req.file.mimetype;
  const originalName = req.file.originalname ?? "cleaned";

  try {
    if (mime === "image/jpeg") {
      const b64 = req.file.buffer.toString("base64");
      const dataUrl = `data:image/jpeg;base64,${b64}`;
      const cleanedDataUrl = piexif.remove(dataUrl);
      const cleanedB64 = cleanedDataUrl.split(",")[1];
      const outBuffer = Buffer.from(cleanedB64, "base64");
      res.set("Content-Type", "image/jpeg");
      res.set("Content-Disposition", `attachment; filename="cleaned-${originalName}"`);
      res.send(outBuffer);
    } else if (mime === "application/pdf") {
      const pdfDoc = await PDFDocument.load(req.file.buffer);
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");
      const pdfBytes = await pdfDoc.save();
      res.set("Content-Type", "application/pdf");
      res.set("Content-Disposition", `attachment; filename="cleaned-${originalName}"`);
      res.send(Buffer.from(pdfBytes));
    } else {
      res.status(400).json({ error: "Unsupported file type. Only JPEG and PDF are supported." });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to clean metadata";
    res.status(500).json({ error: message });
  }
});

export default router;
