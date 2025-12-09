import { Router } from "express";
import * as favoritosController from "../controllers/favoritos.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Middleware: verificar token en todas las rutas
router.use(verificarToken);

// GET all favoritos del usuario
router.get("/", favoritosController.getFavoritos);

// GET favoritos por tipo
router.get("/tipo/:tipo", favoritosController.getFavoritosByType);

// GET check si está favoriteado
router.get("/check/:tipo/:producto_id", favoritosController.checkFavorito);

// POST agregar favorito
router.post("/", favoritosController.addFavorito);

// POST toggle favorito
router.post("/toggle", favoritosController.toggleFavorito);

// DELETE eliminar favorito
router.delete("/:tipo/:producto_id", favoritosController.removeFavorito);

export default router;