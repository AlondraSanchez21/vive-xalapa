import express from "express";
import cors from "cors";
import fs from 'fs';
import path from 'path';
import adminRoutes from "./admin.routes.js";
import hotelesRoutes from "./routes/hoteles.routes.js";
import toursRoutes from "./routes/tours.routes.js";
import viajesRoutes from "./routes/viajes.routes.js";
import gastronomiasRoutes from "./routes/gastronomias.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import reservasRoutes from "./routes/reservas.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ensure uploads folder exists and serve it
const uploadsDir = path.join(process.cwd(), 'uploads');
try { if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir); } catch (e) { console.warn('Could not create uploads dir', e); }
app.use('/uploads', express.static(uploadsDir));

// ruta base del panel admin
app.use("/api/admin", adminRoutes);

// rutas públicas
app.use("/api/hoteles", hotelesRoutes);
app.use("/api/tours", toursRoutes);
app.use("/api/viajes", viajesRoutes);
app.use("/api/gastronomias", gastronomiasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reservas", reservasRoutes);

app.listen(3000, () => console.log("Backend corriendo en puerto 3000"));