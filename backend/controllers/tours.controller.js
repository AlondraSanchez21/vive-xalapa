import { db } from "../db.js";

export const getTours = async(req, res) => {
    try {
        const conn = await db.getConnection();
        const [tours] = await conn.query("SELECT * FROM tours");
        conn.release();
        res.json(tours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTour = async(req, res) => {
    try {
        const { id } = req.params;
        const conn = await db.getConnection();
        const [tour] = await conn.query("SELECT * FROM tours WHERE id = ?", [id]);
        conn.release();
        res.json(tour[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createTour = async(req, res) => {
    try {
        const { nombre, descripcion, ubicacion, precio_base, precio_antes, duracion, idiomas, incluye, horarios, calificacion } = req.body;
        const imagen = req.file ? '/uploads/' + req.file.filename : req.body.imagen;
        const conn = await db.getConnection();
        const result = await conn.query(
            "INSERT INTO tours (nombre, descripcion, ubicacion, precio_base, precio_antes, imagen, duracion, idiomas, incluye, horarios, calificacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [nombre, descripcion, ubicacion, precio_base, precio_antes, imagen, duracion, JSON.stringify(idiomas), JSON.stringify(incluye), JSON.stringify(horarios), calificacion]
        );
        conn.release();
        res.json({ id: result[0].insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTour = async(req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, ubicacion, precio_base, precio_antes, duracion, idiomas, incluye, horarios, calificacion } = req.body;
        const imagen = req.file ? '/uploads/' + req.file.filename : req.body.imagen;
        const conn = await db.getConnection();
        await conn.query(
            "UPDATE tours SET nombre=?, descripcion=?, ubicacion=?, precio_base=?, precio_antes=?, imagen=?, duracion=?, idiomas=?, incluye=?, horarios=?, calificacion=? WHERE id=?", [nombre, descripcion, ubicacion, precio_base, precio_antes, imagen, duracion, JSON.stringify(idiomas), JSON.stringify(incluye), JSON.stringify(horarios), calificacion, id]
        );
        conn.release();
        res.json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTour = async(req, res) => {
    try {
        const { id } = req.params;
        const conn = await db.getConnection();
        await conn.query("DELETE FROM tours WHERE id=?", [id]);
        conn.release();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};