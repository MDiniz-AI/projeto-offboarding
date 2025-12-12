import express from 'express';
import {
    criarUsuario,
    listarUsuarios,
    buscarUsuario,
    atualizarUsuario,
    deletarUsuario,
    buscarUsuarioPorEmail,
    buscarEntrevistasDoUsuario,
    gerarLinkPorId
} from '../controllers/UserController.js';

const router = express.Router();

// Rotas CRUD Básicas
router.post('/', criarUsuario);          // POST /api/usuarios
router.get('/', listarUsuarios);         // GET /api/usuarios

// Rotas Específicas (Devem vir antes de /:id para não confundir o Express)
router.get('/email/:email', buscarUsuarioPorEmail); // GET /api/usuarios/email/fulano@empresa.com

// Rotas por ID
router.get('/:id', buscarUsuario);       // GET /api/usuarios/1
router.put('/:id', atualizarUsuario);    // PUT /api/usuarios/1
router.delete('/:id', deletarUsuario);   // DELETE /api/usuarios/1

// Rotas de Funcionalidades Específicas
router.get('/:id/entrevistas', buscarEntrevistasDoUsuario); // GET /api/usuarios/1/entrevistas
router.get('/:id/gerar-link', gerarLinkPorId);              // GET /api/usuarios/1/gerar-link

export default router;