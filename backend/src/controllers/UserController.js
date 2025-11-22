import { Usuario, Entrevista } from '../models/Relations.js'; 
import bcrypt from 'bcrypt';
import { sequelize } from '../config/db.js'; 
const saltRounds = 10;

export const criarUsuario = async (req, res) => {
    // tirei  motivo_saida, password,  cargo e departamento pq a unica pessoa logada vai ser o RH
    const { nome_completo, email , data_saida } = req.body;

    try {
        
       // const hashedPassword = await bcrypt.hash(password, saltRounds); // senha criptografada

        const novoUsuario = await Usuario.create({
            nome_completo,
            email,
            data_saida
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

// GET /users/:id/entrevistas  entrevista de um usuario
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


export const atualizarUsuario = async (req, res) => {
    const userId = req.params.id;
    let dados = req.body;
    
    try {
        // Se a senha estiver sendo atualizada, ela deve ser criptografada primeiro
        if (dados.password) {
            dados.password = await bcrypt.hash(dados.password, saltRounds);
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
        
        return res.status(200).json(usuarioAtualizado);
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
        // Se houver entrevistas ligadas a este usuário (Chave Estrangeira), ele n vai ser excluido e vai dar erro
        return res.status(500).json({ 
            error: 'Erro ao deletar usuário. Verifique se há entrevistas associadas.', 
            details: error.message 
        });
    }
};