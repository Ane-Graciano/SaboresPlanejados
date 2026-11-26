import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './authService';
import { getPreferencesFromCloud, savePreferencesToCloud } from './firestoreSync';

const API_URL = 'http://192.168.1.50:3000';
const PREFERENCIAS_STORAGE_KEY = '@sabores_preferencias_alimentares';

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
    try {
      const user = auth.currentUser;
      if (user) {
        const cloudPrefs = await getPreferencesFromCloud(user.uid);
        if (cloudPrefs) {
          await AsyncStorage.setItem(PREFERENCIAS_STORAGE_KEY, JSON.stringify(cloudPrefs));
          return cloudPrefs;
        }
      }

      const token = await obterToken();

      const resposta = await fetch(`${API_URL}/preferencias-alimentares`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.message ||
          dados.mensagem ||
          'Não foi possível carregar as restrições alimentares.',
        );
      }

      await AsyncStorage.setItem(PREFERENCIAS_STORAGE_KEY, JSON.stringify(dados));
      return dados;
    } catch (error) {
      console.warn('Erro ao buscar do servidor/nuvem, tentando cache local:', error);
      const json = await AsyncStorage.getItem(PREFERENCIAS_STORAGE_KEY);
      return json ? JSON.parse(json) : { restricoes: [] };
    }
  };

export const salvarPreferenciasAlimentares = async (
  restricoes: string[]
): Promise<PreferenciasAlimentares> => {
  try {
    const preferences = { restricoes };
    await AsyncStorage.setItem(PREFERENCIAS_STORAGE_KEY, JSON.stringify(preferences));

    const user = auth.currentUser;
    if (user) {
      savePreferencesToCloud(user.uid, preferences);
    }

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
  } catch (error) {
    console.error('Erro ao salvar preferências alimentares:', error);
    return { restricoes };
  }
};