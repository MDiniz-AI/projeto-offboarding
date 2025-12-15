import {
  Resposta,
  Pergunta,
  Entrevista,
  Usuario,
} from "../models/Relations.js";
import analyzeBatch from "../services/analise_sentimento/analyze.js";

// IMPORTANTE: Apontando para o serviço da Groq (aiService.js)
import {
  gerarResumoExecutivoGeral,
  gerarResumoExecutivoDepartamento,
} from "../services/analise_sentimento/googleClient.js";

import { sequelize } from "../config/db.js";
import { Op } from "sequelize";

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

    // --- FILTRO DE APRESENTAÇÃO (HARDCODED) ---
    // Removemos temas gerais dos cards para focar nos insights específicos
    const insights = Object.values(themesMap)
      .filter((t) => {
        const temaLower = t.theme.toLowerCase();
        const ignorados = ["geral", "perguntas gerais", "enps", "satisfação geral", "considerações finais"];
        return !ignorados.includes(temaLower);
      })
      .map((t) => ({
        theme: t.theme,
        averageScore: Number((t.scoreSum / t.responseCount).toFixed(2)),
        responseCount: t.responseCount,
        negativeCount: t.negativeCount,
        highRiskCount: t.highRiskCount,
      }));

    /* ---- SCORE GERAL ---- */
    // Mantém TODAS as respostas (inclusive gerais) para a nota da empresa
    const scoreGeral =
      resultados.reduce((sum, r) => sum + (r.score || 0), 0) /
      resultados.length;

    /* ---- RESUMO EXECUTIVO (IA) ---- */
    let aiSummary = "";

    try {
      const textos = resultados
        .map((r) => r.resposta_texto)
        .filter((t) => t && t.length > 20)
        .slice(0, 50);

      if (textos.length) {
        aiSummary = await gerarResumoExecutivoGeral(
          textos,
          "Clima organizacional e desligamentos"
        );
      }
    } catch (err) {
      console.error("ERRO RESUMO IA:", err);
      aiSummary = "Não foi possível gerar o resumo executivo no momento.";
    }

    /* ---- ENTREVISTAS POR DEPARTAMENTO (MÉTRICAS) ---- */
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
          // Alias correto: entrevistas -> respostas
          sequelize.fn("AVG", sequelize.col("entrevistas.respostas.score")),
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
              as: "respostas", // Alias correto (Plural)
              attributes: [],
            },
          ],
        },
      ],
      group: ["usuario.departamento"],
      raw: true,
    });

    // RETORNA OS DADOS DO DASHBOARD
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

/* ========================================================
   GET /api/analise/resumo-executivo/:departamento
======================================================== */
export const getResumoDepartamento = async (req, res) => {
  try {
    const { departamento } = req.params;

    // 1. Busca no Banco de Dados
    const respostas = await Resposta.findAll({
      include: [
        {
          model: Entrevista,
          as: 'entrevista', // Alias correto
          required: true, 
          include: [
            {
              model: Usuario,
              as: 'usuario', // Alias correto
              required: true, 
              where: { departamento },
            },
          ],
        },
      ],
      attributes: ["resposta_texto"],
      raw: true, 
      nest: true,
    });

    // 2. Processamento e Limpeza dos Textos
    const textos = respostas
      .map((r) => r.resposta_texto)
      .filter((t) => t && t.trim().length > 10) 
      .slice(0, 50); 

    // 3. Blindagem
    if (textos.length === 0) {
      return res.json({
        departamento,
        resumo:
          "Não há dados suficientes neste departamento para gerar uma análise qualitativa no momento.",
      });
    }

    console.log(
      `Gerando resumo Groq para ${departamento} com ${textos.length} respostas...`
    );

    // 4. Chamada à Inteligência Artificial (Groq)
    const resumo = await gerarResumoExecutivoDepartamento(
      textos,
      departamento
    );

    return res.json({ departamento, resumo });
  } catch (err) {
    console.error("Erro no Controller de Resumo:", err);
    return res
      .status(500)
      .json({
        msg: "Não foi possível gerar o resumo inteligente no momento.",
        error: err.message,
      });
  }
};

/* ========================================================
   GET /api/analise/colaboradores/:departamento
======================================================== */
export const getColaboradoresDepartamento = async (req, res) => {
  try {
    const { departamento } = req.params;

    // Busca usuários do departamento com suas respostas
    const usuarios = await Usuario.findAll({
      where: { departamento },
      attributes: ['usuario_id', 'nome_completo', 'cargo'],
      include: [
        {
          model: Entrevista,
          as: 'entrevistas', // Alias correto (Plural)
          required: true,
          include: [
            {
              model: Resposta,
              as: 'respostas', // Alias correto (Plural)
              attributes: ['score'],
            },
          ],
        },
      ],
    });

    // Formata os dados para o Frontend
    const listaFormatada = usuarios.map(u => {
      const todasRespostas = u.entrevistas.flatMap(e => e.respostas || []);
      
      let mediaScore = 0;
      if (todasRespostas.length > 0) {
        const soma = todasRespostas.reduce((acc, r) => acc + (r.score || 0), 0);
        mediaScore = soma / todasRespostas.length;
      }

      return {
        id: u.usuario_id,
        nome: u.nome_completo,
        cargo: u.cargo || "Não informado",
        score: mediaScore
      };
    });

    return res.json(listaFormatada);

  } catch (error) {
    console.error("Erro ao buscar colaboradores do departamento:", error);
    return res.status(500).json({ msg: "Erro ao listar colaboradores." });
  }
};