import { Usuario, Entrevista } from '../models/Relations.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // ADICIONADO: Para gerar o token aqui mesmo
import { sequelize } from '../config/db.js'; 

const saltRounds = 10;

export const criarUsuario = async (req, res) => {
    const { nome_completo, email , departamento , cargo, data_entrada , data_saida , motivo_saida , password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds); // senha criptografada

        const novoUsuario = await Usuario.create({
            nome_completo,
            email,
            departamento,
            cargo,
            data_entrada,
            motivo_saida,
            data_saida,
            password: hashedPassword // Usando a senha hash
        });

        const usuarioFormatado = novoUsuario.toJSON();
        delete usuarioFormatado.password; 
        
        return res.status(201).json(usuarioFormatado);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }
        return res.status(500).json({ error: 'Erro ao criar usuário.', details: error.message });
    }
};

// GET /users
export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] } 
        });
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar usuários.', details: error.message });
    }
};

// GET /users/:id
export const buscarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            attributes: { exclude: ['password'] } 
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuário.', details: error.message });
    }
};


export const buscarUsuarioPorEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email não informado." });
    }

    const usuario = await Usuario.findOne({
      where: { email },
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json(usuario);

  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar usuário por email.",
      details: error.message
    });
  }
};


// GET /users/:id/entrevistas  entrevista de um usuario
export const buscarEntrevistasDoUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            include: [{
                model: Entrevista,
                order: [['data_entrevista', 'DESC']]
            }],
            attributes: ['id_usuario', 'nome_completo'] // Ajustado para id_usuario (confirme se seu model usa id_usuario ou usuario_id)
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        return res.status(200).json(usuario); 
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar entrevistas do usuário.', details: error.message });
    }
};


export const atualizarUsuario = async (req, res) => {
    const userId = req.params.id;
    let dados = req.body;
    
    try {
        // Se a senha estiver sendo atualizada, ela deve ser criptografada primeiro
        if (dados.password) {
            dados.password = await bcrypt.hash(dados.password, saltRounds);
        }

        const [updatedRows] = await Usuario.update(dados, {
            where: { id_usuario: userId } // Confirmar chave primária (id_usuario ou usuario_id)
        });

        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado ou nenhum dado para atualizar.' });
        }

        const usuarioAtualizado = await Usuario.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        
        return res.status(200).json(usuarioAtualizado);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao atualizar usuário.', details: error.message });
    }
};

// DELETE /users/:id
export const deletarUsuario = async (req, res) => {
    try {
        const deletedRows = await Usuario.destroy({
            where: { id_usuario: req.params.id } // Confirmar chave primária
        });

        if (deletedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        return res.status(204).send(); 
    } catch (error) {
        // Se houver entrevistas ligadas a este usuário (Chave Estrangeira), ele n vai ser excluido e vai dar erro
        return res.status(500).json({ 
            error: 'Erro ao deletar usuário. Verifique se há entrevistas associadas.', 
            details: error.message 
        });
    }
};

// NOVO: Geração de link segura e independente
export const gerarLinkPorId = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Buscar usuário pelo ID
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        // 2. Gerar token JWT (Link expira em 48h)
        // Importante: Usamos process.env.JWT_SECRET que já configuramos
        const token = jwt.sign(
            { 
                email: usuario.email, 
                id: usuario.id_usuario 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '48h' }
        );

        // 3. Montar o link temporário
        // Usa a variável de ambiente ou fallback para localhost
        const baseUrl = process.env.FRONT_URL || 'http://localhost:5173';
        const linkTemporario = `${baseUrl}/?t=${token}`;

        return res.status(200).json({
            usuario: usuario.nome_completo,
            email: usuario.email,
            link: linkTemporario
        });

    } catch (error) {
        return res.status(500).json({
            error: "Erro ao gerar link temporário.",
            details: error.message
        });
    }
};