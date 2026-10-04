import { Request, Response } from 'express';

import {
  buscarReceitas,
  buscarReceitasEmDestaque,
  buscarReceitasSazonais,
  buscarReceitasPorTema,
  buscarReceitaPorId,
} from '../services/receitaService';

export const getTodasReceitas = (
  req: Request,
  res: Response,
) => {
  const {
    busca,
    ingrediente,
    chef,
    tipoPrato,
    culinaria,
    tempoMax,
  } = req.query;

  const receitas = buscarReceitas({
    busca: busca as string | undefined,
    ingrediente: ingrediente as string | undefined,
    chef: chef as string | undefined,
    tipoPrato: tipoPrato as string | undefined,
    culinaria: culinaria as string | undefined,
    tempoMax: tempoMax
      ? Number(tempoMax)
      : undefined,
  });

  res.json(receitas);
};

export const getReceitasEmDestaque = (
  req: Request,
  res: Response,
) => {
  const receitas = buscarReceitasEmDestaque();

  res.json(receitas);
};

export const getReceitasSazonais = (
  req: Request,
  res: Response,
) => {
  const receitas = buscarReceitasSazonais();

  res.json(receitas);
};

export const getReceitasPorTema = (
  req: Request,
  res: Response,
) => {
  const receitas = buscarReceitasPorTema();

  res.json(receitas);
};

export const getReceitaPorId = (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({
      mensagem: 'ID da receita inválido.',
    });
  }

  const receita = buscarReceitaPorId(id);

  if (!receita) {
    return res.status(404).json({
      mensagem: 'Receita não encontrada.',
    });
  }

  return res.json(receita);
};