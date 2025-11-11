import express from "express";
import {
  criarAnaliseSentimento,
  listarAnalises,
  buscarAnalise,
  deletarAnalise,
} from "../controllers/AnaliseSentimentoController.js";

const router = express.Router();

router.post("/analise", criarAnaliseSentimento);
router.get("/analises", listarAnalises);
router.get("/analise/:id", buscarAnalise);
router.delete("/analise/:id", deletarAnalise);

export default router;
