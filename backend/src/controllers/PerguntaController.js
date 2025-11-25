import Pergunta from '../models/Pergunta.js';

/**
 * Busca todas as perguntas do banco de dados.
 * O frontend vai chamar isso para montar o formulário.
 */

function agruparPorCategoria(perguntasPlanas) {
   
    const perguntasAgrupadas = perguntasPlanas.reduce((acc, pergunta) => {
        const categoria = pergunta.categoria;
        
        if (!acc[categoria]) {
            acc[categoria] = [];
        }
        
        acc[categoria].push(pergunta);
        
        return acc;
    }, {}); 
    
    return Object.values(perguntasAgrupadas); 
}

export const listarPerguntas = async (req, res) => {
  try {
    const perguntas = await Pergunta.findAll({
      order: [
               
                ['id_pergunta', 'ASC'] 
            ]
    });

    const perguntasEmSecoes = agruparPorCategoria(perguntas);
    return res.json(perguntasEmSecoes);

  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar perguntas' });
  }
};

// Adicione isso DEPOIS da função listarPerguntas

// 2. CRIAR uma nova pergunta
export const criarPergunta = async (req, res) => {
  try {
    // Pega os dados enviados no corpo da requisição (JSON)
    const novaPergunta = await Pergunta.create(req.body);
    res.status(201).json(novaPergunta);
  } catch (error) {
    console.error('Erro ao criar pergunta:', error);
    res.status(500).json({ msg: 'Erro ao criar pergunta' });
  }
};

// 3. BUSCAR uma pergunta específica pelo ID
export const buscarPergunta = async (req, res) => {
  try {
    const { id } = req.params;
    const pergunta = await Pergunta.findByPk(id);

    if (!pergunta) {
      return res.status(404).json({ msg: 'Pergunta não encontrada' });
    }

    res.json(pergunta);
  } catch (error) {
    console.error('Erro ao buscar pergunta:', error);
    res.status(500).json({ msg: 'Erro interno' });
  }
};

// 4. ATUALIZAR uma pergunta (Esta é a que estava dando erro no console)
export const atualizarPergunta = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Atualiza onde o ID for igual ao passado na URL
    const [linhasAtualizadas] = await Pergunta.update(req.body, {
      where: { id: id }
    });

    if (linhasAtualizadas === 0) {
      return res.status(404).json({ msg: 'Pergunta não encontrada ou sem alterações' });
    }

    // Busca a pergunta atualizada para devolver pro front
    const perguntaAtualizada = await Pergunta.findByPk(id);
    res.json(perguntaAtualizada);

  } catch (error) {
    console.error('Erro ao atualizar:', error);
    res.status(500).json({ msg: 'Erro ao atualizar pergunta' });
  }
};

// 5. DELETAR uma pergunta
export const deletarPergunta = async (req, res) => {
  try {
    const { id } = req.params;
    const linhasDeletadas = await Pergunta.destroy({
      where: { id: id }
    });

    if (!linhasDeletadas) {
      return res.status(404).json({ msg: 'Pergunta não encontrada' });
    }

    res.status(204).send(); // 204 = No Content (Deletado com sucesso, sem corpo de resposta)
  } catch (error) {
    console.error('Erro ao deletar:', error);
    res.status(500).json({ msg: 'Erro ao deletar pergunta' });
  }
};