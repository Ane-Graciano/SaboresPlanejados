import { Receita } from "../model/receita";


const API_URL = 'http://192.168.1.50:3000';


export const buscarTodasReceitas = async (): Promise<Receita[]> => {
  const resposta = await fetch(`${API_URL}/receitas`);

  if (!resposta.ok) {
    throw new Error(
      'Não foi possível carregar as receitas.',
    );
  }

  return resposta.json();
};


export const buscarReceitaPorId = async (
  id: string,
): Promise<Receita | null> => {
  const resposta = await fetch(
    `${API_URL}/receitas/${id}`,
  );

  /*
   * Receita não encontrada
   */
  if (resposta.status === 404) {
    return null;
  }

  /*
   * Outros erros da API
   */
  if (!resposta.ok) {
    throw new Error(
      'Não foi possível carregar a receita.',
    );
  }

  return resposta.json();
};

/*
 * BUSCAR RECEITAS EM DESTAQUE
 */
export const buscarReceitasEmDestaque =
  async (): Promise<Receita[]> => {
    const resposta = await fetch(
      `${API_URL}/receitas/destaque`,
    );

    if (!resposta.ok) {
      throw new Error(
        'Não foi possível carregar as receitas em destaque.',
      );
    }

    return resposta.json();
  };

/*
 * BUSCAR RECEITAS SAZONAIS
 */
export const buscarReceitasSazonais = async (): Promise<{
  estacao: string;
  receitas: Receita[];
}> => {
  const resposta = await fetch(
    `${API_URL}/receitas/sazonais`,
  );

  if (!resposta.ok) {
    throw new Error(
      'Não foi possível carregar as receitas sazonais.',
    );
  }

  return resposta.json();
};

/*
 * BUSCAR RECEITAS POR TEMA
 */
export const buscarReceitasPorTema = async (): Promise<{
  tema: string | null;
  receitas: Receita[];
}> => {
  const resposta = await fetch(
    `${API_URL}/receitas/temas`,
  );

  if (!resposta.ok) {
    throw new Error(
      'Não foi possível carregar as receitas por tema.',
    );
  }

  return resposta.json();
};

export interface FiltrosReceita {
  busca?: string;
  ingrediente?: string;
  chef?: string;
  tipoPrato?: string;
  culinaria?: string;
  tempoMax?: number;
}

/*
 * BUSCAR RECEITAS COM FILTROS
 */
export const buscarReceitas = async (
  filtros: FiltrosReceita = {},
): Promise<Receita[]> => {
  const params = new URLSearchParams();

  if (filtros.busca) {
    params.append('busca', filtros.busca);
  }

  if (filtros.ingrediente) {
    params.append(
      'ingrediente',
      filtros.ingrediente,
    );
  }

  if (filtros.chef) {
    params.append('chef', filtros.chef);
  }

  if (filtros.tipoPrato) {
    params.append(
      'tipoPrato',
      filtros.tipoPrato,
    );
  }

  if (filtros.culinaria) {
    params.append(
      'culinaria',
      filtros.culinaria,
    );
  }

  if (filtros.tempoMax !== undefined) {
    params.append(
      'tempoMax',
      String(filtros.tempoMax),
    );
  }

  const resposta = await fetch(
    `${API_URL}/receitas?${params.toString()}`,
  );

  if (!resposta.ok) {
    throw new Error(
      'Não foi possível buscar as receitas.',
    );
  }

  return resposta.json();
};