import express from "express";
import { verifyTempToken } from "../middlewares/auth.js";
import {
 criarEntrevistaComRespostas,
  listarEntrevistas,
   buscarEntrevista,
   excluirEntrevista
} from "../controllers/EntrevistaController.js";

const router = express.Router();

router.post("/", verifyTempToken, criarEntrevistaComRespostas);
router.get("/entrevistas", verifyTempToken, listarEntrevistas);
router.get("/entrevista/:id", verifyTempToken,  buscarEntrevista);
router.delete('/entrevistas/:id', verifyTempToken, excluirEntrevista);

export default router;

