import { sequelize } from '../config/db.js';

import Entrevista from './Entrevista.js';
import Pergunta from './Pergunta.js';
import Resposta from './Resposta.js';
import AnaliseSentimento from './AnaliseSentimento.js';
import Usuario from './User.js';

// entrevista = uma sessão onde um usuario preencheu o form e enviou
// resposta = uma resposta de uma pergunta do form

Entrevista.hasMany(Resposta, { foreignKey: 'id_entrevista' });
Resposta.belongsTo(Entrevista, { foreignKey: 'id_entrevista' });
Pergunta.hasMany(Resposta, { foreignKey: 'id_pergunta' });
Resposta.belongsTo(Pergunta, { foreignKey: 'id_pergunta' });
Resposta.hasMany(AnaliseSentimento, { foreignKey: 'id_resposta' }); // cada resposta vai ter uma analise, isso é melhor para fazer analise com o dash dps
AnaliseSentimento.belongsTo(Resposta, { foreignKey: 'id_resposta' }); 
Usuario.hasMany(Entrevista, { foreignKey: 'id_usuario' }); // um usuario pode fazer mais de uma entrevista pq ele pode ter sido readmitido e dps demitido dnv
Entrevista.belongsTo(Usuario, { foreignKey: 'id_usuario' });

export { sequelize, Entrevista, Pergunta, Resposta, AnaliseSentimento };
