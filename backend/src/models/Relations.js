import { sequelize } from '../config/db.js';

import Entrevista from './Entrevista.js';
import Pergunta from './Pergunta.js';
import Resposta from './Resposta.js';
import AnaliseSentimento from './AnaliseSentimento.js';
import Usuario from './User.js';

// Definição das Relações do Sistema

// 1. Entrevista <-> Resposta
// Uma entrevista tem várias respostas.
Entrevista.hasMany(Resposta, { foreignKey: 'id_entrevista'});
Resposta.belongsTo(Entrevista, { foreignKey: 'id_entrevista'});

// 2. Pergunta <-> Resposta
// Uma pergunta pode ter várias respostas (de diferentes entrevistas).
Pergunta.hasMany(Resposta, { foreignKey: 'id_pergunta'});
Resposta.belongsTo(Pergunta, { foreignKey: 'id_pergunta' });

// 3. Resposta <-> Análise de Sentimento
// Cada resposta tem uma análise associada (relação 1:1).
Resposta.hasOne(AnaliseSentimento, { foreignKey: 'id_resposta' }); 
AnaliseSentimento.belongsTo(Resposta, { foreignKey: 'id_resposta' }); 

// 4. Usuário <-> Entrevista (CORREÇÃO APLICADA AQUI)
// Um usuário pode ter várias entrevistas (ex: readmissão).
// O 'as: entrevistas' é CRUCIAL para o 'include' funcionar corretamente no UserController.
Usuario.hasMany(Entrevista, { foreignKey: 'id_usuario', as: 'entrevistas' }); 
Entrevista.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

export { sequelize, Entrevista, Pergunta, Resposta, AnaliseSentimento, Usuario };