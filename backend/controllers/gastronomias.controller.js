import { db } from "../db.js";

export const getGastronomias = async(req, res) => {
    try {
        const conn = await db.getConnection();
        const [gastronomias] = await conn.query("SELECT * FROM gastronomias");
        conn.release();
        res.json(gastronomias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getGastronomia = async(req, res) => {
    try {
        const { id } = req.params;
        const conn = await db.getConnection();
        const [gastronomia] = await conn.query("SELECT * FROM gastronomias WHERE id = ?", [id]);
        conn.release();
        res.json(gastronomia[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createGastronomia = async(req, res) => {
    try {
        const { nombre, descripcion, ubicacion, precioPromedio, tipoComida, horarios, telefono } = req.body;
        const imagen = req.file ? '/uploads/' + req.file.filename : req.body.imagen;
        const conn = await db.getConnection();
        const result = await conn.query(
            "INSERT INTO gastronomias (nombre, descripcion, ubicacion, precioPromedio, imagen, tipoComida, horarios, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [nombre, descripcion, ubicacion, precioPromedio, imagen, tipoComida, horarios, telefono]
        );
        conn.release();
        res.json({ id: result[0].insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateGastronomia = async(req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, ubicacion, precioPromedio, tipoComida, horarios, telefono } = req.body;
        const imagen = req.file ? '/uploads/' + req.file.filename : req.body.imagen;
        const conn = await db.getConnection();
        await conn.query(
            "UPDATE gastronomias SET nombre=?, descripcion=?, ubicacion=?, precioPromedio=?, imagen=?, tipoComida=?, horarios=?, telefono=? WHERE id=?", [nombre, descripcion, ubicacion, precioPromedio, imagen, tipoComida, horarios, telefono, id]
        );
        conn.release();
        res.json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteGastronomia = async(req, res) => {
    try {
        const { id } = req.params;
        const conn = await db.getConnection();
        await conn.query("DELETE FROM gastronomias WHERE id=?", [id]);
        conn.release();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};