import express from 'express';
import {
  salvarRespostas,     // A nova função de criar
  listarRespostas,    // As que você já tinha
  buscarResposta,
  atualizarResposta,
  deletarResposta
} from '../controllers/RespostaController.js';

const router = express.Router();

// ---- Padrão REST para Respostas ----

// POST /api/respostas  (Criar a entrevista e as respostas)
router.post('/', salvarRespostas);

// GET /api/respostas   (Listar todas)
router.get('/', listarRespostas);

// GET /api/respostas/:id  (Buscar uma específica)
router.get('/:id', buscarResposta);

// PUT /api/respostas/:id  (Atualizar)
router.put('/:id', atualizarResposta);

// DELETE /api/respostas/:id (Deletar)
router.delete('/:id', deletarResposta);

export default router;