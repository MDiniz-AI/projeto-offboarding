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

router.post('/users',   criarUsuario);
router.get('/users',  listarUsuarios);
router.get('/users/:id' ,buscarUsuario);
router.put('/users/:id',  atualizarUsuario);
router.get("/email/:email", buscarUsuarioPorEmail);

export default router;

