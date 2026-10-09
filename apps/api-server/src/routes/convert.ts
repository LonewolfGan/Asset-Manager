import { Router, type IRouter } from "express";
import docConvertRouter from "./convert/convert-doc.js";
import imageConvertRouter from "./convert/convert-image.js";

const router: IRouter = Router();

router.use(docConvertRouter);
router.use(imageConvertRouter);

export default router;
