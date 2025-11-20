import express from 'express';

import { login, me } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { buscarUsuario, criarUsuario, listarUsuarios, atualizarUsuario } from '../controllers/UserController.js';

const router = express.Router();

router.post('/login', login);
router.post('/users', criarUsuario);
router.get('/users', authenticate, listarUsuarios);
router.get('/users/:id', authenticate, buscarUsuario);
router.get('/users/:id/entrevistas', authenticate, buscarUsuario);
router.put('/users/:id', authenticate, atualizarUsuario);



export default router;

