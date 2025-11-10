import { Usuario, Entrevista, Pergunta } from '../models/Relations.js'; 

// GET /respostas
export const listarRespostas = async (req, res) => {
    try {
        const respostas = await Resposta.findAll({
            
            include: [
                { model: Pergunta, attributes: ['texto_pergunta', 'categoria'] },
                { model: Entrevista, attributes: ['id_usuario', 'data_entrevista'] }
            ],
            order: [['id_resposta', 'DESC']]
        });
        return res.status(200).json(respostas);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar respostas.', details: error.message });
    }
};


export const buscarResposta = async (req, res) => {
    try {
        const resposta = await Resposta.findByPk(req.params.id, {
            include: [
                { model: Pergunta, attributes: ['texto_pergunta', 'categoria'] },
                { model: Entrevista, attributes: ['id_usuario', 'data_entrevista'] }
            ]
        });

        if (!resposta) {
            return res.status(404).json({ error: 'Resposta não encontrada.' });
        }
        return res.status(200).json(resposta);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar resposta.', details: error.message });
    }
};


export const atualizarResposta = async (req, res) => {
    const respostaId = req.params.id;
    const { resposta_texto, resposta_valor } = req.body;

    try {
        const [updatedRows] = await Resposta.update(
            { resposta_texto, resposta_valor },
            { where: { id_resposta: respostaId } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Resposta não encontrada ou nenhum dado para atualizar.' });
        }

        const respostaAtualizada = await Resposta.findByPk(respostaId);
        
        return res.status(200).json(respostaAtualizada);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao atualizar resposta.', details: error.message });
    }
};

// DELETE /respostas/:id
export const deletarResposta = async (req, res) => {
    try {
        const deletedRows = await Resposta.destroy({
            where: { id_resposta: req.params.id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ error: 'Resposta não encontrada.' });
        }

        return res.status(204).send(); 
    } catch (error) {
        // Se houver uma análise de sentimento ligada a esta resposta, 
        // o banco de dados pode impedir a exclusão.
        return res.status(500).json({ 
            error: 'Erro ao deletar resposta. Verifique se existem análises de sentimento associadas que precisam ser excluídas primeiro.', 
            details: error.message 
        });
    }
};