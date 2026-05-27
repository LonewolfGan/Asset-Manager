import { Router, type IRouter } from "express";
import { upload } from "../middlewares/upload.js";

const router: IRouter = Router();

router.post("/remove-background", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    const { removeBackground } = await import("@imgly/background-removal-node");

    const inputBuffer = req.file.buffer;
    const resultBlob = await removeBackground(inputBuffer, {
      model: "medium",
      output: { format: "image/png" },
    });

    const arrayBuffer = await resultBlob.arrayBuffer();
    const outBuffer = Buffer.from(arrayBuffer);

    res.set("Content-Type", "image/png");
    res.set("Content-Disposition", `attachment; filename="no-bg.png"`);
    res.send(outBuffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Background removal failed";
    res.status(500).json({ error: message });
  }
});

export default router;
