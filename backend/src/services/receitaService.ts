import { receitas } from '../data/receitas';

import { Estacao, Receita } from '../models/Receita';

export const buscarTodasReceitas = (): Receita[] => {
  return receitas;
};

export const buscarReceitasEmDestaque = (): Receita[] => {
  const quantidade = 3;

  const receitasEmbaralhadas = [...receitas].sort(
    () => Math.random() - 0.5,
  );

  return receitasEmbaralhadas.slice(0, quantidade);
};

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

export const buscarReceitasSazonais = (): {
  estacao: Estacao;
  receitas: Receita[];
} => {
  const estacaoAtual = identificarEstacaoAtual();

  const receitasSazonais = receitas.filter(
    (receita) =>
      receita.estacoes?.includes(estacaoAtual) ?? false,
  );

  return {
    estacao: estacaoAtual,
    receitas: receitasSazonais,
  };
};

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

export const buscarReceitasPorTema = (): {
  tema: string | null;
  receitas: Receita[];
} => {
  const temaAtual = identificarTemaAtual();

  if (!temaAtual) {
    return {
      tema: null,
      receitas: [],
    };
  }

  const receitasDoTema = receitas.filter(
    (receita) =>
      receita.temas?.includes(temaAtual) ?? false,
  );

  return {
    tema: temaAtual,
    receitas: receitasDoTema,
  };
};

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

export type Ordem =
  | 'asc'
  | 'desc';

export interface OrdenacaoReceita {
  ordenarPor?: OrdenarPor;
  ordem?: Ordem;
}

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
      const tempoA = parseInt(a.tempo, 10);
      const tempoB = parseInt(b.tempo, 10);

      comparacao = tempoA - tempoB;
    }

    if (ordenacao.ordenarPor === 'popularidade') {
      const popularidadeA = a.avaliacoesCount ?? 0;
      const popularidadeB = b.avaliacoesCount ?? 0;

      comparacao =
        popularidadeA - popularidadeB;
    }

    if (ordenacao.ordenarPor === 'data') {
      const dataA = new Date(a.dataAdicao).getTime();
      const dataB = new Date(b.dataAdicao).getTime();

      comparacao = dataA - dataB;
    }

    return ordem === 'desc'
      ? -comparacao
      : comparacao;
  });

  return resultado;
};

export const buscarReceitas = (
  filtros: FiltrosReceita,
  ordenacao: OrdenacaoReceita = {},
): Receita[] => {
  const receitasFiltradas = receitas.filter(
    (receita) => {
      if (filtros.busca) {
        const busca = filtros.busca.toLowerCase();

        const encontrouBusca =
          receita.titulo
            .toLowerCase()
            .includes(busca) ||
          receita.descricao
            .toLowerCase()
            .includes(busca) ||
          receita.chef
            .toLowerCase()
            .includes(busca) ||
          receita.tipoPrato
            .toLowerCase()
            .includes(busca) ||
          receita.culinaria
            .toLowerCase()
            .includes(busca) ||
          receita.ingredientes.some(
            (ingrediente) =>
              ingrediente.nome
                .toLowerCase()
                .includes(busca),
          );

        if (!encontrouBusca) {
          return false;
        }
      }

      if (filtros.ingrediente) {
        const encontrouIngrediente =
          receita.ingredientes.some(
            (ingrediente) =>
              ingrediente.nome
                .toLowerCase()
                .includes(
                  filtros.ingrediente!.toLowerCase(),
                ),
          );

        if (!encontrouIngrediente) {
          return false;
        }
      }

      if (filtros.chef) {
        if (
          !receita.chef
            .toLowerCase()
            .includes(
              filtros.chef.toLowerCase(),
            )
        ) {
          return false;
        }
      }

      if (filtros.tipoPrato) {
        if (
          !receita.tipoPrato
            .toLowerCase()
            .includes(
              filtros.tipoPrato.toLowerCase(),
            )
        ) {
          return false;
        }
      }

      if (filtros.culinaria) {
        if (
          !receita.culinaria
            .toLowerCase()
            .includes(
              filtros.culinaria.toLowerCase(),
            )
        ) {
          return false;
        }
      }

      if (filtros.tempoMax !== undefined) {
        const tempo = parseInt(
          receita.tempo,
          10,
        );

        if (tempo > filtros.tempoMax) {
          return false;
        }
      }

      return true;
    },
  );

  return ordenarReceitas(
    receitasFiltradas,
    ordenacao,
  );
};

export const buscarReceitaPorId = (
  id: string,
): Receita | undefined => {
  return receitas.find(
    (receita) => receita.id === id,
  );
};