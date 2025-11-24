import {
  sequelize,
  Entrevista,
  Resposta,
  Usuario,
  Pergunta, 
} from "../models/Relations.js";

// NOVO: Importa o serviço de análise de sentimentos
import analyzeBatch from '../services/analise_sentimento/analyze.js'; 

// GET /entrevistas
export const listarEntrevistas = async (req, res) => {
    try {
        const entrevistas = await Entrevista.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ["nome_completo", "cargo", "departamento"], 
                },
                {
                    model: Resposta,
                    attributes: ["id_pergunta", "resposta_texto", "resposta_valor", "score", "label", "theme", "riskLevel"],
                },
            ],
            order: [["data_entrevista", "DESC"]],
        });
        return res.status(200).json(entrevistas);
    } catch (error) {
        return res
            .status(500)
            .json({ error: "Erro ao listar entrevistas.", details: error.message });
    }
  };

// GET /entrevistas/:id
export const buscarEntrevista = async (req, res) => {
    try {
        const entrevista = await Entrevista.findByPk(req.params.id, {
            include: [
                { model: Usuario, attributes: ['nome_completo', 'cargo'] },
                {
                    model: Resposta,
                    attributes: ["id_pergunta", "resposta_texto", "resposta_valor", "score", "label", "theme", "riskLevel"],
                    include: [{
                        model: Pergunta, 
                        attributes: ['texto_pergunta', 'categoria']
                    }]
                }
            ]
        });

        if (!entrevista) {
            return res.status(404).json({ error: 'Entrevista não encontrada.' });
        }
        return res.status(200).json(entrevista);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar entrevista.', details: error.message });
    }
};

// POST /entrevistas (CRIAR COM RESPOSTAS)
export const criarEntrevistaComRespostas = async (req, res) => {

    const { id_usuario, data_entrevista, status_entrevista, respostas } = req.body;


    const t = await sequelize.transaction();
    try {
    
        // 1. Cria a Entrevista
        const novaEntrevista = await Entrevista.create({
            id_usuario,
            data_entrevista,
            status_entrevista
        }, { transaction: t });

        const id_entrevista_criada = novaEntrevista.id_entrevista;

        // 2. COLETA DADOS PARA A ANÁLISE LLM (SIMPLIFICADO E AGNOSTICO)
        // Removemos a busca e o mapeamento da 'categoria' da pergunta
        const respostasParaAnalise = respostas.map(r => {
            return {
                questionId: r.id_pergunta,
                answerText: r.resposta_texto,
            };
        });

        // 3. CHAMA O SERVIÇO LLM (GEMINI) - Roda a análise de sentimentos
        // O LLM agora retorna 'allThemes' (Array) em vez de 'theme' (String)
        const resultadosAnalise = await analyzeBatch(respostasParaAnalise, { language: 'pt' });


        // 4. Prepara o array final de Respostas para o bulkCreate (combinando dados)
        const respostasParaCriar = resultadosAnalise.map(analise => {
            const respostaOriginal = respostas.find(r => r.id_pergunta === analise.questionId);

            return {
                id_entrevista: id_entrevista_criada, 
                id_pergunta: analise.questionId,
                resposta_texto: respostaOriginal.resposta_texto,
                resposta_valor: respostaOriginal.resposta_valor || analise.label,
                
                // NOVOS CAMPOS DO LLM:
                score: analise.score,
                magnitude: analise.magnitude,
                label: analise.label,
                
                // CORREÇÃO CRÍTICA: Pega o PRIMEIRO tema de 'allThemes' para caber no DB (String)
                theme: (analise.allThemes && analise.allThemes.length > 0) 
                    ? analise.allThemes[0] 
                    : 'Não Classificado',
                    
                riskLevel: analise.riskLevel,
                analysisSource: analise.source,
                // O array 'allThemes' (com todos os temas) está em 'resultadosAnalise', 
                // mas não pode ser salvo na coluna 'theme' do DB.
            };
        });


        await Resposta.bulkCreate(respostasParaCriar, { transaction: t });

        await t.commit();

        return res.status(201).json({
            message: 'Entrevista e análise de sentimentos criadas com sucesso!',
            entrevista: novaEntrevista,
            // Retornamos 'resultadosAnalise' para que o Frontend veja o array 'allThemes'
            insights: resultadosAnalise 
        });

    } catch (error) {
        await t.rollback(); 
        
        return res.status(500).json({ 
            error: 'Falha ao criar entrevista e rodar análise de IA. Operação desfeita.', 
            details: error.message 
        });
    }
};

// DELETE /entrevistas/:id
export const excluirEntrevista = async (req, res) => {
    const entrevistaId = req.params.id;

    const t = await sequelize.transaction();

    try {
        const entrevista = await Entrevista.findByPk(entrevistaId, { transaction: t });

        if (!entrevista) {
            await t.rollback();
            return res.status(404).json({ error: 'Entrevista não encontrada.' });
        }

        await Entrevista.destroy({
            where: { id_entrevista: entrevistaId },
            transaction: t
        });

        await t.commit();

        return res.status(204).json(); 
        
    } catch (error) {
  
        await t.rollback(); 
        
        return res.status(500).json({ 
            error: 'Erro ao excluir entrevista. Operação desfeita.', 
            details: error.message 
        });
    }
};