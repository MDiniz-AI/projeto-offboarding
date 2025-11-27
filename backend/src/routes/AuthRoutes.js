import express from "express";
import jwt from "jsonwebtoken";
import { verifyTempToken } from "../middlewares/auth.js";
import { gerarLinkTemporario } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/gerar-link", gerarLinkTemporario);

router.get("/validar", verifyTempToken, (req, res) => {
  return res.json({ valido: true, dados: req.user });
});

export default router;