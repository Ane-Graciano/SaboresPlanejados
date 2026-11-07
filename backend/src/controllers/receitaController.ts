
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

// Listar e filtrar receitas
export const getTodasReceitas = async (
  req: Request,
  res: Response,
) => {
  try {
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

    const ordensValidas: Ordem[] = ['asc', 'desc'];

    if (
      ordenarPor !== undefined &&
      (typeof ordenarPor !== 'string' ||
        !opcoesOrdenacaoValidas.includes(ordenarPor as OrdenarPor))
    ) {
      return res.status(400).json({
        mensagem: 'O critério de ordenação informado é inválido.',
      });
    }

    if (
      ordem !== undefined &&
      (typeof ordem !== 'string' ||
        !ordensValidas.includes(ordem as Ordem))
    ) {
      return res.status(400).json({
        mensagem: 'A ordem de classificação informada é inválida.',
      });
    }

    const ordenarPorValido =
      typeof ordenarPor === 'string' &&
        opcoesOrdenacaoValidas.includes(ordenarPor as OrdenarPor)
        ? (ordenarPor as OrdenarPor)
        : undefined;

    const ordemValida =
      typeof ordem === 'string' &&
        ordensValidas.includes(ordem as Ordem)
        ? (ordem as Ordem)
        : undefined;

    const tempoMaximo =
      typeof tempoMax === 'string' && tempoMax.trim() !== ''
        ? Number(tempoMax)
        : undefined;

    if (
      tempoMaximo !== undefined &&
      (!Number.isFinite(tempoMaximo) || tempoMaximo < 0)
    ) {
      return res.status(400).json({
        mensagem: 'O tempo máximo informado é inválido.',
      });
    }

    const receitas = await buscarReceitas(
      {
        busca: typeof busca === 'string' ? busca : undefined,
        ingrediente:
          typeof ingrediente === 'string' ? ingrediente : undefined,
        chef: typeof chef === 'string' ? chef : undefined,
        tipoPrato:
          typeof tipoPrato === 'string' ? tipoPrato : undefined,
        culinaria:
          typeof culinaria === 'string' ? culinaria : undefined,
        tempoMax: tempoMaximo,
      },
      {
        ordenarPor: ordenarPorValido,
        ordem: ordemValida,
      },
    );

    return res.json(receitas);
  } catch (erro) {
    console.error('Erro ao buscar receitas:', erro);

    return res.status(500).json({
      mensagem: 'Não foi possível buscar as receitas.',
    });
  }
};

// Buscar receitas em destaque
export const getReceitasEmDestaque = async (
  req: Request,
  res: Response,
) => {
  try {
    const receitas = await buscarReceitasEmDestaque();

    return res.json(receitas);
  } catch (erro) {
    console.error('Erro ao buscar receitas em destaque:', erro);

    return res.status(500).json({
      mensagem: 'Não foi possível buscar as receitas em destaque.',
    });
  }
};

// Buscar receitas sazonais
export const getReceitasSazonais = async (
  req: Request,
  res: Response,
) => {
  try {
    const resultado = await buscarReceitasSazonais();

    return res.json(resultado);
  } catch (erro) {
    console.error('Erro ao buscar receitas sazonais:', erro);

    return res.status(500).json({
      mensagem: 'Não foi possível buscar as receitas sazonais.',
    });
  }
};

// Buscar receitas por tema comemorativo
export const getReceitasPorTema = async (
  req: Request,
  res: Response,
) => {
  try {
    const resultado = await buscarReceitasPorTema();

    return res.json(resultado);
  } catch (erro) {
    console.error('Erro ao buscar receitas por tema:', erro);

    return res.status(500).json({
      mensagem: 'Não foi possível buscar receitas por tema.',
    });
  }
};

// Buscar uma receita pelo ID
export const getReceitaPorId = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (typeof id !== 'string' || !id.trim()) {
      return res.status(400).json({
        mensagem: 'ID da receita inválido.',
      });
    }

    const receita = await buscarReceitaPorId(id);

    if (!receita) {
      return res.status(404).json({
        mensagem: 'Receita não encontrada.',
      });
    }

    return res.json(receita);
  } catch (erro) {
    console.error('Erro ao buscar receita:', erro);

    return res.status(500).json({
      mensagem: 'Não foi possível buscar a receita.',
    });
  }
};
