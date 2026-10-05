import { Request, Response } from 'express';

import {
  buscarReceitas,
  buscarReceitasEmDestaque,
  buscarReceitasSazonais,
  buscarReceitasPorTema,
  buscarReceitaPorId,
  OrdenarPor,
  Ordem,
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
    ordenarPor,
    ordem,
  } = req.query;

  const opcoesOrdenacaoValidas: OrdenarPor[] = [
    'tempo',
    'popularidade',
    'data',
  ];

  const ordensValidas: Ordem[] = [
    'asc',
    'desc',
  ];

  const ordenarPorValido =
    typeof ordenarPor === 'string' &&
    opcoesOrdenacaoValidas.includes(
      ordenarPor as OrdenarPor,
    )
      ? (ordenarPor as OrdenarPor)
      : undefined;

  const ordemValida =
    typeof ordem === 'string' &&
    ordensValidas.includes(
      ordem as Ordem,
    )
      ? (ordem as Ordem)
      : undefined;

  const receitas = buscarReceitas(
    {
      busca:
        typeof busca === 'string'
          ? busca
          : undefined,

      ingrediente:
        typeof ingrediente === 'string'
          ? ingrediente
          : undefined,

      chef:
        typeof chef === 'string'
          ? chef
          : undefined,

      tipoPrato:
        typeof tipoPrato === 'string'
          ? tipoPrato
          : undefined,

      culinaria:
        typeof culinaria === 'string'
          ? culinaria
          : undefined,

      tempoMax:
        typeof tempoMax === 'string' &&
        tempoMax !== ''
          ? Number(tempoMax)
          : undefined,
    },
    {
      ordenarPor: ordenarPorValido,
      ordem: ordemValida,
    },
  );

  return res.json(receitas);
};

export const getReceitasEmDestaque = (
  req: Request,
  res: Response,
) => {
  const receitas =
    buscarReceitasEmDestaque();

  return res.json(receitas);
};

export const getReceitasSazonais = (
  req: Request,
  res: Response,
) => {
  const receitas =
    buscarReceitasSazonais();

  return res.json(receitas);
};

export const getReceitasPorTema = (
  req: Request,
  res: Response,
) => {
  const receitas =
    buscarReceitasPorTema();

  return res.json(receitas);
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

  const receita =
    buscarReceitaPorId(id);

  if (!receita) {
    return res.status(404).json({
      mensagem: 'Receita não encontrada.',
    });
  }

  return res.json(receita);
};