import express from "express";
import {
  criarPergunta,
  listarPerguntas,
  buscarPergunta,
  atualizarPergunta,
  deletarPergunta,
} from "../controllers/PerguntaController.js";

const router = express.Router();

// ---- Rotas Padrão REST ----

// GET /api/perguntas
router.get("/", listarPerguntas); 

// POST /api/perguntas
router.post("/", criarPergunta);

// GET /api/perguntas/:id
router.get("/:id", buscarPergunta);

// PUT /api/perguntas/:id
router.put("/:id", atualizarPergunta);

// DELETE /api/perguntas/:id
router.delete("/:id", deletarPergunta);

export default router;