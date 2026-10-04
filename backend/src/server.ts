import express from 'express';
import receitaRoutes from './routes/receitaRoutes';

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API do Sabores Planejados funcionando!',
  });
});

app.use('/receitas', receitaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});