import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Usuario = sequelize.define("usuario", {
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
    unique: true, // Garante que não haja emails duplicados
  },
  password: {
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
  // --- NOVO CAMPO DE CONTROLE DE ACESSO ---
  role: {
    type: DataTypes.STRING(20),
    defaultValue: 'colaborador', // Valor padrão é colaborador
    allowNull: false,
    comment: "Define o nível de acesso: 'admin' ou 'colaborador'"
  },
  // ----------------------------------------
  data_entrada: {
    type: DataTypes.DATEONLY, // DATEONLY é melhor para datas sem hora (admissão)
    allowNull: false,
  },
  data_saida: {
    type: DataTypes.DATEONLY,
    allowNull: true, // Pode ser nulo se o funcionário ainda estiver ativo
  },
  motivo_saida: {
    type: DataTypes.STRING(50),
    allowNull: true, // Pode ser nulo se o funcionário ainda estiver ativo
  },
}, {
  tableName: "usuarios",
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
});

export default Usuario;