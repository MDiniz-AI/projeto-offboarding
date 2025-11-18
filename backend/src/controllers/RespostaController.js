// ATENÇÃO: Corrigi os imports para incluir o que faltava
import { sequelize, Entrevista, Pergunta, Resposta } from '../models/Relations.js';

// ---- FUNÇÃO PRINCIPAL (CRIAR) ----
// (A que fizemos juntos agora)

/**
 * Salva uma entrevista completa (sessão + todas as respostas).
 * Espera um JSON no body com:
 * {
 * "id_usuario": 123,
 * "respostas": [
 * { "id_pergunta": 1, "texto_resposta": "Texto da resposta 1" },
 * { "id_pergunta": 2, "texto_resposta": "Texto da resposta 2" }
 * ]
 * }
 */
export const salvarRespostas = async (req, res) => {
  // 1. Inicia a transação
  const t = await sequelize.transaction();

  try {
    // 2. Pega os dados do frontend
    const { id_usuario, respostas } = req.body;

    if (!id_usuario || !respostas || !Array.isArray(respostas) || respostas.length === 0) {
      await t.rollback();
      return res.status(400).json({ msg: "Dados inválidos. id_usuario e array de respostas são obrigatórios." });
    }

    // 3. Cria a "Entrevista" (a sessão de respostas)
    const novaEntrevista = await Entrevista.create(
      { id_usuario: id_usuario },
      { transaction: t }
    );

    // 4. Pega o ID da entrevista recém-criada
    const id_entrevista_criada = novaEntrevista.id_entrevista;

    // 5. Prepara o array de Respostas para o bulkCreate
    const respostasParaSalvar = respostas.map(r => ({
      texto_resposta: r.texto_resposta,
      id_pergunta: r.id_pergunta,
      id_entrevista: id_entrevista_criada
    }));

    // 6. Salva TODAS as respostas de uma vez
    await Resposta.bulkCreate(respostasParaSalvar, { transaction: t });

    // 7. Se tudo deu certo, confirma a transação
    await t.commit();

    res.status(201).json({ 
      msg: "Entrevista salva com sucesso!", 
      entrevistaId: id_entrevista_criada 
    });

  } catch (error) {
    // 8. Se algo deu errado, desfaz tudo (Rollback)
    await t.rollback();
    console.error('Erro ao salvar entrevista:', error.message);
    res.status(500).json({ msg: 'Erro no servidor ao salvar respostas.' });
  }
};


// ---- SEU CÓDIGO (CRUD DE LEITURA E DELEÇÃO) ----
// (Está ótimo!)

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

// GET /respostas/:id
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

// PUT /respostas/:id
export const atualizarResposta = async (req, res) => {
  const respostaId = req.params.id;
  const { texto_resposta } = req.body; // Vi que seu modelo se chama texto_resposta

  try {
    const [updatedRows] = await Resposta.update(
      { texto_resposta }, // Corrigi para usar o nome do campo certo
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
    return res.status(500).json({
      error: 'Erro ao deletar resposta. Verifique se existem análises de sentimento associadas.',
      details: error.message
    });
  }
};