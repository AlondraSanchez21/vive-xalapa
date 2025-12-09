import { db } from "../db.js";

export const getHoteles = async(req, res) => {
    try {
        const conn = await db.getConnection();
        const [hoteles] = await conn.query("SELECT * FROM hoteles");
        conn.release();
        res.json(hoteles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getHotel = async(req, res) => {
    try {
        const { id } = req.params;
        const conn = await db.getConnection();
        const [hotel] = await conn.query("SELECT * FROM hoteles WHERE id = ?", [id]);
        conn.release();
        res.json(hotel[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createHotel = async(req, res) => {
    try {
        const { nombre, descripcion, ubicacion, precio_base, precio_antes, calificacion, habitaciones, amenidades } = req.body;
        // if file uploaded, use its path
        const imagen = req.file ? '/uploads/' + req.file.filename : req.body.imagen;
        const conn = await db.getConnection();
        const result = await conn.query(
            "INSERT INTO hoteles (nombre, descripcion, ubicacion, precio_base, precio_antes, imagen, calificacion, habitaciones, amenidades) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [nombre, descripcion, ubicacion, precio_base, precio_antes, imagen, calificacion, habitaciones, JSON.stringify(amenidades)]
        );
        conn.release();
        res.json({ id: result[0].insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateHotel = async(req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, ubicacion, precio_base, precio_antes, calificacion, habitaciones, amenidades } = req.body;
        const imagen = req.file ? '/uploads/' + req.file.filename : req.body.imagen;
        const conn = await db.getConnection();
        await conn.query(
            "UPDATE hoteles SET nombre=?, descripcion=?, ubicacion=?, precio_base=?, precio_antes=?, imagen=?, calificacion=?, habitaciones=?, amenidades=? WHERE id=?", [nombre, descripcion, ubicacion, precio_base, precio_antes, imagen, calificacion, habitaciones, JSON.stringify(amenidades), id]
        );
        conn.release();
        res.json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteHotel = async(req, res) => {
    try {
        const { id } = req.params;
        const conn = await db.getConnection();
        await conn.query("DELETE FROM hoteles WHERE id=?", [id]);
        conn.release();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};