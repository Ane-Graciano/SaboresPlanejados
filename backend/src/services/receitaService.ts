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

export const buscarReceitas = (
  filtros: FiltrosReceita,
): Receita[] => {
  return receitas.filter((receita) => {
    
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();

      const encontrouBusca =
        receita.titulo.toLowerCase().includes(busca) ||
        receita.descricao.toLowerCase().includes(busca) ||
        receita.chef.toLowerCase().includes(busca) ||
        receita.tipoPrato.toLowerCase().includes(busca) ||
        receita.culinaria.toLowerCase().includes(busca) ||
        receita.ingredientes.some((ingrediente) =>
          ingrediente.nome.toLowerCase().includes(busca),
        );

      if (!encontrouBusca) {
        return false;
      }
    }


    if (filtros.ingrediente) {
      const encontrouIngrediente =
        receita.ingredientes.some((ingrediente) =>
          ingrediente.nome
            .toLowerCase()
            .includes(filtros.ingrediente!.toLowerCase()),
        );

      if (!encontrouIngrediente) {
        return false;
      }
    }

    if (filtros.chef) {
      if (
        !receita.chef
          .toLowerCase()
          .includes(filtros.chef.toLowerCase())
      ) {
        return false;
      }
    }

    if (filtros.tipoPrato) {
      if (
        !receita.tipoPrato
          .toLowerCase()
          .includes(filtros.tipoPrato.toLowerCase())
      ) {
        return false;
      }
    }

    if (filtros.culinaria) {
      if (
        !receita.culinaria
          .toLowerCase()
          .includes(filtros.culinaria.toLowerCase())
      ) {
        return false;
      }
    }

    if (filtros.tempoMax !== undefined) {
      const tempo = parseInt(receita.tempo, 10);

      if (tempo > filtros.tempoMax) {
        return false;
      }
    }

    return true;
  });
};

export const buscarReceitaPorId = (
  id: string,
): Receita | undefined => {
  return receitas.find(
    (receita) => receita.id === id,
  );
};