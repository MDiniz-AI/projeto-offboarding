import 'dotenv/config';
import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
});

const connectDB = async () => {
  try {
    
    await sequelize.authenticate();
    
    console.log('MySQL Conectado com Sucesso!');
   // await sequelize.sync({ alter: true }); // sincroniza com meu db mas tem que tirar quando for pra prod

  } catch (err){
   
    /*catch (error) {
   
    console.error('❌ Erro ao conectar no MySQL :', error.message);
    process.exit(1); 
 }*/
  }
};

export { connectDB, sequelize };