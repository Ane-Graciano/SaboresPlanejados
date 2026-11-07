import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/firebaseAuth';
import {
  buscarPreferencias,
  salvarPreferencias,
} from '../services/preferenciasAlimentaresService';

export const obterPreferencias = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const firebaseUid = req.uid!;

    const preferencias = await buscarPreferencias(firebaseUid);

    return res.json(
      preferencias || { restricoes: [] }
    );
  } catch (error) {
    console.error('Erro ao buscar preferências:', error);

    return res.status(500).json({
      message: 'Erro ao buscar preferências alimentares.',
    });
  }
};

export const atualizarPreferencias = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const firebaseUid = req.uid!;
    const { restricoes } = req.body;

    if (
      !Array.isArray(restricoes) ||
      !restricoes.every(
        (item) => typeof item === 'string' && item.trim().length > 0
      )
    ) {
      return res.status(400).json({
        message: 'Informe uma lista válida de restrições.',
      });
    }

    const preferencias = await salvarPreferencias(
      firebaseUid,
      [...new Set(restricoes.map((item: string) => item.trim()))]
    );

    return res.json(preferencias);
  } catch (error) {
    console.error('Erro ao atualizar preferências:', error);

    return res.status(500).json({
      message: 'Erro ao atualizar preferências alimentares.',
    });
  }
};