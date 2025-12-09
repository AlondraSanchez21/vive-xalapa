import { Router } from "express";
import multer from 'multer';
import * as gastronomiasController from "../controllers/gastronomias.controller.js";

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get("/", gastronomiasController.getGastronomias);
router.get("/:id", gastronomiasController.getGastronomia);
router.post("/", upload.single('imagen'), gastronomiasController.createGastronomia);
router.put("/:id", upload.single('imagen'), gastronomiasController.updateGastronomia);
router.delete("/:id", gastronomiasController.deleteGastronomia);

export default router;