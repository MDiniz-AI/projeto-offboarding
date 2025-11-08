import { DataTypes } from "sequelize";
import { sequelize } from '../config/db.js';

const Resposta = sequelize.define('resposta', {
  id_resposta: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  resposta_texto: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  resposta_valor: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'resposta',
  timestamps: false, 
});

export default Resposta;