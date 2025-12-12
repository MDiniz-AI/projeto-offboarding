import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Dados do usuário que criamos no banco (ID 1)
const payload = {
    id_usuario: 1,
    email: 'teste_llm@empresa.com',
    nome: 'Usuário Teste'
};

// Gera o token usando a sua chave secreta do .env
// Define validade longa (5 dias) para você testar com calma
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' });

console.log('\n==================================================');
console.log('🔑 SEU TOKEN DE TESTE (Válido por 5 dias):');
console.log('==================================================\n');
console.log(token);
console.log('\n==================================================');
console.log('🔗 URL PARA TESTAR NO NAVEGADOR:');
console.log(`http://localhost:5173/?t=${token}`); // Se seu front for porta 3000, troque 5173 por 3000
console.log('==================================================\n');