import { Router } from "express";
import imageCompressRouter from "./images/image-compress.js";
import imageTransformRouter from "./images/image-transform.js";
import imageEnhanceRouter from "./images/image-enhance.js";

const router = Router();

router.use(imageCompressRouter);
router.use(imageTransformRouter);
router.use(imageEnhanceRouter);

export default router;
