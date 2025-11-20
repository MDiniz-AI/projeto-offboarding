import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET 

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ error: "Token não fornecido." });

    const [, token] = authHeader.split(" ");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id; 
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido." });
    }
};
