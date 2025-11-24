// ATENÇÃO: Corrigi os imports para incluir o que faltava
import { sequelize, Entrevista, Pergunta, Resposta } from '../models/Relations.js';
import analyzeBatch from '../services/analise_sentimento/analyze.js'; // NOVO: Serviço de Análise LLM

// ---- FUNÇÃO PRINCIPAL (SALVAR RESPOSTAS E RODAR ANÁLISE) ----
export const salvarRespostas = async (req, res) => {
  // 1. Inicia a transação
  const t = await sequelize.transaction();

  try {
    // 2. Pega os dados do frontend
    // NOTE: O frontend deve enviar a resposta_texto e id_pergunta
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
    const id_entrevista_criada = novaEntrevista.id_entrevista;

    // 4. COLETA E COMBINA DADOS: Pega o texto da pergunta e categoria (para a análise)
    const idsPerguntas = respostas.map(r => r.id_pergunta);
    const perguntas = await Pergunta.findAll({
      where: { id_pergunta: idsPerguntas },
      attributes: ['id_pergunta', 'texto_pergunta', 'categoria'],
      raw: true
    });
    
    // Mapeia respostas para o formato esperado pelo serviço analyzeBatch
    const respostasParaAnalise = respostas.map(r => {
      const pergunta = perguntas.find(p => p.id_pergunta === r.id_pergunta);
      return {
        questionId: r.id_pergunta, // ID da pergunta
        answerText: r.texto_resposta, // O texto de feedback
        sectionName: pergunta ? pergunta.categoria : 'Geral', // Categoria usada como tema/seção
      };
    });
    
    // 5. CHAMA O SERVIÇO LLM (GEMINI) - Roda a análise de sentimentos
    const resultadosAnalise = await analyzeBatch(respostasParaAnalise, { language: 'pt' });

    // 6. Prepara o array final de Respostas para o bulkCreate (combinando dados)
    const respostasParaSalvar = resultadosAnalise.map(analise => {
      const respostaOriginal = respostas.find(r => r.id_pergunta === analise.questionId);
      
      return {
        id_entrevista: id_entrevista_criada,
        id_pergunta: analise.questionId,
        texto_resposta: respostaOriginal.texto_resposta,
        resposta_valor: respostaOriginal.resposta_valor || analise.label, // Usa o label se resposta_valor não vier
        
        // DADOS DA ANÁLISE LLM (Salva os insights)
        score: analise.score,
        magnitude: analise.magnitude,
        label: analise.label,
        theme: analise.theme,
        riskLevel: analise.riskLevel,
        analysisSource: analise.source,
      };
    });

    // 7. Salva TODAS as respostas de uma vez
    await Resposta.bulkCreate(respostasParaSalvar, { transaction: t });

    // 8. Confirma a transação
    await t.commit();

    res.status(201).json({ 
      msg: "Entrevista salva e analisada com sucesso!", 
      entrevistaId: id_entrevista_criada,
      insights: resultadosAnalise // Retorna os insights para o frontend, se ele precisar
    });

  } catch (error) {
    // 9. Se algo deu errado, desfaz tudo (Rollback)
    await t.rollback();
    console.error('Erro ao salvar entrevista e rodar análise de IA:', error.message);
    res.status(500).json({ msg: 'Erro no servidor ao salvar respostas e rodar análise. Verifique a chave GEMINI_API_KEY.' });
  }
};


// ---- SEU CÓDIGO (CRUD DE LEITURA E DELEÇÃO) ----

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
  const { texto_resposta } = req.body;

  try {
    const [updatedRows] = await Resposta.update(
      { texto_resposta },
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