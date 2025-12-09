import { Router } from "express";
import multer from 'multer';
import * as hotelesController from "../controllers/hoteles.controller.js";

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get("/", hotelesController.getHoteles);
router.get("/:id", hotelesController.getHotel);
// accept file upload with field name 'imagen'
router.post("/", upload.single('imagen'), hotelesController.createHotel);
router.put("/:id", upload.single('imagen'), hotelesController.updateHotel);
router.delete("/:id", hotelesController.deleteHotel);

export default router;