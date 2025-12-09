import { db } from "../db.js";

export const register = async(req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const conn = await db.getConnection();

        const result = await conn.query(
            "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'usuario')", [nombre, email, password]
        );
        conn.release();

        res.json({
            id: result[0].insertId,
            nombre,
            email,
            rol: 'usuario'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const conn = await db.getConnection();

        const [user] = await conn.query(
            "SELECT id, nombre, email, rol FROM usuarios WHERE email = ? AND password = ?", [email, password]
        );
        conn.release();

        if (user.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        res.json({
            token: "token_" + user[0].id,
            usuario: user[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};