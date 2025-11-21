import express from "express";
import jwt from "jsonwebtoken";
import { verifyTempToken } from "../middlewares/auth.js";
import { gerarLinkTemporario } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/gerar-link", gerarLinkTemporario);

router.get("/acessar/:token", verifyTempToken, (req, res) => {
  return res.json({
    mensagem: "Token válido! Acesso autorizado.",
    dadosDoToken: req.user,
  });
});

export default router;