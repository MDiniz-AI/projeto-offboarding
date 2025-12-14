import {
  Resposta,
  Pergunta,
  Entrevista,
  Usuario,
} from "../models/Relations.js";
import analyzeBatch from "../services/analise_sentimento/analyze.js";
import { gerarResumoExecutivo } from "../services/analise_sentimento/googleClient.js";
import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
import ResumoDepartamento from "../models/ResumoDepartamento.js";

/* =========================
   NORMALIZAÇÃO DE TEMAS
========================= */
const normalizeTheme = (themeRaw) => {
  if (!themeRaw) return "geral";

  const theme = themeRaw.toLowerCase().trim();

  const mapa = {
    carreira: [
      "carreira",
      "career development",
      "plano de carreira",
      "crescimento profissional",
      "desenvolvimento de carreira",
    ],
    cultura: [
      "cultura organizacional",
      "cultura",
      "ambiente",
      "ambiente de trabalho",
    ],
    valores: ["valores da empresa", "valores", "ética", "missão e valores"],
    workload: [
      "gestão de workload",
      "workload",
      "carga de trabalho",
      "sobrecarga",
    ],
  };

  for (const [normalizado, sinonimos] of Object.entries(mapa)) {
    if (sinonimos.includes(theme)) {
      return normalizado;
    }
  }

  return theme;
};

/* =========================
   POST /api/analise
========================= */
export const realizarAnalise = async (req, res) => {
  try {
    const { respostas, language } = req.body;

    if (!Array.isArray(respostas) || respostas.length === 0) {
      return res.status(400).json({ msg: "Nenhuma resposta enviada." });
    }

    const resultadosIA = await analyzeBatch(respostas, { language });

    const registros = await Promise.all(
      resultadosIA.map((r) =>
        Resposta.create({
          id_pergunta: r.questionId,
          id_entrevista: r.id_entrevista,
          resposta_texto: r.answerText || "",
          score: r.score,
          magnitude: r.magnitude,
          label: r.label,
          theme: r.theme,
          risk_level: r.riskLevel,
          risk_details: r.riskDetails,
          summary: r.summary,
          analysis_source: r.source,
        })
      )
    );

    return res.status(201).json(registros);
  } catch (error) {
    console.error("ERRO REALIZAR ANALISE:", error);
    return res.status(500).json({ msg: "Erro ao realizar análise." });
  }
};

/* =========================
   GET /api/analise
========================= */
export const listarAnalises = async (req, res) => {
  try {
    const analises = await Resposta.findAll({
      include: [{ model: Pergunta }],
      order: [["createdAt", "DESC"]],
    });

    return res.json(analises);
  } catch (error) {
    console.error("ERRO LISTAR ANALISES:", error);
    return res.status(500).json({ msg: "Erro ao listar análises." });
  }
};

/* =========================
   GET /api/analise/:id
========================= */
export const buscarAnalise = async (req, res) => {
  try {
    const { id } = req.params;

    const analise = await Resposta.findByPk(id, {
      include: [{ model: Pergunta }],
    });

    if (!analise) {
      return res.status(404).json({ msg: "Análise não encontrada." });
    }

    return res.json(analise);
  } catch (error) {
    console.error("ERRO BUSCAR ANALISE:", error);
    return res.status(500).json({ msg: "Erro ao buscar análise." });
  }
};

/* =========================
   DELETE /api/analise/:id
========================= */
export const deletarAnalise = async (req, res) => {
  try {
    const { id } = req.params;

    const analise = await Resposta.findByPk(id);

    if (!analise) {
      return res.status(404).json({ msg: "Análise não encontrada." });
    }

    await analise.destroy();

    return res.json({ msg: "Análise deletada com sucesso." });
  } catch (error) {
    console.error("ERRO DELETAR ANALISE:", error);
    return res.status(500).json({ msg: "Erro ao deletar análise." });
  }
};

/* =========================
   GET /api/analise/insights
========================= */
export const getDashboardInsights = async (req, res) => {
  try {
    const resultados = await Resposta.findAll({
      where: { resposta_texto: { [Op.ne]: "" } },
    });

    if (!resultados.length) {
      return res.json({
        totalEntrevistas: 0,
        scoreGeral: 0,
        negativeCountTotal: 0,
        highRiskCountTotal: 0,
        insights: [],
        departamentos: [],
        aiSummary: "",
      });
    }

    /* ---- TOTAL DE ENTREVISTAS ÚNICAS ---- */
    const entrevistasUnicas = new Set(
      resultados.map((r) => r.id_entrevista).filter(Boolean)
    );

    /* ---- AGRUPAMENTO POR TEMA ---- */
    const themesMap = {};

    resultados.forEach((r) => {
      const theme = normalizeTheme(r.theme);

      if (!themesMap[theme]) {
        themesMap[theme] = {
          theme,
          scoreSum: 0,
          responseCount: 0,
          negativeCount: 0,
          highRiskCount: 0,
        };
      }

      themesMap[theme].scoreSum += r.score || 0;
      themesMap[theme].responseCount += 1;

      if (r.label === "negative") themesMap[theme].negativeCount += 1;
      if (r.risk_level === "High") themesMap[theme].highRiskCount += 1;
    });

    const insights = Object.values(themesMap).map((t) => ({
      theme: t.theme,
      averageScore: Number((t.scoreSum / t.responseCount).toFixed(2)),
      responseCount: t.responseCount,
      negativeCount: t.negativeCount,
      highRiskCount: t.highRiskCount,
    }));

    /* ---- SCORE GERAL ---- */
    const scoreGeral =
      resultados.reduce((sum, r) => sum + (r.score || 0), 0) /
      resultados.length;

    /* ---- RESUMO EXECUTIVO (IA) ---- */
    let aiSummary = "";

    try {
      const textos = resultados
        .map((r) => r.resposta_texto)
        .filter((t) => t && t.length > 20)
        .slice(0, 20);

      if (textos.length) {
        aiSummary = await gerarResumoExecutivo(
          textos,
          "Clima organizacional e desligamentos"
        );
      }
    } catch (err) {
      console.error("ERRO RESUMO IA:", err);
      aiSummary = "Não foi possível gerar o resumo executivo no momento.";
    }

    /* ---- ENTREVISTAS POR DEPARTAMENTO ---- */
    const departamentos = await Usuario.findAll({
      attributes: [
        "departamento",
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("entrevistas.id_entrevista"))
          ),
          "totalEntrevistas",
        ],
        [
          sequelize.fn("AVG", sequelize.col("entrevistas.resposta.score")),
          "averageScore",
        ],
      ],
      include: [
        {
          model: Entrevista,
          as: "entrevistas",
          attributes: [],
          include: [
            {
              model: Resposta,
              attributes: [],
            },
          ],
        },
      ],
      group: ["usuario.departamento"],
      raw: true,
    });

    return res.json({
      totalEntrevistas: entrevistasUnicas.size,
      scoreGeral: Number(scoreGeral.toFixed(2)),
      negativeCountTotal: insights.reduce((s, i) => s + i.negativeCount, 0),
      highRiskCountTotal: insights.reduce((s, i) => s + i.highRiskCount, 0),
      insights,
      departamentos,
      aiSummary,
    });
  } catch (error) {
    console.error("ERRO INSIGHTS:", error);
    return res.status(500).json({ msg: "Erro ao gerar insights." });
  }
};
