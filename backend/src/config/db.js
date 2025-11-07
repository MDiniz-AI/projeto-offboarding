import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Tenta conectar ao banco usando a URI do arquivo .env
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Se der certo, avisa no console
    console.log('MongoDB Conectado com Sucesso!');
  
  } catch (error) {
    // Se der errado, mostra o erro e encerra o programa
    console.error('Erro ao conectar no MongoDB:', error.message);
    process.exit(1); // Encerra a aplicação com falha
  }
};

export default connectDB;