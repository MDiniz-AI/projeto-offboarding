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

    resposta_valor: {
      type: DataTypes.INTEGER, 
      allowNull: true,
    },

    texto_resposta: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // FK da pergunta
    id_pergunta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pergunta",
        key: "id_pergunta",
      },
    },

    score: {
      type: DataTypes.FLOAT,
      allowNull: true, 
      comment: 'Score de sentimento (-1.0 a 1.0)',
    },
    magnitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Intensidade da emoção',
    },
    label: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Classificação (positive, negative, neutral)',
    },
    theme: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Tema principal identificado pelo LLM',
    },
    riskLevel: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Nível de risco para o RH (High, Medium, Low)',
    },
    analysisSource: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Fonte da análise (gemini ou mock)',
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
