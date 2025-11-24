import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import { seedPerguntas } from './src/config/seedPerguntas.js'; 

// Seus imports de rotas
import analiseSentimentoRoutes from './src/routes/AnaliseSentimentoRoutes.js';
import entrevistaRoutes from './src/routes/EntrevistaRoutes.js';
import userRoutes from './src/routes/UserRoutes.js';
import perguntaRoutes from './src/routes/PerguntaRoutes.js';
import respostaRoutes from './src/routes/RespostaRoutes.js';

dotenv.config();

// Garante que o seed só rode DEPOIS que o banco conectar
connectDB().then(() => {
  // O .then() é executado se o connectDB() funcionar
  console.log('Banco de dados conectado, verificando seed...');
  seedPerguntas(); // <== 2. CHAMAR A FUNÇÃO AQUI
});
// --- FIM DA MUDANÇA ---

const app = express();

app.use(cors());
app.use(express.json());

// Rotas (sem mudança)

app.use('/api/entrevistas', entrevistaRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/perguntas', perguntaRoutes);
app.use('/api/respostas', respostaRoutes);
app.use('/api/analise', analiseSentimentoRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});