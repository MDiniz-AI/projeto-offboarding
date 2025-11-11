import express from "express";
import {
  listarRespostas,
  buscarResposta,
  atualizarResposta,
  deletarResposta,
} from "../controllers/RespostaController.js";

const router = express.Router();

router.get("/respostas", listarRespostas);
router.get("/resposta/:id", buscarResposta);
router.put("/resposta/:id", atualizarResposta);
router.delete("/respostas/:id", deletarResposta);

export default router;
