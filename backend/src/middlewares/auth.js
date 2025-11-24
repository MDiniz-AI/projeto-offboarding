import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyTempToken = (req, res, next) => {
   // const token = req.params.token;
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    console.log(token)

    if (!token && req.query.t ) {
        token = req.query.t;
    }

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

       
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
};
