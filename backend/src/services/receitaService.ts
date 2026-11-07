
import prisma from '../lib/prisma';

import {
  Estacao,
  Epoca,
  Receita,
} from '../models/Receita';

import { Prisma } from '../generated/prisma/client';

// Relacionamentos necessários para montar o objeto esperado pelo aplicativo.
const incluirRelacoes = {
  imagens: {
    orderBy: { ordem: 'asc' as const },
  },
  ingredientes: {
    orderBy: { ordem: 'asc' as const },
    include: {
      ingrediente: true,
    },
  },
  passos: {
    orderBy: { ordem: 'asc' as const },
  },
  dicas: {
    orderBy: { ordem: 'asc' as const },
  },
  temas: {
    include: {
      tema: true,
    },
  },
  estacoes: true,
  epocas: true,
} satisfies Prisma.ReceitaInclude;

// Consulta centralizada para reutilizar a estrutura dos relacionamentos.
const consultarReceitas = () => {
  return prisma.receita.findMany({
    include: incluirRelacoes,
  });
};

type ReceitaDoBanco = Awaited<
  ReturnType<typeof consultarReceitas>
>[number];

// Converte o formato retornado pelo Prisma para o formato do aplicativo.
const converterReceita = (
  receita: ReceitaDoBanco,
): Receita => {
  return {
    id: receita.id,
    titulo: receita.titulo,
    tempo: receita.tempo,
    dataAdicao: receita.dataAdicao.toISOString().slice(0, 10),

    categoriaId: receita.categoriaId,
    isSaudavel: receita.isSaudavel,

    imagem: receita.imagem,
    imagens: [
      receita.imagem,
      ...receita.imagens.map((imagem) => imagem.url),
    ],

    avaliacao: receita.avaliacao ?? undefined,
    avaliacoesCount: receita.avaliacoesCount ?? undefined,

    dificuldade: receita.dificuldade ?? undefined,
    porcoes: receita.porcoes ?? undefined,

    descricao: receita.descricao,
    historia: receita.historia ?? undefined,

    ingredientes: receita.ingredientes.map((item) => ({
      nome: item.ingrediente.nome,
      qtd: item.qtd ?? undefined,
      unidade: item.unidade ?? undefined,
    })),

    passos: receita.passos.map((passo) => passo.texto),
    dicas: receita.dicas.map((dica) => dica.texto),

    chef: receita.chef,
    tipoPrato: receita.tipoPrato,
    culinaria: receita.culinaria,

    temas: receita.temas.map((item) => item.tema.nome),
    estacoes: receita.estacoes.map(
      (item) => item.estacao as Estacao,
    ),
    epocas: receita.epocas.map(
      (item) => item.epoca as Epoca,
    ),
  };
};

// Buscar todas as receitas.
export const buscarTodasReceitas = async (): Promise<Receita[]> => {
  const registros = await consultarReceitas();

  return registros.map(converterReceita);
};

// Buscar três receitas em destaque.
export const buscarReceitasEmDestaque = async (): Promise<Receita[]> => {
  const registros = await consultarReceitas();

  const receitasConvertidas = registros.map(converterReceita);

  const receitasEmbaralhadas = [...receitasConvertidas].sort(
    () => Math.random() - 0.5,
  );

  return receitasEmbaralhadas.slice(0, 3);
};

// Identificar a estação atual.
const identificarEstacaoAtual = (): Estacao => {
  const mes = new Date().getMonth() + 1;

  if (mes >= 3 && mes < 6) {
    return 'outono';
  }

  if (mes >= 6 && mes < 9) {
    return 'inverno';
  }

  if (mes >= 9 && mes < 12) {
    return 'primavera';
  }

  return 'verao';
};

// Buscar receitas da estação atual.
export const buscarReceitasSazonais = async (): Promise<{
  estacao: Estacao;
  receitas: Receita[];
}> => {
  const estacaoAtual = identificarEstacaoAtual();

  const registros = await prisma.receita.findMany({
    where: {
      estacoes: {
        some: {
          estacao: estacaoAtual,
        },
      },
    },
    include: incluirRelacoes,
  });

  return {
    estacao: estacaoAtual,
    receitas: registros.map(converterReceita),
  };
};

// Identificar tema comemorativo atual.
const identificarTemaAtual = (): string | null => {
  const mes = new Date().getMonth() + 1;

  if (mes === 12) {
    return 'natal';
  }

  if (mes === 6) {
    return 'festa-junina';
  }

  return null;
};

// Buscar receitas relacionadas ao tema atual.
export const buscarReceitasPorTema = async (): Promise<{
  tema: string | null;
  receitas: Receita[];
}> => {
  const temaAtual = identificarTemaAtual();

  if (!temaAtual) {
    return {
      tema: null,
      receitas: [],
    };
  }

  const registros = await prisma.receita.findMany({
    where:
      temaAtual === 'festa-junina'
        ? {
            epocas: {
              some: {
                epoca: 'festa_junina',
              },
            },
          }
        : {
            temas: {
              some: {
                tema: {
                  nome: temaAtual,
                },
              },
            },
          },
    include: incluirRelacoes,
  });

  return {
    tema: temaAtual,
    receitas: registros.map(converterReceita),
  };
};

// Filtros disponíveis.
export interface FiltrosReceita {
  busca?: string;
  ingrediente?: string;
  chef?: string;
  tipoPrato?: string;
  culinaria?: string;
  tempoMax?: number;
}

export type OrdenarPor =
  | 'tempo'
  | 'popularidade'
  | 'data';

export type Ordem = 'asc' | 'desc';

export interface OrdenacaoReceita {
  ordenarPor?: OrdenarPor;
  ordem?: Ordem;
}

// Ordenar receitas.
const ordenarReceitas = (
  receitasFiltradas: Receita[],
  ordenacao: OrdenacaoReceita,
): Receita[] => {
  const resultado = [...receitasFiltradas];

  if (!ordenacao.ordenarPor) {
    return resultado;
  }

  const ordem = ordenacao.ordem ?? 'asc';

  resultado.sort((a, b) => {
    let comparacao = 0;

    if (ordenacao.ordenarPor === 'tempo') {
      comparacao =
        parseInt(a.tempo, 10) - parseInt(b.tempo, 10);
    }

    if (ordenacao.ordenarPor === 'popularidade') {
      comparacao =
        (a.avaliacoesCount ?? 0) -
        (b.avaliacoesCount ?? 0);
    }

    if (ordenacao.ordenarPor === 'data') {
      comparacao =
        new Date(a.dataAdicao).getTime() -
        new Date(b.dataAdicao).getTime();
    }

    return ordem === 'desc' ? -comparacao : comparacao;
  });

  return resultado;
};

// Buscar receitas com filtros e ordenação.
export const buscarReceitas = async (
  filtros: FiltrosReceita,
  ordenacao: OrdenacaoReceita = {},
): Promise<Receita[]> => {
  const where: Prisma.ReceitaWhereInput = {};

  if (filtros.busca) {
    const busca = filtros.busca.trim();

    where.OR = [
      { titulo: { contains: busca } },
      { descricao: { contains: busca } },
      { chef: { contains: busca } },
      { tipoPrato: { contains: busca } },
      { culinaria: { contains: busca } },
      {
        ingredientes: {
          some: {
            ingrediente: {
              nome: { contains: busca },
            },
          },
        },
      },
    ];
  }

  if (filtros.ingrediente) {
    where.ingredientes = {
      some: {
        ingrediente: {
          nome: {
            contains: filtros.ingrediente.trim(),
          },
        },
      },
    };
  }

  if (filtros.chef) {
    where.chef = {
      contains: filtros.chef.trim(),
    };
  }

  if (filtros.tipoPrato) {
    where.tipoPrato = {
      contains: filtros.tipoPrato.trim(),
    };
  }

  if (filtros.culinaria) {
    where.culinaria = {
      contains: filtros.culinaria.trim(),
    };
  }

  const registros = await prisma.receita.findMany({
    where,
    include: incluirRelacoes,
  });

  let resultado = registros.map(converterReceita);

  // O tempo está armazenado como texto (ex.: "35 min").
  // Por isso, o limite é aplicado após converter os registros.
  if (filtros.tempoMax !== undefined) {
    resultado = resultado.filter(
      (receita) =>
        parseInt(receita.tempo, 10) <= filtros.tempoMax!,
    );
  }

  return ordenarReceitas(resultado, ordenacao);
};

// Buscar uma receita pelo ID.
export const buscarReceitaPorId = async (
  id: string,
): Promise<Receita | undefined> => {
  const registro = await prisma.receita.findUnique({
    where: { id },
    include: incluirRelacoes,
  });

  if (!registro) {
    return undefined;
  }

  return converterReceita(registro);
};
