import bcrypt from 'bcrypt';

const senha = '123456';
const saltRounds = 10;

bcrypt.hash(senha, saltRounds, (err, hash) => {
    if (err) console.error(err);
    console.log('\n--- HASH PARA SENHA "123456" ---');
    console.log(hash);
    console.log('--------------------------------\n');
    console.log(`Copie este hash e rode no MySQL:`);
    console.log(`UPDATE usuarios SET password = '${hash}' WHERE email = 'teste_llm@empresa.com';`);
});