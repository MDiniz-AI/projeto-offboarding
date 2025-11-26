// ATENÇÃO: Corrigi os imports para incluir o que faltava
import {
  sequelize,
  Entrevista,
  Pergunta,
  Resposta,
} from "../models/Relations.js";
import analyzeBatch from "../services/analise_sentimento/analyze.js"; // NOVO: Serviço de Análise LLM

// ---- FUNÇÃO PRINCIPAL (SALVAR RESPOSTAS E RODAR ANÁLISE) ----
export const salvarRespostas = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id_usuario, respostas } = req.body;

    console.log("Respostas recebidas:", respostas);

    if (
      !id_usuario ||
      !respostas ||
      !Array.isArray(respostas) ||
      respostas.length === 0
    ) {
      await t.rollback();
      return res
        .status(400)
        .json({ msg: "Dados inválidos. id_usuario e respostas obrigatórios." });
    }

    const novaEntrevista = await Entrevista.create(
      { id_usuario, status_entrevista: "concluído" },
      { transaction: t }
    );

    const id_entrevista_criada = novaEntrevista.id_entrevista;

    const respostasParaSalvar = respostas.map((r) => ({
      id_pergunta: r.id_pergunta,
      id_entrevista: id_entrevista_criada,
      resposta_texto: r.resposta_texto || null,
      resposta_valor: r.resposta_valor ?? null,
    }));

    console.log("Respostas que serão salvas:", respostasParaSalvar);

    await Resposta.bulkCreate(respostasParaSalvar, { transaction: t });

    await t.commit();

    return res.status(201).json({
      msg: "Entrevista salva com sucesso!",
      entrevistaId: id_entrevista_criada,
    });
  } catch (error) {
    await t.rollback();
    console.error("Erro ao salvar entrevista:", error);
    res.status(500).json({ msg: "Erro no servidor ao salvar respostas." });
  }
};

// ---- SEU CÓDIGO (CRUD DE LEITURA E DELEÇÃO) ----

// GET /respostas
export const listarRespostas = async (req, res) => {
  try {
    const respostas = await Resposta.findAll({
      include: [
        { model: Pergunta, attributes: ["texto_pergunta", "categoria"] },
        { model: Entrevista, attributes: ["id_usuario", "data_entrevista"] },
      ],
      order: [["id_resposta", "DESC"]],
    });
    return res.status(200).json(respostas);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao listar respostas.", details: error.message });
  }
};

// GET /respostas/:id
export const buscarResposta = async (req, res) => {
  try {
    const resposta = await Resposta.findByPk(req.params.id, {
      include: [
        { model: Pergunta, attributes: ["texto_pergunta", "categoria"] },
        { model: Entrevista, attributes: ["id_usuario", "data_entrevista"] },
      ],
    });

    if (!resposta) {
      return res.status(404).json({ error: "Resposta não encontrada." });
    }
    return res.status(200).json(resposta);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao buscar resposta.", details: error.message });
  }
};

// PUT /respostas/:id
export const atualizarResposta = async (req, res) => {
  const respostaId = req.params.id;
  const { resposta_texto } = req.body;

  try {
    const [updatedRows] = await Resposta.update(
      { resposta_texto },
      { where: { id_resposta: respostaId } }
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({
          error: "Resposta não encontrada ou nenhum dado para atualizar.",
        });
    }

    const respostaAtualizada = await Resposta.findByPk(respostaId);
    return res.status(200).json(respostaAtualizada);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao atualizar resposta.", details: error.message });
  }
};

// DELETE /respostas/:id
export const deletarResposta = async (req, res) => {
  try {
    const deletedRows = await Resposta.destroy({
      where: { id_resposta: req.params.id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Resposta não encontrada." });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      error:
        "Erro ao deletar resposta. Verifique se existem análises de sentimento associadas.",
      details: error.message,
    });
  }
};
