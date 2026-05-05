import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import vacasRouter from './routes/vacas.js';
import producaoRouter from './routes/producao.js';
import medicamentosRouter from './routes/medicamentos.js';
import sanitarioRouter from './routes/sanitario.js';
import despesasRouter from './routes/despesas.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/vacas', vacasRouter);
app.use('/producao', producaoRouter);
app.use('/medicamentos', medicamentosRouter);
app.use('/sanitario', sanitarioRouter);
app.use('/despesas', despesasRouter);

app.get('/', (req, res) => {
  res.json({ message: 'App Leiteiro API v1.0' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
