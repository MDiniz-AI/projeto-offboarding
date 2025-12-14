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
    },
    // --- NOVOS CAMPOS PARA LÓGICA CONDICIONAL ---
    condicao_saida: {
      type: DataTypes.STRING(20), // 'todos', 'voluntaria', 'involuntaria'
      allowNull: false,
      defaultValue: 'todos'
    },
    condicao_cargo: {
      type: DataTypes.STRING(20), // 'todos', 'lider'
      allowNull: false,
      defaultValue: 'todos'
    }
  },
  {
    tableName: "pergunta",
    timestamps: false,
  }
);

export default Pergunta;