import express from "express";
import {
 criarEntrevistaComRespostas,
  listarEntrevistas,
   buscarEntrevista,
   excluirEntrevista
} from "../controllers/EntrevistaController.js";

const router = express.Router();

// CORREÇÃO: As rotas agora são a raiz ('/') ou o parâmetro (':id')
// POST /api/entrevistas
router.post('/', criarEntrevistaComRespostas); 

// GET /api/entrevistas
router.get('/', listarEntrevistas); 

// GET /api/entrevistas/:id
router.get('/:id',  buscarEntrevista); 

// DELETE /api/entrevistas/:id
router.delete('/:id', excluirEntrevista); 

export default router;