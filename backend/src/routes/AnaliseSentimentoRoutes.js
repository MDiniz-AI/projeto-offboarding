import express from "express";
import {
  realizarAnalise, // CORREÇÃO: Usamos o nome da função que criamos para o POST
  listarAnalises,
  buscarAnalise,
  deletarAnalise,
  getDashboardInsights
} from "../controllers/AnaliseSentimentoController.js";

const router = express.Router();

// 1. POST: Rota de Análise do Formulário (Deve ser a raiz '/')
router.post("/", realizarAnalise); 

// 2. GET /api/analise/insights
router.get("/insights", getDashboardInsights);

// 3. GET /api/analise
router.get("/", listarAnalises); // GET /api/analise -> Lista todas
router.get("/:id", buscarAnalise); // GET /api/analise/:id
router.delete("/:id", deletarAnalise); // DELETE /api/analise/:id

export default router;