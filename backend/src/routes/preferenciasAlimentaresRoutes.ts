import { Router } from 'express';

import { verificarAutenticacao } from '../middleware/firebaseAuth';

import {
  obterPreferencias,
  atualizarPreferencias,
} from '../controllers/preferenciasAlimentaresController';

const router = Router();

router.get('/', verificarAutenticacao, obterPreferencias);

router.put('/', verificarAutenticacao, atualizarPreferencias);

export default router;