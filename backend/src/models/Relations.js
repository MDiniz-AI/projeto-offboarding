import { sequelize } from '../config/db.js';

import Entrevista from './Entrevista.js';
import Pergunta from './Pergunta.js';
import Resposta from './Resposta.js';
import AnaliseSentimento from './AnaliseSentimento.js';
import Usuario from './User.js';

// Definição das Relações do Sistema

// 1. Entrevista <-> Resposta
Entrevista.hasMany(Resposta, { 
    foreignKey: 'id_entrevista', 
    as: 'respostas' // Permite: Entrevista.findOne({ include: 'respostas' })
});
Resposta.belongsTo(Entrevista, { 
    foreignKey: 'id_entrevista', 
    as: 'entrevista' // <--- CORREÇÃO PRINCIPAL: Resolve o erro do "Entrevistum"
});

// 2. Pergunta <-> Resposta
Pergunta.hasMany(Resposta, { 
    foreignKey: 'id_pergunta', 
    as: 'respostas' 
});
Resposta.belongsTo(Pergunta, { 
    foreignKey: 'id_pergunta', 
    as: 'pergunta' 
});

// 3. Resposta <-> Análise de Sentimento
Resposta.hasOne(AnaliseSentimento, { 
    foreignKey: 'id_resposta', 
    as: 'analise' 
});
AnaliseSentimento.belongsTo(Resposta, { 
    foreignKey: 'id_resposta', 
    as: 'resposta' 
});

// 4. Usuário <-> Entrevista
Usuario.hasMany(Entrevista, { 
    foreignKey: 'id_usuario', // Certifique-se que no banco é 'id_usuario' (se for 'usuario_id', troque aqui)
    as: 'entrevistas' 
});
Entrevista.belongsTo(Usuario, { 
    foreignKey: 'id_usuario', 
    as: 'usuario' // <--- CRUCIAL para o Controller de Resumo funcionar
});

export { sequelize, Entrevista, Pergunta, Resposta, AnaliseSentimento, Usuario };