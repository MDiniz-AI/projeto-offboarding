import express from "express";
import jwt from "jsonwebtoken";
import { verifyTempToken } from "../middlewares/auth.js";
import { gerarLinkTemporario } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/gerar-link", gerarLinkTemporario);

export default router;