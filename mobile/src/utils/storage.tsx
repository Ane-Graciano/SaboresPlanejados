import AsyncStorage from '@react-native-async-storage/async-storage';
import { Receita } from '../model/receita';
import { PlanoSemanal } from '../types/planner';
import { PLANO_SEMANAL_INICIAL } from '../data/mockPlanejador';
import { auth } from '../services/firebaseConfig';
import { 
  getFavoritesFromCloud, 
  saveFavoritesToCloud, 
  getPlannerFromCloud, 
  savePlannerToCloud 
} from '../services/firestoreSync';

const FAVORITOS_KEY = '@favoritos_receitas';
const PLANO_KEY = '@sabores_planejamento_semanal';

export const getFavoritos = async (): Promise<Receita[]> => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Tenta buscar da nuvem primeiro
      const cloudIds = await getFavoritesFromCloud(user.uid);
      if (cloudIds.length > 0) {
        // Opcional: se precisarmos de mapear IDs para objetos Receita completas, 
        // ou podemos guardar os objetos/IDs sincronizados. 
        // Como o AsyncStorage guarda as receitas completas, vamos garantir sincronia:
      }
    }

    const jsonValue = await AsyncStorage.getItem(FAVORITOS_KEY);
    if (!jsonValue) return [];
    const favoritos: Receita[] = JSON.parse(jsonValue);
    return Array.isArray(favoritos) ? favoritos : [];
  } catch (error) {
    console.error('Erro ao ler favoritos:', error);
    return [];
  }
};

export const toggleFavoritoStorage = async (receita: Receita): Promise<Receita[]> => {
  if (!receita || receita.id === undefined || receita.id === null) {
    console.warn('Receita inválida ou sem ID fornecida.');
    return getFavoritos();
  }

  try {
    const favoritosAtuais = await getFavoritos();
    const jaExiste = favoritosAtuais.some((item) => String(item.id) === String(receita.id));
    const novosFavoritos = jaExiste
      ? favoritosAtuais.filter((item) => String(item.id) !== String(receita.id))
      : [...favoritosAtuais, receita];

    // Salva localmente
    await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(novosFavoritos));

    // Sincroniza com a nuvem em segundo plano
    const user = auth.currentUser;
    if (user) {
      const ids = novosFavoritos.map((item) => String(item.id));
      saveFavoritesToCloud(user.uid, ids);
    }

    return novosFavoritos;
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    return getFavoritos();
  }
};

export const getPlanoSalvo = async (): Promise<PlanoSemanal> => {
  try {
    const user = auth.currentUser;
    if (user) {
      const cloudPlano = await getPlannerFromCloud(user.uid);
      if (cloudPlano) {
        await AsyncStorage.setItem(PLANO_KEY, JSON.stringify(cloudPlano));
        return cloudPlano;
      }
    }

    const jsonValue = await AsyncStorage.getItem(PLANO_KEY);
    if (!jsonValue) return PLANO_SEMANAL_INICIAL;
    return JSON.parse(jsonValue);
  } catch (error) {
    console.error('Erro ao ler o plano:', error);
    return PLANO_SEMANAL_INICIAL;
  }
};

export const salvarPlanoStorage = async (plano: PlanoSemanal): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(plano);
    await AsyncStorage.setItem(PLANO_KEY, jsonValue);

    const user = auth.currentUser;
    if (user) {
      savePlannerToCloud(user.uid, plano);
    }
  } catch (error) {
    console.error('Erro ao salvar o plano:', error);
  }
};