import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ResumoDepartamento = sequelize.define("ResumoDepartamento", {
  departamento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  resumo: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "resumos_departamento",
  timestamps: true
});

export default ResumoDepartamento;
