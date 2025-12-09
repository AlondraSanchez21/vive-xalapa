import { Router } from 'express';
import { getResenas, createResena, updateResena, deleteResena } from '../controllers/resenas.controller.js';

const router = Router();

// GET /api/resenas?tipo=hotel&producto_id=1
router.get('/', getResenas);
// POST /api/resenas
router.post('/', createResena);
// PUT /api/resenas/:id
router.put('/:id', updateResena);
// DELETE /api/resenas/:id
router.delete('/:id', deleteResena);

export default router;