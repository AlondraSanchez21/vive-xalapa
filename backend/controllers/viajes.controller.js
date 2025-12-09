import { db } from "../db.js";

export const getViajes = async(req, res) => {
    try {
        const conn = await db.getConnection();
        const [viajes] = await conn.query("SELECT * FROM viajes");
        conn.release();
        res.json(viajes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getViaje = async(req, res) => {
    try {
        const { id } = req.params;
        const conn = await db.getConnection();
        const [viaje] = await conn.query("SELECT * FROM viajes WHERE id = ?", [id]);
        conn.release();
        res.json(viaje[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createViaje = async(req, res) => {
    try {
        const { nombre, descripcion, origen, destino, precio_base, precio_antes, imagen, fecha_salida, hora_salida, duracion, tipo_transporte, asientos_disponibles } = req.body;
        const conn = await db.getConnection();
        const result = await conn.query(
            "INSERT INTO viajes (nombre, descripcion, origen, destino, precio_base, precio_antes, imagen, fecha_salida, hora_salida, duracion, tipo_transporte, asientos_disponibles) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [nombre, descripcion, origen, destino, precio_base, precio_antes, imagen, fecha_salida, hora_salida, duracion, tipo_transporte, asientos_disponibles]
        );
        conn.release();
        res.json({ id: result[0].insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateViaje = async(req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, origen, destino, precio_base, precio_antes, imagen, fecha_salida, hora_salida, duracion, tipo_transporte, asientos_disponibles } = req.body;
        const conn = await db.getConnection();
        await conn.query(
            "UPDATE viajes SET nombre=?, descripcion=?, origen=?, destino=?, precio_base=?, precio_antes=?, imagen=?, fecha_salida=?, hora_salida=?, duracion=?, tipo_transporte=?, asientos_disponibles=? WHERE id=?", [nombre, descripcion, origen, destino, precio_base, precio_antes, imagen, fecha_salida, hora_salida, duracion, tipo_transporte, asientos_disponibles, id]
        );
        conn.release();
        res.json({ id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteViaje = async(req, res) => {
    try {
        const { id } = req.params;
        const conn = await db.getConnection();
        await conn.query("DELETE FROM viajes WHERE id=?", [id]);
        conn.release();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};