import { Router } from 'express';

import {
  getReceitasEmDestaque,
  getReceitasSazonais,
  getReceitasPorTema,
  getTodasReceitas,
  getReceitaPorId,
} from '../controllers/receitaController';

const router = Router();

router.get('/', getTodasReceitas);
router.get('/destaque', getReceitasEmDestaque);
router.get('/sazonais', getReceitasSazonais);
router.get('/temas', getReceitasPorTema);
router.get('/:id', getReceitaPorId);

export default router;