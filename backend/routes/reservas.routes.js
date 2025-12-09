import { Router } from "express";
import * as reservasController from "../controllers/reservas.controller.js";

const router = Router();

router.get("/", reservasController.getReservas);
router.post("/", reservasController.createReserva);

export default router;