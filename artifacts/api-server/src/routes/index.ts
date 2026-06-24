import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import ratesRouter from "./rates.js";
import textRouter from "./text.js";
import backgroundRouter from "./background.js";
import metadataRouter from "./metadata.js";
import convertRouter from "./convert.js";
import imageToolsRouter from "./image-tools.js";
import pdfToolsRouter from "./pdf-tools.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ratesRouter);
router.use(textRouter);
router.use(backgroundRouter);
router.use(metadataRouter);
router.use(convertRouter);
router.use(imageToolsRouter);
router.use(pdfToolsRouter);

export default router;
