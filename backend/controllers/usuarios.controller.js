import { db } from "../db.js";

export const getUsuarios = async(req, res) => {
    try {
        const conn = await db.getConnection();
        const [usuarios] = await conn.query("SELECT id, nombre, email, telefono, ciudad, rol FROM usuarios");
        conn.release();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsuario = async(req, res) => {
    try {
        const { id } = req.params;
        const conn = await db.getConnection();
        const [usuario] = await conn.query("SELECT id, nombre, email, telefono, ciudad, rol FROM usuarios WHERE id = ?", [id]);
        conn.release();
        res.json(usuario[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUsuario = async(req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, telefono, ciudad, rol } = req.body;
        const conn = await db.getConnection();
        await conn.query(
            "UPDATE usuarios SET nombre=?, email=?, telefono=?, ciudad=?, rol=? WHERE id=?", [nombre, email, telefono, ciudad, rol, id]
        );
        conn.release();
        res.json({ id, nombre, email, telefono, ciudad, rol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUsuario = async(req, res) => {
    try {
        const { id } = req.params;
        const conn = await db.getConnection();
        await conn.query("DELETE FROM usuarios WHERE id=?", [id]);
        conn.release();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};