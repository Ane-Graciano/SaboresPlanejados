
import express from 'express';
import receitaRoutes from './routes/receitaRoutes';
import prisma from './lib/prisma';

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API do Sabores Planejados funcionando!',
  });
});

app.use('/receitas', receitaRoutes);

const iniciarServidor = async () => {
  try {
    await prisma.$connect();

    console.log('Conexão com MySQL estabelecida!');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error('Erro ao conectar com o MySQL:', erro);

    await prisma.$disconnect();

    process.exit(1);
  }
};

iniciarServidor();
