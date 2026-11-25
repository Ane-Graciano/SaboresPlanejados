import { auth } from './authService';

const API_URL = 'http://192.168.1.50:3000';
// const API_URL = 'http://10.13.56.72:3000';

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

// export const buscarPreferenciasAlimentares =
//   async (): Promise<PreferenciasAlimentares> => {
//     const token = await obterToken();

//     const resposta = await fetch(`${API_URL}/preferencias-alimentares`, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!resposta.ok) {
//       throw new Error('Não foi possível carregar as restrições alimentares.');
//     }

//     return resposta.json();
//   };

export const buscarPreferenciasAlimentares =
  async (): Promise<PreferenciasAlimentares> => {
    const token = await obterToken();

    const resposta = await fetch(`${API_URL}/preferencias-alimentares`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const dados = await resposta.json();

    console.log('Status preferências alimentares:', resposta.status);
    console.log('Resposta preferências alimentares:', dados);

    if (!resposta.ok) {
      throw new Error(
        dados.message ||
        dados.mensagem ||
        'Não foi possível carregar as restrições alimentares.',
      );
    }

    return dados;
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