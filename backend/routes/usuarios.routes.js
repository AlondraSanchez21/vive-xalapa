import { Router } from "express";
import * as usuariosController from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/", usuariosController.getUsuarios);
router.get("/:id", usuariosController.getUsuario);
router.put("/:id", usuariosController.updateUsuario);
router.delete("/:id", usuariosController.deleteUsuario);

export default router;