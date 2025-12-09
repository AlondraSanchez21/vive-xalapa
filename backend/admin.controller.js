import { db } from "./db.js";

export const adminLogin = async(req, res) => {
    const { usuario, password } = req.body;

    try {
        const [rows] = await db.query(
            "SELECT * FROM admin WHERE usuario = ? AND password = ?", [usuario, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        return res.json({
            message: "Login exitoso",
            admin: {
                id: rows[0].id,
                usuario: rows[0].usuario
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};