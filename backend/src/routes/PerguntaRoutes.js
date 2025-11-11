import express from "express";
import {
  criarPergunta,
  listarPerguntas,
  buscarPergunta,
  atualizarPergunta,
  deletarPergunta,
} from "../controllers/PerguntaController.js";

const router = express.Router();

router.post("/pergunta", criarPergunta);
router.get("/perguntas", listarPerguntas);
router.get("/perguntas/:id", buscarPergunta);
router.put("/pergunta/:id", atualizarPergunta);
router.delete("/perguntas/:id", deletarPergunta);

export default router;
