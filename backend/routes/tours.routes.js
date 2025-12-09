import { Router } from "express";
import multer from 'multer';
import * as toursController from "../controllers/tours.controller.js";

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get("/", toursController.getTours);
router.get("/:id", toursController.getTour);
router.post("/", upload.single('imagen'), toursController.createTour);
router.put("/:id", upload.single('imagen'), toursController.updateTour);
router.delete("/:id", toursController.deleteTour);

export default router;