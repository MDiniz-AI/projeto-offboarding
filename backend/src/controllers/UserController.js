import { Usuario, Entrevista } from '../models/Relations.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import { sequelize } from '../config/db.js'; 

const saltRounds = 10;

// POST /usuarios (CRIAR)
export const criarUsuario = async (req, res) => {
    // Adicionei 'admin' na desestruturação
    const { nome_completo, email, departamento, cargo, data_entrada, data_saida, motivo_saida, password, role, admin } = req.body;

    try {
        const senhaParaSalvar = password || Math.random().toString(36).slice(-8) + "Blip!";
        const hashedPassword = await bcrypt.hash(senhaParaSalvar, saltRounds);

        const motivoFinal = motivo_saida || "N/A - Aguardando Entrevista";
        
        // Lógica de Conversão: Se 'admin' for true OU 'role' for 'admin', salva como 'admin'
        let roleFinal = 'colaborador';
        if (admin === true || role === 'admin') {
            roleFinal = 'admin';
        }

        const novoUsuario = await Usuario.create({
            nome_completo,
            email,
            departamento,
            cargo,
            data_entrada,
            motivo_saida: motivoFinal,
            data_saida: data_saida || null,
            password: hashedPassword,
            role: roleFinal // Salva no formato que o banco espera
        });

        const usuarioFormatado = novoUsuario.toJSON();
        delete usuarioFormatado.password;
        // Devolve o campo admin para o frontend já atualizar a lista corretamente
        usuarioFormatado.admin = usuarioFormatado.role === 'admin';
        
        return res.status(201).json(usuarioFormatado);

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Este email já está cadastrado no sistema.' });
        }
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ error: 'Erro interno ao criar usuário.', details: error.message });
    }
};

// GET /users
export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] } 
        });

        // Mapeia para incluir o campo 'admin' (booleano) que o Frontend espera
        const usuariosFormatados = usuarios.map(usuario => {
            const u = usuario.toJSON();
            u.admin = u.role === 'admin';
            return u;
        });

        return res.status(200).json(usuariosFormatados);
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

        // Formata para incluir admin
        const usuarioFormatado = usuario.toJSON();
        usuarioFormatado.admin = usuarioFormatado.role === 'admin';

        return res.status(200).json(usuarioFormatado);
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

    // Formata para incluir admin
    const usuarioFormatado = usuario.toJSON();
    usuarioFormatado.admin = usuarioFormatado.role === 'admin';

    return res.status(200).json(usuarioFormatado);

  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar usuário por email.",
      details: error.message
    });
  }
};

// GET /users/:id/entrevistas
export const buscarEntrevistasDoUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            include: [{
                model: Entrevista,
                order: [['data_entrevista', 'DESC']]
            }],
            attributes: ['usuario_id', 'nome_completo'] 
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        return res.status(200).json(usuario); 
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar entrevistas do usuário.', details: error.message });
    }
};

// PUT /usuarios/:id (ATUALIZAR)
export const atualizarUsuario = async (req, res) => {
    const userId = req.params.id;
    let dados = req.body;
    
    try {
        // Se a senha foi enviada, criptografa antes de salvar
        if (dados.password) {
            dados.password = await bcrypt.hash(dados.password, saltRounds);
        }

        // Lógica de Conversão na Edição: admin (bool) -> role (string)
        if (dados.admin !== undefined) {
            dados.role = dados.admin ? 'admin' : 'colaborador';
        } else if (dados.role) {
            // Mantém suporte caso envie 'role' direto
            dados.role = dados.role === 'admin' ? 'admin' : 'colaborador';
        }

        const [updatedRows] = await Usuario.update(dados, {
            where: { usuario_id: userId } 
        });

        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado ou nenhum dado para atualizar.' });
        }

        const usuarioAtualizado = await Usuario.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        
        // Retorna com o campo admin formatado
        const usuarioFormatado = usuarioAtualizado.toJSON();
        usuarioFormatado.admin = usuarioFormatado.role === 'admin';

        return res.status(200).json(usuarioFormatado);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao atualizar usuário.', details: error.message });
    }
};

// DELETE /users/:id
export const deletarUsuario = async (req, res) => {
    try {
        const deletedRows = await Usuario.destroy({
            where: { usuario_id: req.params.id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        return res.status(204).send(); 
    } catch (error) {
        return res.status(500).json({ 
            error: 'Erro ao deletar usuário. Verifique se há entrevistas associadas.', 
            details: error.message 
        });
    }
};

// GET /users/:id/gerar-link
export const gerarLinkPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, lider } = req.query; 

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const token = jwt.sign(
            { 
                email: usuario.email, 
                id: usuario.usuario_id,
                contexto: {
                    tipo_saida: tipo || 'voluntaria',
                    is_lider: lider === 'true'
                }
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '48h' }
        );

        const baseUrl = process.env.FRONT_URL || 'http://localhost:5173';
        const linkTemporario = `${baseUrl}/?t=${token}`;

        return res.status(200).json({
            usuario: usuario.nome_completo,
            link: linkTemporario
        });

    } catch (error) {
        return res.status(500).json({
            error: "Erro ao gerar link temporário.",
            details: error.message
        });
    }
};