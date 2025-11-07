import Funcionario from '../models/Funcionario.js';
import EntrevistaOffboarding from '../models/EntrevistaOffboarding.js';

export const criarEntrevista = async (req, res) => {
  try {
    // Recebe os dados do frontend
    const { 
      nome, email, cargo, departamento, 
      data_admissao, data_desligamento, respostas 
    } = req.body;

    // Cria um novo documento de Funcionário
    const novoFuncionario = new Funcionario({
      nome, email, cargo, departamento,
      data_admissao, data_desligamento,
    });
    // Salva o funcionário no banco de dados
    await novoFuncionario.save();

    // Cria a nova entrevista
    const novaEntrevista = new EntrevistaOffboarding({
      funcionario: novoFuncionario._id, // Liga o ID do funcionário 
      respostas: respostas, // Salva o array de respostas
    });
    // Salva a entrevista no banco de dados
    await novaEntrevista.save();
    
    // Adicionar lógica onde chamaremos a API para analise de sentimento

    // Confirmação do registro da entrevista
    res.status(201).json({ 
      message: "Entrevista salva com sucesso!", 
      entrevista: novaEntrevista 
    });

  } catch (error) {
    // Tratamento de dados
    console.error('Erro ao criar entrevista:', error.message);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};