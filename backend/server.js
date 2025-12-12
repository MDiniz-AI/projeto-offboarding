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
import authRoutes from './src/routes/AuthRoutes.js';

// Importa o Middleware de Segurança
import { verifyToken } from './src/middlewares/auth.js'; 
// Importa o Controller para corrigir a rota do Frontend (Ponte)
import { criarEntrevistaComRespostas } from './src/controllers/EntrevistaController.js';

dotenv.config();
console.log("DEBUG FRONT_URL =", process.env.FRONT_URL);


// Garante que o seed só rode DEPOIS que o banco conectar
connectDB().then(() => {
  // O .then() é executado se o connectDB() funcionar
  console.log('Banco de dados conectado, verificando seed...');
  seedPerguntas(); // <== 2. CHAMAR A FUNÇÃO AQUI
});


const app = express();

app.use(cors());
app.use(express.json());


// --- DEFINIÇÃO DE ROTAS ---

// 1. ROTAS PÚBLICAS (Login/Auth)
app.use('/api/auth', authRoutes);

// 2. APLICAÇÃO DO MIDDLEWARE DE PROTEÇÃO (Para rotas abaixo)
// app.use(verifyToken); // Comentei temporariamente se precisar testar sem token, mas o ideal é descomentar


// 3. CORREÇÃO PARA O FRONTEND (O "Patch")
// O seu Forms.jsx faz POST em '/api/respostas', mas a lógica de IA está no EntrevistaController.
// Essa linha garante que o POST do front vá para o lugar certo.
// Adicionei o verifyToken aqui para garantir que só com o link (token) funcione.
app.post('/api/respostas', verifyToken, criarEntrevistaComRespostas);


// 4. ROTAS PRIVADAS (Recursos do Sistema)
app.use('/api/entrevistas', verifyToken, entrevistaRoutes);
app.use('/api/usuarios', verifyToken, userRoutes); // Aqui dentro vamos colocar o generate-link
app.use('/api/perguntas', verifyToken, perguntaRoutes);
app.use('/api/respostas', verifyToken, respostaRoutes);
app.use('/api/analise', verifyToken, analiseSentimentoRoutes);


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});