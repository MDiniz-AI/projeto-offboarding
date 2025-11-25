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
    resposta_texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    resposta_valor: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // ======== NOVOS CAMPOS DE ANÁLISE DE SENTIMENTO ========
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "Score de sentimento (-1.0 a 1.0)",
    },
    theme: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Tema principal identificado pelo LLM",
    },
    riskLevel: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "Nível de risco para o RH (High, Medium, Low)",
    },
    analysisSource: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "Fonte da análise (gemini ou mock)",
    },

    // FK da entrevista
    id_entrevista: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "entrevista",
        key: "id_entrevista",
      },
    },
  },
  {
    tableName: "resposta",
    timestamps: false,
  }
);

export default Resposta;
