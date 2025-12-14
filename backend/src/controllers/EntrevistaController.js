import {
  sequelize,
  Entrevista,
  Resposta,
  Usuario,
  Pergunta
} from "../models/Relations.js";

import analyzeBatch from "../services/analise_sentimento/analyze.js";

// ========================================================
// GET /entrevistas
// ========================================================
export const listarEntrevistas = async (req, res) => {
  try {
    const entrevistas = await Entrevista.findAll({
      include: [
        { model: Usuario, attributes: ["nome_completo", "cargo", "departamento"] },
        {
          model: Resposta,
          attributes: [
            "id_pergunta",
            "resposta_texto",
            "resposta_valor",
            "score",
            "magnitude",
            "label",
            "theme",
            "riskLevel",
            "analysisSource",
            "summary",
            "riskDetails"
          ]
        }
      ],
      order: [["data_entrevista", "DESC"]]
    });

    return res.status(200).json(entrevistas);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao listar entrevistas.",
      details: error.message
    });
  }
};

// ========================================================
// GET /entrevistas/:id
// ========================================================
export const buscarEntrevista = async (req, res) => {
  try {
    const entrevista = await Entrevista.findByPk(req.params.id, {
      include: [
        { model: Usuario, attributes: ["nome_completo", "cargo"] },
        {
          model: Resposta,
          attributes: [
            "id_pergunta",
            "resposta_texto",
            "resposta_valor",
            "score",
            "magnitude",
            "label",
            "theme",
            "riskLevel",
            "analysisSource",
            "summary",
            "riskDetails"
          ],
          include: [{ model: Pergunta, attributes: ["texto_pergunta", "categoria"] }]
        }
      ]
    });

    if (!entrevista) {
      return res.status(404).json({ error: "Entrevista não encontrada." });
    }

    return res.status(200).json(entrevista);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar entrevista.",
      details: error.message
    });
  }
};

// ========================================================
// POST /entrevistas
// CRIAR COM RESPOSTAS + IA + JWT
// ========================================================
export const criarEntrevistaComRespostas = async (req, res) => {
  console.log("🚀 Iniciando criação de entrevista...");

  const {
    respostas,
    data_entrevista = new Date(),
    status_entrevista = "Finalizada"
  } = req.body;

  // ================= SEGURANÇA JWT =================
  if (!req.user?.email) {
    return res.status(401).json({
      error: "Acesso negado. Token inválido ou não fornecido."
    });
  }

  const userEmail = req.user.email;
  const t = await sequelize.transaction();

  try {
    const usuario = await Usuario.findOne({
      where: { email: userEmail },
      transaction: t
    });

    if (!usuario) {
      await t.rollback();
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // ================= TRAVA DE UNICIDADE =================
    const entrevistaExistente = await Entrevista.findOne({
      where: { id_usuario: usuario.usuario_id },
      transaction: t
    });

    if (entrevistaExistente) {
      await t.rollback();
      return res.status(409).json({
        error:
          "Você já respondeu a esta pesquisa de offboarding. O formulário só pode ser enviado uma vez."
      });
    }

    // ================= CRIA ENTREVISTA =================
    const novaEntrevista = await Entrevista.create(
      {
        id_usuario: usuario.usuario_id,
        data_entrevista,
        status_entrevista
      },
      { transaction: t }
    );

    const idEntrevista = novaEntrevista.id_entrevista;

    // ================= PREPARAÇÃO IA =================
    const respostasParaAnalise = respostas
      .filter(
        r =>
          typeof r.resposta_texto === "string" &&
          r.resposta_texto.trim().length > 2
      )
      .map(r => ({
        questionId: r.id_pergunta,
        answerText: r.resposta_texto
      }));

    let resultadosAnalise = [];

    if (respostasParaAnalise.length > 0) {
      try {
        resultadosAnalise = await analyzeBatch(respostasParaAnalise, {
          language: "pt"
        });

        console.log(
          "🧠 RESULTADOS DA IA:",
          JSON.stringify(resultadosAnalise, null, 2)
        );
      } catch (err) {
        console.error(
          "❌ FALHA NA IA — salvando respostas com fallback:",
          err.message
        );
        resultadosAnalise = [];
      }
    }

    // ================= MERGE + SAVE =================
    const respostasParaCriar = respostas.map(original => {
      const analise =
        resultadosAnalise.find(
          a => String(a.questionId) === String(original.id_pergunta)
        ) || {};

      return {
        id_entrevista: idEntrevista,
        id_pergunta: original.id_pergunta,
        resposta_texto: original.resposta_texto?.trim() || " ",
        resposta_valor: String(original.resposta_valor || ""),
        score: analise.score ?? 0,
        magnitude: analise.magnitude ?? 0,
        label: analise.label ?? "neutral",
        theme: analise.theme ?? "Geral",
        riskLevel: analise.riskLevel ?? "Low",
        analysisSource: analise.source ?? "fallback",
        summary: analise.summary ?? "",
        riskDetails: analise.riskDetails ?? ""
      };
    });

    await Resposta.bulkCreate(respostasParaCriar, { transaction: t });

    await t.commit();

    return res.status(201).json({
      message: "Entrevista salva com sucesso!",
      id: idEntrevista
    });
  } catch (error) {
    await t.rollback();
    console.error("🔥 Erro CRÍTICO ao salvar entrevista:", error);

    return res.status(500).json({
      error: "Falha ao salvar a entrevista.",
      details: error.message
    });
  }
};

// ========================================================
// DELETE /entrevistas/:id
// ========================================================
export const excluirEntrevista = async (req, res) => {
  const entrevistaId = req.params.id;
  const t = await sequelize.transaction();

  try {
    const entrevista = await Entrevista.findByPk(entrevistaId, {
      transaction: t
    });

    if (!entrevista) {
      await t.rollback();
      return res.status(404).json({ error: "Entrevista não encontrada." });
    }

    await Entrevista.destroy({
      where: { id_entrevista: entrevistaId },
      transaction: t
    });

    await t.commit();
    return res.status(204).send();
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      error: "Erro ao excluir entrevista.",
      details: error.message
    });
  }
};
