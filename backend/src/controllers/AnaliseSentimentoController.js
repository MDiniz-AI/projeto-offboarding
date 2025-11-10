import { AnaliseSentimento, Resposta } from '../models/index.js';


// Provavelmente não esta correto pq tem que chamar a API
export const criarAnaliseSentimento = async (req, res) => {
    
    const { id_resposta, sentimento_score, sentimento_magnitude, sentimento_classificacao } = req.body;
    const data_analise = new Date();

    try {
     
        const respostaExiste = await Resposta.findByPk(id_resposta);
        if (!respostaExiste) {
            return res.status(404).json({ error: 'ID de Resposta não encontrado.' });
        }

        const novaAnalise = await AnaliseSentimento.create({
            id_resposta,
            sentimento_score,
            sentimento_magnitude,
            sentimento_classificacao,
            data_analise
        });
        
        return res.status(201).json(novaAnalise);

    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar análise de sentimento.', details: error.message });
    }
};


export const listarAnalises = async (req, res) => {
    try {
        const analises = await AnaliseSentimento.findAll({
          
            include: [{
                model: Resposta,
                attributes: ['resposta_texto', 'resposta_valor'],
                include: [{
                    model: Pergunta, 
                    attributes: ['texto_pergunta', 'categoria']
                }]
            }],
            order: [['data_analise', 'DESC']]
        });
        return res.status(200).json(analises);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar análises.', details: error.message });
    }
};

export const buscarAnalise = async (req, res) => {
    try {
        const analise = await AnaliseSentimento.findByPk(req.params.id, {
            include: [{
                model: Resposta,
                attributes: ['resposta_texto'],
                include: [{ model: Pergunta, attributes: ['texto_pergunta', 'categoria'] }]
            }]
        });

        if (!analise) {
            return res.status(404).json({ error: 'Análise de sentimento não encontrada.' });
        }
        return res.status(200).json(analise);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar análise.', details: error.message });
    }
};

export const deletarAnalise = async (req, res) => {
    try {
        const deletedRows = await AnaliseSentimento.destroy({
            where: { id_analise: req.params.id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ error: 'Análise de sentimento não encontrada.' });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao deletar análise.', details: error.message });
    }
};