import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import {connectDB} from './src/config/db.js';
import entrevistaRoutes from './src/routes/EntrevistaRoutes.js';
import userRoutes from './src/routes/UserRoutes.js';


dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/entrevistas', entrevistaRoutes);
app.use('/api/usuarios', userRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});