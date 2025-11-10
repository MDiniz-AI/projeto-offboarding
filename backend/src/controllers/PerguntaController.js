import { Usuario, Entrevista, Pergunta } from '../models/Relations.js'; 

// POST /perguntas
export const criarPergunta = async (req, res) => {
    const { texto_pergunta, categoria, tipo_resposta } = req.body;

    try {
        const novaPergunta = await Pergunta.create({
            texto_pergunta,
            categoria,
            tipo_resposta
        });
        
        return res.status(201).json(novaPergunta);

    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar pergunta.', details: error.message });
    }
};


export const listarPerguntas = async (req, res) => {
    // Permite filtrar por categoria (ex: /perguntas?categoria=Comportamental)
    const { categoria } = req.query; 
    
    const where = categoria ? { categoria } : {};

    try {
        const perguntas = await Pergunta.findAll({
            where: where,
            order: [['categoria', 'ASC'], ['id_pergunta', 'ASC']] 
        });
        return res.status(200).json(perguntas);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar perguntas.', details: error.message });
    }
};

// GET /perguntas/:id
export const buscarPergunta = async (req, res) => {
    try {
        const pergunta = await Pergunta.findByPk(req.params.id);

        if (!pergunta) {
            return res.status(404).json({ error: 'Pergunta não encontrada.' });
        }
        return res.status(200).json(pergunta);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar pergunta.', details: error.message });
    }
};


export const atualizarPergunta = async (req, res) => {
    const perguntaId = req.params.id;
    const { texto_pergunta, categoria, tipo_resposta } = req.body;

    try {
        const [updatedRows] = await Pergunta.update(
            { texto_pergunta, categoria, tipo_resposta },
            { where: { id_pergunta: perguntaId } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Pergunta não encontrada ou nenhum dado para atualizar.' });
        }

        const perguntaAtualizada = await Pergunta.findByPk(perguntaId);
        
        return res.status(200).json(perguntaAtualizada);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao atualizar pergunta.', details: error.message });
    }
};

// DELETE /perguntas/:id
export const deletarPergunta = async (req, res) => {
    try {
        const deletedRows = await Pergunta.destroy({
            where: { id_pergunta: req.params.id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ error: 'Pergunta não encontrada.' });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ 
            error: 'Erro ao deletar pergunta. A pergunta já foi respondida em entrevistas e não pode ser excluída.', 
            details: error.message 
        });
    }
};