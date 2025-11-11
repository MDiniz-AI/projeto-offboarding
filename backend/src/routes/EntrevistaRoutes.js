import express from "express";
import {
 criarEntrevistaComRespostas,
  listarEntrevistas,
   buscarEntrevista,
   excluirEntrevista
} from "../controllers/EntrevistaController.js";

const router = express.Router();

router.post("/entrevistas", criarEntrevistaComRespostas);
router.get("/entrevistas", listarEntrevistas);
router.get("/entrevista/:id",  buscarEntrevista);
router.delete('/entrevistas/:id', excluirEntrevista);

export default router;

