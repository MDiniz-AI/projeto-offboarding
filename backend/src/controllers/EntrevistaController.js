import {
  sequelize,
  Entrevista,
  Resposta,
  Usuario,
  Pergunta, 
} from "../models/Relations.js";

import analyzeBatch from '../services/analise_sentimento/analyze.js'; 

// GET /entrevistas
export const listarEntrevistas = async (req, res) => {
    try {
        const entrevistas = await Entrevista.findAll({
            include: [
                { model: Usuario, attributes: ["nome_completo", "cargo", "departamento"] },
                { 
                    model: Resposta, 
                    attributes: ["id_pergunta", "resposta_texto", "resposta_valor", "score", "label", "theme", "riskLevel"] 
                },
            ],
            order: [["data_entrevista", "DESC"]],
        });
        return res.status(200).json(entrevistas);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao listar entrevistas.", details: error.message });
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
                    include: [{ model: Pergunta, attributes: ['texto_pergunta', 'categoria'] }]
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

// POST /entrevistas (CRIAR COM RESPOSTAS + IA + JWT)
export const criarEntrevistaComRespostas = async (req, res) => {
    console.log("🚀 Iniciando criação de entrevista...");

    const { 
        respostas, 
        data_entrevista = new Date(), 
        status_entrevista = 'Finalizada' 
    } = req.body;

    // Validação de Token (Fallback para ID 1 se não tiver token no ambiente de dev)
    let userEmail = null;
    if (req.user && req.user.email) {
        userEmail = req.user.email;
    } else {
        // Fallback para dev: usa usuário ID 1 se não vier autenticado
        console.warn("⚠️ Token não encontrado. Tentando usuário de fallback ID 1.");
        const userTeste = await Usuario.findByPk(1);
        if (userTeste) userEmail = userTeste.email;
        else return res.status(401).json({ error: 'Token inválido e usuário de teste não encontrado.' });
    }

    const t = await sequelize.transaction();
    
    try {
        const usuario = await Usuario.findOne({ where: { email: userEmail } });
        if (!usuario) {
            await t.rollback();
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const novaEntrevista = await Entrevista.create({
            id_usuario: usuario.usuario_id, 
            data_entrevista,
            status_entrevista
        }, { transaction: t });
        
        const id_entrevista_criada = novaEntrevista.id_entrevista;

        // Prepara dados para IA
        const respostasParaAnalise = respostas
            .filter(r => r.resposta_texto && typeof r.resposta_texto === 'string' && r.resposta_texto.trim().length > 2)
            .map(r => ({
                questionId: r.id_pergunta,
                answerText: r.resposta_texto
            }));

        let resultadosAnalise = [];
        if (respostasParaAnalise.length > 0) {
             resultadosAnalise = await analyzeBatch(respostasParaAnalise, { language: "pt" });
        }

        const respostasParaCriar = respostas.map(original => {
            const analise = resultadosAnalise.find(a => a.questionId === original.id_pergunta) || {};
            
            // 1. Sanitização do texto (Evita erro 1364 - Field doesn't have default value)
            let textoFinal = original.resposta_texto;
            if (!textoFinal || typeof textoFinal !== 'string' || textoFinal.trim() === "") {
                textoFinal = " "; 
            }

            // 2. Sanitização da Fonte de Análise (Evita erro 1406 - Data too long)
            // Usamos 'manual' (6 chars) em vez de 'estruturado' (11 chars) para garantir.
            let analysisSource = analise.source || 'manual'; 
            if (analysisSource.length > 20) analysisSource = analysisSource.substring(0, 20);

            // 3. Sanitização do Tema (Evita Data too long)
            let theme = (analise.allThemes && analise.allThemes.length > 0) ? analise.allThemes[0] : 'Geral';
            if (theme && theme.length > 99) theme = theme.substring(0, 99);

            return {
                id_entrevista: id_entrevista_criada,
                id_pergunta: original.id_pergunta,
                resposta_texto: textoFinal,
                resposta_valor: String(original.resposta_valor || ""),
                score: analise.score !== undefined ? analise.score : 0,
                magnitude: analise.magnitude || 0,
                label: analise.label || 'neutral',
                theme: theme,
                riskLevel: analise.riskLevel || 'Low',
                analysisSource: analysisSource
            };
        });

        await Resposta.bulkCreate(respostasParaCriar, { transaction: t });
        
        await t.commit();
        return res.status(201).json({
            message: "Entrevista salva com sucesso!",
            id: id_entrevista_criada
        });

    } catch (error) {
        await t.rollback();
        console.error("🔥 Erro no processamento:", error);
        return res.status(500).json({ error: "Falha ao salvar.", details: error.message });
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
            error: 'Erro ao excluir entrevista.', 
            details: error.message 
        });
    }
};