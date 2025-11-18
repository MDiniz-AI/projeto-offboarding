import { DataTypes } from "sequelize";
import { sequelize } from '../config/db.js';

const Pergunta = sequelize.define(
  "pergunta",
  {
    id_pergunta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    texto_pergunta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(100), 
      allowNull: false,
    },
    tipo_resposta: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    opcoes: {
      type: DataTypes.JSON, 
      allowNull: true,      
    }
  },
  {
    tableName: "pergunta",
    timestamps: false,
  }
);

export default Pergunta;