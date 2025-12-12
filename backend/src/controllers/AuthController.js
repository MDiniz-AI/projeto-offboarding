import { Usuario } from '../models/Relations.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validação básica
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        // 2. Buscar usuário no banco
        const usuario = await Usuario.findOne({ 
            where: { email }
        });

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciais inválidas (Usuário não encontrado).' });
        }

        // 3. Verificar a senha (comparar texto puro com hash do banco)
        // Se você inseriu a senha manualmente no banco sem hash, o bcrypt vai falhar.
        // Para testes rápidos com senha em texto puro (NÃO RECOMENDADO EM PROD), use:
        // const senhaValida = password === usuario.password; 
        
        // O correto (Produção):
        const senhaValida = await bcrypt.compare(password, usuario.password);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas (Senha incorreta).' });
        }

        // 4. Gerar o Token JWT de Admin
        const token = jwt.sign(
            { 
                id: usuario.usuario_id, 
                email: usuario.email,
                role: 'admin' // Adiciona role para diferenciar (opcional)
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // Token de admin dura 8 horas
        );

        // 5. Retornar sucesso
        return res.status(200).json({
            msg: 'Login realizado com sucesso.',
            token,
            user: {
                id: usuario.usuario_id,
                nome: usuario.nome_completo,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};

// Mantemos a função antiga renomeada se precisar de compatibilidade, 
// mas a lógica de geração de link idealmente fica no UserController.
export const gerarLinkTemporario = (req, res) => {
   const { email, nome } = req.body;
   const token = jwt.sign(
    { email, nome },
    process.env.JWT_SECRET,
    { expiresIn: "60m" }
   );
   const link = `${process.env.FRONT_URL}/?t=${token}`;
   return res.json({link});
};


