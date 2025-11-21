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
