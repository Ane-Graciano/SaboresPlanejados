import { auth } from './authService';

const API_URL = 'http://192.168.1.51:3000';

export interface PreferenciasAlimentares {
  restricoes: string[];
}

const obterToken = async (): Promise<string> => {
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new Error('Usuário não autenticado.');
  }

  return usuario.getIdToken();
};

export const buscarPreferenciasAlimentares =
  async (): Promise<PreferenciasAlimentares> => {
    const token = await obterToken();

    const resposta = await fetch(`${API_URL}/preferencias-alimentares`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resposta.ok) {
      throw new Error('Não foi possível carregar as restrições alimentares.');
    }

    return resposta.json();
  };

export const salvarPreferenciasAlimentares = async (
  restricoes: string[]
): Promise<PreferenciasAlimentares> => {
  const token = await obterToken();

  const resposta = await fetch(`${API_URL}/preferencias-alimentares`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ restricoes }),
  });

  if (!resposta.ok) {
    throw new Error('Não foi possível salvar as restrições alimentares.');
  }

  return resposta.json();
};