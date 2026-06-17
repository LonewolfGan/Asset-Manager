import { Router, type IRouter } from "express";
import { upload, guardBackground } from "../middlewares/upload.js";

const router: IRouter = Router();

// Cache the removeBackground function after first import to avoid
// reloading the ONNX model and WASM runtime on every request.
type RemoveBgFn = typeof import("@imgly/background-removal-node").removeBackground;
let removeBgFn: RemoveBgFn | null = null;

async function getRemoveBackground(): Promise<RemoveBgFn> {
  if (!removeBgFn) {
    const mod = await import("@imgly/background-removal-node");
    removeBgFn = mod.removeBackground;
  }
  return removeBgFn;
}

router.post(
  "/remove-background",
  upload.single("file"),
  guardBackground,
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    try {
      const removeBackground = await getRemoveBackground();

      const inputBlob = new Blob([req.file.buffer], { type: req.file.mimetype });

      const resultBlob = await removeBackground(inputBlob, {
        model: "medium",
        output: { format: "image/png" },
      });

      const arrayBuffer = await resultBlob.arrayBuffer();
      const outBuffer = Buffer.from(arrayBuffer);

      res.set("Content-Type", "image/png");
      res.set("Content-Disposition", `attachment; filename="no-bg.png"`);
      res.set("Cache-Control", "no-store");
      res.send(outBuffer);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Background removal failed";
      res.status(500).json({ error: message });
    }
  },
);

export default router;
