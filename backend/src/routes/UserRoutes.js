import express from 'express';
import { criarUsuario, listarUsuarios } from '../controllers/UserController.js';

const router = express.Router();

router.post('/users', criarUsuario);
router.get('/users', listarUsuarios);

export default router;

