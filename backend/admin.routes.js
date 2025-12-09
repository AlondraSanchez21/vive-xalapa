import { Router } from "express";
import { adminLogin } from "./admin.controller.js";
import * as hotelesController from "./controllers/hoteles.controller.js";
import * as toursController from "./controllers/tours.controller.js";
import * as viajesController from "./controllers/viajes.controller.js";
import * as gastronomiasController from "./controllers/gastronomias.controller.js";
import * as usuariosController from "./controllers/usuarios.controller.js";

const router = Router();

// Auth
router.post("/login", adminLogin);

// CRUD Hoteles
router.get("/hoteles", hotelesController.getHoteles);
router.post("/hoteles", hotelesController.createHotel);
router.put("/hoteles/:id", hotelesController.updateHotel);
router.delete("/hoteles/:id", hotelesController.deleteHotel);

// CRUD Tours
router.get("/tours", toursController.getTours);
router.post("/tours", toursController.createTour);
router.put("/tours/:id", toursController.updateTour);
router.delete("/tours/:id", toursController.deleteTour);

// CRUD Viajes
router.get("/viajes", viajesController.getViajes);
router.post("/viajes", viajesController.createViaje);
router.put("/viajes/:id", viajesController.updateViaje);
router.delete("/viajes/:id", viajesController.deleteViaje);

// CRUD Gastronomias
router.get("/gastronomias", gastronomiasController.getGastronomias);
router.post("/gastronomias", gastronomiasController.createGastronomia);
router.put("/gastronomias/:id", gastronomiasController.updateGastronomia);
router.delete("/gastronomias/:id", gastronomiasController.deleteGastronomia);

// CRUD Usuarios
router.get("/usuarios", usuariosController.getUsuarios);
router.put("/usuarios/:id", usuariosController.updateUsuario);
router.delete("/usuarios/:id", usuariosController.deleteUsuario);

export default router;