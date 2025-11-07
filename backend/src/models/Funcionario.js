import mongoose from 'mongoose';


const funcionarioSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // O email deve ser único
  },
  cargo: { 
    type: String, 
    required: true 
  },
  departamento: { 
    type: String, 
    required: true 
  },
  data_admissao: { 
    type: Date, 
    required: true 
  },
  data_desligamento: { 
    type: Date, 
    required: true 
  },
}, { 
  timestamps: true // Adiciona 'createdAt' e 'updatedAt'
});

// Cria e exporta o modelo
const Funcionario = mongoose.model('Funcionario', funcionarioSchema);
export default Funcionario;