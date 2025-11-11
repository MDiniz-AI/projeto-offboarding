import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const AnaliseSentimento = sequelize.define('analise_sentimento', {
  id_analise: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  sentimento_score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  sentimento_magnitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  sentimento_classificacao: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  data_analise: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'analise_sentimento',
  timestamps: false, 
});

export default AnaliseSentimento;
