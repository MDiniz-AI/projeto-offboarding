import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Resposta = sequelize.define(
  "resposta",
  {
    id_resposta: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    // GARANTINDO QUE O NOME ESTÁ CERTO
    resposta_texto: {
      type: DataTypes.TEXT,
      allowNull: false, // Isso causa o erro se o Sequelize ignorar o campo
      defaultValue: " " // ADICIONADO: Valor padrão de segurança no banco
    },
    resposta_valor: {
      type: DataTypes.STRING(255),
      allowNull: true, // Pode ser nulo se for texto livre
    },
    
    // CAMPOS DE IA
    score: {
      type: DataTypes.FLOAT,
      allowNull: true, 
    },
    magnitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    label: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    theme: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    riskLevel: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    analysisSource: {
      type: DataTypes.STRING(20),
      allowNull: true,
    }
  },
  {
    tableName: "resposta",
    timestamps: false, // Se você usa createdAt/updatedAt
    underscored: false // Garante que resposta_texto seja resposta_texto mesmo
  }
);

export default Resposta;