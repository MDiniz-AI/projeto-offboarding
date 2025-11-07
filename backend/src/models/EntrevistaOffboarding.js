import mongoose from 'mongoose';
const { Schema } = mongoose;

// Estrutura das respostas
const respostaSchema = new Schema({
  pergunta: { 
    type: String, 
    required: true 
  },
  resposta: { 
    type: String, 
    required: true 
  },
  sentimento_resposta: {
    type: String,
    enum: ['Positivo', 'Negativo', 'Neutro', 'Misto'],
    default: null,
  }
});

// Estrutura principal da entrevista
const entrevistaSchema = new Schema({
  funcionario: {
    type: Schema.Types.ObjectId, 
    ref: 'Funcionario',
    required: true,
  },
  data_entrevista: { 
    type: Date, 
    default: Date.now
  },
 
  // Array de respostas
  respostas: [respostaSchema],
  
  sentimento_geral: {
    type: String,
    enum: ['Positivo', 'Negativo', 'Neutro', 'Misto'],
    default: null,
  },
}, { 
  timestamps: true 
});

const EntrevistaOffboarding = mongoose.model('EntrevistaOffboarding', entrevistaSchema);
export default EntrevistaOffboarding;