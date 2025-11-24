import express from 'express';

import {
  buscarUsuario,
  criarUsuario,
  listarUsuarios,
  atualizarUsuario
} from '../controllers/UserController.js';

const router = express.Router();

router.post('/users', criarUsuario);
router.get('/users', listarUsuarios);
router.get('/users/:id', buscarUsuario);
router.put('/users/:id', atualizarUsuario);

export default router;

