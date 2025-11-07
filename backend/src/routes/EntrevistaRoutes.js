import express from 'express';

import { criarEntrevista } from '../controllers/EntrevistaController.js';

const router = express.Router();

router.post('/', criarEntrevista);

// Adicionar as outras rotas aqui

export default router;