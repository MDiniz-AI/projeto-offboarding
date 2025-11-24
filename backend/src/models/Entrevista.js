import { DataTypes } from "sequelize";
import { sequelize } from '../config/db.js';

const Entrevista = sequelize.define(
  "entrevista",
  {
    id_entrevista: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    data_entrevista: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status_entrevista: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pendente",
    },
  },
  {
    tableName: "entrevista",
    timestamps: false,
  }
);

export default Entrevista;
