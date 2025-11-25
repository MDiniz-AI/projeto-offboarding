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
router.get("/entrevistas", listarEntrevistas);
router.get("/entrevista/:id", verifyTempToken,  buscarEntrevista);
router.delete('/entrevistas/:id', verifyTempToken, excluirEntrevista);

// GET /api/entrevistas
router.get('/', listarEntrevistas); 

// GET /api/entrevistas/:id
router.get('/:id',  buscarEntrevista); 

// DELETE /api/entrevistas/:id
router.delete('/:id', excluirEntrevista); 

export default router;