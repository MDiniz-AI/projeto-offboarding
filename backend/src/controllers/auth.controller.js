import { Usuario } from "../models/Relations.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ;

// POST /login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const validPassword = await bcrypt.compare(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({ error: "Senha incorreta." });
        }

        // cria token contendo ID do usuário
        const token = jwt.sign(
            { id: usuario.usuario_id },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        return res.status(200).json({ 
            message: "Login realizado com sucesso!",
            token 
        });

    } catch (error) {
        return res.status(500).json({ error: "Erro ao fazer login", details: error.message });
    }
};


export function me(req, res) {
  return res.json({ user: req.user });
}
