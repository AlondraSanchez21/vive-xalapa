import { Router } from "express";
import * as viajesController from "../controllers/viajes.controller.js";

const router = Router();

router.get("/", viajesController.getViajes);
router.get("/:id", viajesController.getViaje);
router.post("/", viajesController.createViaje);
router.put("/:id", viajesController.updateViaje);
router.delete("/:id", viajesController.deleteViaje);

export default router;