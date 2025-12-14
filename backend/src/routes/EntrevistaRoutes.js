import express from "express";
import { verifyTempToken, verifyFormToken } from "../middlewares/auth.js";
import {
 criarEntrevistaComRespostas,
  listarEntrevistas,
   buscarEntrevista,
   excluirEntrevista
} from "../controllers/EntrevistaController.js";

const router = express.Router();

router.post("/", verifyFormToken, criarEntrevistaComRespostas);
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