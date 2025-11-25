// ATENÇÃO: Adicionei os imports de modelos necessários para o CRUD (GET/DELETE)
import { Resposta, Pergunta, sequelize } from "../models/Relations.js";
import analyzeBatch from "../services/analise_sentimento/analyze.js";

// ---- 1. POST /api/analise (REALIZAR ANÁLISE) ----
export const realizarAnalise = async (req, res) => {
  try {
    // [Lógica omitida por brevidade, mas está correta]
    const { respostas, idioma } = req.body;
    if (!respostas || !Array.isArray(respostas)) {
      return res
        .status(400)
        .json({ msg: "Formato inválido. Envie um array de respostas." });
    } // Chama o serviço de análise de sentimentos (Gemini)

    const resultado = await analyzeBatch(respostas, {
      language: idioma || "pt",
    });
    return res.json(resultado);
  } catch (error) {
    console.error("ERRO CRÍTICO NA ANÁLISE DE SENTIMENTOS:", error);
    return res.status(500).json({
      msg: "Erro ao processar análise de sentimentos. Verifique o console do backend.",
    });
  }
};

// ---- 2. GET /api/analise (LISTAR TODAS AS ANÁLISES) ----
// ---- 2. GET /api/analise (LISTAR TODAS AS ANÁLISES) ----
export const listarAnalises = async (req, res) => {
  try {
    const analises = await Resposta.findAll({
      attributes: [
        "id_resposta",
        "resposta_texto",
        "score",
        "magnitude",
        "label",
        "theme",
        "riskLevel",
        "analysisSource",
      ],
      include: [
        { model: Pergunta, attributes: ["texto_pergunta", "categoria"] },
      ],
      order: [["id_resposta", "DESC"]],
    });
    return res.status(200).json(analises);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao listar análises.", details: error.message });
  }
};

// ---- 3. GET /api/analise/insights (AGREGAÇÃO PARA DASHBOARD) ----
// FUNÇÃO ADICIONADA: Fornece dados agrupados para o Power BI / Agente de IA
export const getDashboardInsights = async (req, res) => {
  try {
    const insights = await Resposta.findAll({
      attributes: [
        "theme",
        // Calcula o score médio
        [sequelize.fn("AVG", sequelize.col("score")), "averageScore"],
        // Conta o volume de respostas por tema
        [sequelize.fn("COUNT", sequelize.col("theme")), "responseCount"],
        // Conta o volume de risco negativo
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN label = 'negative' THEN 1 ELSE 0 END")
          ),
          "negativeCount",
        ],
      ],
      group: ["theme"],
      order: [["averageScore", "ASC"]],
    });

    if (insights.length === 0) {
      return res.status(200).json([]); // Retorna array vazio, não 404
    }

    return res.status(200).json(insights);
  } catch (error) {
    // CORREÇÃO: Imprime o erro SQL completo para diagnóstico
    console.error("ERRO INTERNO NA QUERY DE DASHBOARD:", error);
    return res.status(500).json({
      msg: "Erro ao gerar dados agregados. Verifique o console para erro de SQL/Sequelize.",
    });
  }
};

// ---- 4. GET /api/analise/:id (BUSCAR UMA ANÁLISE) ----
export const buscarAnalise = async (req, res) => {
  try {
    // [Lógica omitida por brevidade, mas está correta]
    const analiseId = req.params.id;
    const analise = await Resposta.findByPk(analiseId, {
      attributes: [
        "id_resposta",
        "resposta_texto",
        "score",
        "magnitude",
        "label",
        "theme",
        "riskLevel",
        "analysisSource",
      ],
      include: [
        { model: Pergunta, attributes: ["texto_pergunta", "categoria"] },
      ],
    });
    if (!analise) {
      return res.status(404).json({ error: "Análise não encontrada." });
    }
    return res.status(200).json(analise);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao buscar análise.", details: error.message });
  }
};

// ---- 5. DELETE /api/analise/:id (DELETAR ANÁLISE) ----
export const deletarAnalise = async (req, res) => {
  try {
    // [Lógica omitida por brevidade, mas está correta]
    const deletedRows = await Resposta.destroy({
      where: { id_resposta: req.params.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ error: "Análise não encontrada." });
    }
    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao deletar análise.", details: error.message });
  }
};
