import jwt from "jsonwebtoken";

// ========================================================
// 1. VERIFY TOKEN (PARA API - HEADERS)
// Usada em: rotas protegidas do sistema (Dashboard, etc)
// ========================================================
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido. Acesso negado." });
    }

    // O token vem no formato "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Formato de Token inválido (Esperado: Bearer <token>)." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido ou expirado." });
    }
};

// ========================================================
// 2. VERIFY TEMP TOKEN (PARA LINKS - URL PARAMS)
// Usada em: validação de links temporários (se necessário)
// ========================================================
export const verifyTempToken = (req, res, next) => {
    const token = req.params.token;

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido na URL." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token de link inválido ou expirado." });
    }
};