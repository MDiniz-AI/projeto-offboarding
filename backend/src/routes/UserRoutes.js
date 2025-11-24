import express from 'express';
import { verifyTempToken } from "../middlewares/auth.js";
import {
  buscarUsuario,
  criarUsuario,
  listarUsuarios,
  atualizarUsuario,
  buscarUsuarioPorEmail 
} from '../controllers/UserController.js';

const router = express.Router();

router.post('/users', verifyTempToken,  criarUsuario);
router.get('/users', verifyTempToken , listarUsuarios);
router.get('/users/:id', verifyTempToken ,buscarUsuario);
router.put('/users/:id', verifyTempToken, atualizarUsuario);
router.get("/email/:email", buscarUsuarioPorEmail);

export default router;

