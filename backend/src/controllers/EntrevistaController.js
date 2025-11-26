import {
  sequelize,
  Entrevista,
  Resposta,
  Usuario,
  Pergunta,
} from "../models/Relations.js";

import analyzeBatch from "../services/analise_sentimento/analyze.js";

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
          attributes: [
            "id_pergunta",
            "texto_resposta",
            "resposta_valor",
            "score",
            "theme",
            "riskLevel",
          ],
        },
      ],
      order: [["data_entrevista", "DESC"]],
    });

    return res.status(200).json(entrevistas);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao listar entrevistas.",
      details: error.message,
    });
  }
};

// GET /entrevistas/:id
export const buscarEntrevista = async (req, res) => {
  try {
    const entrevista = await Entrevista.findByPk(req.params.id, {
      include: [
        { model: Usuario, attributes: ["nome_completo", "cargo"] },
        {
          model: Resposta,
          attributes: [
            "id_pergunta",
            "texto_resposta",
            "resposta_valor",
            "score",
            "theme",
            "riskLevel",
          ],
          include: [
            {
              model: Pergunta,
              attributes: ["texto_pergunta", "categoria"],
            },
          ],
        },
      ],
    });

    if (!entrevista) {
      return res.status(404).json({ error: "Entrevista não encontrada." });
    }
    return res.status(200).json(entrevista);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao buscar entrevista.", details: error.message });
  }
};

// POST /entrevistas (CRIAR COM RESPOSTAS)
export const criarEntrevistaComRespostas = async (req, res) => {
  const { data_entrevista, status_entrevista, respostas } = req.body;
  const { email } = req.user;

  const t = await sequelize.transaction();
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    console.log(usuario);

    if (!usuario) {
      await t.rollback();
      return res
        .status(404)
        .json({ error: "Usuário não encontrado com o email do token." });
    }

    const id_usuario = usuario.id_usuario;

    const novaEntrevista = await Entrevista.create(
      {
        id_usuario,
        data_entrevista,
        status_entrevista,
      },
      { transaction: t }
    );


    const respostasCriadas = [];

    for (const r of respostas) {
      const respostaCriada = await Resposta.create(
        {
          id_entrevista: novaEntrevista.id_entrevista,
          id_pergunta: r.id_pergunta,
          texto_resposta: r.texto_resposta,
          resposta_valor: r.resposta_valor,
        },
        { transaction: t }
      );
      respostasCriadas.push(respostaCriada);
    }

    await t.commit();

    const respostasParaAnalise = respostasCriadas.map((r) => ({
      questionId: r.id_pergunta,
      answerText: r.texto_resposta || "",
      answerValue: r.resposta_valor || "",
    }));

    const resultadosAnalise = await analyzeBatch(respostasParaAnalise, {
      language: "pt",
    });

    return res.status(201).json({
      message: "Entrevista + Respostas + IA criadas com sucesso!",
      entrevista: novaEntrevista,
      insights: resultadosAnalise,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      error: "Falha ao criar entrevista e rodar IA",
      details: error.message,
    });
  }
};

// DELETE /entrevistas/:id
export const excluirEntrevista = async (req, res) => {
  const entrevistaId = req.params.id;

  const t = await sequelize.transaction();

  try {
    const entrevista = await Entrevista.findByPk(entrevistaId, {
      transaction: t,
    });

    if (!entrevista) {
      await t.rollback();
      return res.status(404).json({ error: "Entrevista não encontrada." });
    }

    await Entrevista.destroy({
      where: { id_entrevista: entrevistaId },
      transaction: t,
    });

    await t.commit();

    return res.status(204).json();
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      error: "Erro ao excluir entrevista. Operação desfeita.",
      details: error.message,
    });
  }
};
