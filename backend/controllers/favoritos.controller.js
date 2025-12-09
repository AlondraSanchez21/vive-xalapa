import db from '../db.js';

export async function getFavoritos(req, res) {
    const usuarioId = req.usuario ? .id;
    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });

    try {
        const [favoritos] = await db.query(
            'SELECT * FROM favoritos WHERE usuario_id = ? ORDER BY created_at DESC', [usuarioId]
        );
        res.json(favoritos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getFavoritosByType(req, res) {
    const usuarioId = req.usuario ? .id;
    const { tipo } = req.query;

    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });
    if (!tipo) return res.status(400).json({ error: 'tipo es requerido' });

    try {
        const [favoritos] = await db.query(
            'SELECT * FROM favoritos WHERE usuario_id = ? AND tipo = ? ORDER BY created_at DESC', [usuarioId, tipo]
        );
        res.json(favoritos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function checkFavorito(req, res) {
    const usuarioId = req.usuario ? .id;
    const { tipo, producto_id } = req.params;

    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });

    try {
        const [result] = await db.query(
            'SELECT id FROM favoritos WHERE usuario_id = ? AND tipo = ? AND producto_id = ?', [usuarioId, tipo, producto_id]
        );
        res.json(result.length > 0);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function addFavorito(req, res) {
    const usuarioId = req.usuario ? .id;
    const { tipo, producto_id } = req.body;

    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });
    if (!tipo || !producto_id) return res.status(400).json({ error: 'tipo y producto_id son requeridos' });

    try {
        // Check if already favorited
        const [existing] = await db.query(
            'SELECT id FROM favoritos WHERE usuario_id = ? AND tipo = ? AND producto_id = ?', [usuarioId, tipo, producto_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Ya está en favoritos' });
        }

        // Add to favorites
        await db.query(
            'INSERT INTO favoritos (usuario_id, tipo, producto_id) VALUES (?, ?, ?)', [usuarioId, tipo, producto_id]
        );

        res.status(201).json({ message: 'Agregado a favoritos' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function removeFavorito(req, res) {
    const usuarioId = req.usuario ? .id;
    const { tipo, producto_id } = req.params;

    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });

    try {
        await db.query(
            'DELETE FROM favoritos WHERE usuario_id = ? AND tipo = ? AND producto_id = ?', [usuarioId, tipo, producto_id]
        );
        res.json({ message: 'Eliminado de favoritos' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function toggleFavorito(req, res) {
    const usuarioId = req.usuario ? .id;
    const { tipo, producto_id } = req.body;

    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });
    if (!tipo || !producto_id) return res.status(400).json({ error: 'tipo y producto_id son requeridos' });

    try {
        // Check if already favorited
        const [existing] = await db.query(
            'SELECT id FROM favoritos WHERE usuario_id = ? AND tipo = ? AND producto_id = ?', [usuarioId, tipo, producto_id]
        );

        if (existing.length > 0) {
            // Remove from favorites
            await db.query(
                'DELETE FROM favoritos WHERE usuario_id = ? AND tipo = ? AND producto_id = ?', [usuarioId, tipo, producto_id]
            );
            res.json({ action: 'removed', message: 'Eliminado de favoritos' });
        } else {
            // Add to favorites
            await db.query(
                'INSERT INTO favoritos (usuario_id, tipo, producto_id) VALUES (?, ?, ?)', [usuarioId, tipo, producto_id]
            );
            res.status(201).json({ action: 'added', message: 'Agregado a favoritos' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}