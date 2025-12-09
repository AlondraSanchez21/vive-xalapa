// Controlador para reseñas (comentarios y calificaciones)
import db from '../db.js';

// Obtener reseñas por tipo y producto (hotel, tour, lugar, gastronomia)
export const getResenas = async(req, res) => {
    const { tipo, producto_id } = req.query;
    try {
        const [rows] = await db.query(
            'SELECT r.*, u.nombre as usuario_nombre, u.foto_perfil FROM resenas r JOIN usuarios u ON r.usuario_id = u.id WHERE r.tipo = ? AND r.producto_id = ? AND r.estado = "aprobada" ORDER BY r.created_at DESC', [tipo, producto_id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener reseñas', details: err });
    }
};

// Crear nueva reseña
export const createResena = async(req, res) => {
    const { usuario_id, tipo, producto_id, calificacion, titulo, texto } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO resenas (usuario_id, tipo, producto_id, calificacion, titulo, texto, estado) VALUES (?, ?, ?, ?, ?, ?, "aprobada")', [usuario_id, tipo, producto_id, calificacion, titulo, texto]
        );
        res.json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear reseña', details: err });
    }
};

// (Opcional) Editar reseña
export const updateResena = async(req, res) => {
    const { id } = req.params;
    const { calificacion, titulo, texto } = req.body;
    try {
        await db.query(
            'UPDATE resenas SET calificacion = ?, titulo = ?, texto = ?, updated_at = NOW() WHERE id = ?', [calificacion, titulo, texto, id]
        );
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar reseña', details: err });
    }
};

// (Opcional) Eliminar reseña
export const deleteResena = async(req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM resenas WHERE id = ?', [id]);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar reseña', details: err });
    }
};