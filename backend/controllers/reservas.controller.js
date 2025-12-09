import { db } from "../db.js";

export const getReservas = async(req, res) => {
    try {
        const conn = await db.getConnection();
        const [reservas] = await conn.query("SELECT * FROM reservas ORDER BY fecha_reserva DESC");
        conn.release();
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createReserva = async(req, res) => {
    try {
        const payload = req.body || {};
        // Determinar tipo y producto
        let tipo = payload.tipo || 'tour';
        let producto_id = payload.producto_id || payload.id_tour || payload.id_hotel || payload.hotelId || null;
        let cantidad = payload.cantidad || 1;
        let precio_total = payload.total || payload.precioTotal || payload.totalPrice || 0;

        const conn = await db.getConnection();
        const result = await conn.query(
            "INSERT INTO reservas (usuario_id, tipo, producto_id, cantidad, precio_total) VALUES (?, ?, ?, ?, ?)", [null, tipo, producto_id, cantidad, precio_total]
        );
        conn.release();

        res.json({ id: result[0].insertId, tipo, producto_id, cantidad, precio_total, received: payload });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};