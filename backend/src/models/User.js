import { DataTypes } from "sequelize";
import { sequelize } from '../config/db.js';

const User = sequelize.define(
  "usuario",
  {
    usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome_completo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departamento: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    data_entrada: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_saida: {
      type: DataTypes.DATE,
      allowNull: true,

    },
    motivo_saida: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "usuarios", // no db o nome tem que ser esse
  }
);

export default User;
