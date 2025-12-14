import Pergunta from '../models/Pergunta.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Função auxiliar para agrupar array plano em array de seções
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

// 1. LISTAR PERGUNTAS (COM FILTRO DE CONTEXTO JWT)
export const listarPerguntas = async (req, res) => {
  try {
    // 1. Busca TODAS as perguntas do banco
    const todasPerguntas = await Pergunta.findAll({
      order: [
         ['id_pergunta', 'ASC'] 
      ]
    });

    // 2. Define o Contexto Padrão (caso não tenha token)
    let userContext = { tipo_saida: 'voluntaria', is_lider: false };

    // 3. Tenta ler o Token do Header para pegar o contexto real
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.contexto) {
                userContext = decoded.contexto;
                console.log("🔍 Contexto identificado:", userContext);
            }
        } catch (err) {
            console.log("⚠️ Token inválido ou ausente ao listar perguntas. Usando padrão.");
        }
    }

    // 4. APLICA O FILTRO (Server-Side Filtering)
    const perguntasFiltradas = todasPerguntas.filter(p => {
        // Normaliza para evitar erros de maiúsculas/minúsculas e trata nulos
        const condicaoSaida = (p.condicao_saida || 'todos').toLowerCase();
        const condicaoCargo = (p.condicao_cargo || 'todos').toLowerCase();

        // Verifica Tipo de Saída (Voluntária vs Involuntária)
        // Se for 'todos', passa. Se for igual ao do usuário, passa.
        const matchSaida = condicaoSaida === 'todos' || condicaoSaida === userContext.tipo_saida;

        // Verifica Liderança
        // Se for 'todos', passa. Se for 'lider' E o usuário for líder, passa.
        const matchCargo = condicaoCargo === 'todos' || (condicaoCargo === 'lider' && userContext.is_lider);

        return matchSaida && matchCargo;
    });

    // 5. Agrupa e envia
    const perguntasEmSecoes = agruparPorCategoria(perguntasFiltradas);
    
    // Se, após filtrar, não sobrar nada (ex: config errada), retorna array vazio para não quebrar o front
    return res.json(perguntasEmSecoes || []);

  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar perguntas' });
  }
};

// 2. CRIAR uma nova pergunta
export const criarPergunta = async (req, res) => {
  try {
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

// 4. ATUALIZAR uma pergunta
export const atualizarPergunta = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [linhasAtualizadas] = await Pergunta.update(req.body, {
      where: { id: id } // Se seu Primary Key no model for diferente de 'id', ajuste aqui
    });

    if (linhasAtualizadas === 0) {
      return res.status(404).json({ msg: 'Pergunta não encontrada ou sem alterações' });
    }

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

    res.status(204).send(); 
  } catch (error) {
    console.error('Erro ao deletar:', error);
    res.status(500).json({ msg: 'Erro ao deletar pergunta' });
  }
};