import AsyncStorage from '@react-native-async-storage/async-storage';
import { Receita } from '../model/receita';
import { PlanoSemanal } from '../types/planner';
import { PLANO_SEMANAL_INICIAL } from '../data/mockPlanejador';

const FAVORITOS_KEY = '@favoritos_receitas';
const PLANO_KEY = '@sabores_planejamento_semanal';

export const getFavoritos = async (): Promise<Receita[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITOS_KEY);
    if (!jsonValue) return [];
    const favoritos: Receita[] = JSON.parse(jsonValue);
    return Array.isArray(favoritos) ? favoritos : [];
  } catch (error) {
    console.error('Erro ao ler favoritos do AsyncStorage:', error);
    return [];
  }
};

export const toggleFavoritoStorage = async (receita: Receita): Promise<Receita[]> => {
  if (!receita || receita.id === undefined || receita.id === null) {
    console.warn('Receita inválida ou sem ID fornecida para o storage.');
    return getFavoritos();
  }

  try {
    const favoritosAtuais = await getFavoritos();
    const jaExiste = favoritosAtuais.some((item) => String(item.id) === String(receita.id));
    const novosFavoritos = jaExiste
      ? favoritosAtuais.filter((item) => String(item.id) !== String(receita.id))
      : [...favoritosAtuais, receita];

    await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(novosFavoritos));
    return novosFavoritos;
  } catch (error) {
    console.error('Erro ao alternar favorito no AsyncStorage:', error);
    return getFavoritos();
  }
};

export const getPlanoSalvo = async (): Promise<PlanoSemanal> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PLANO_KEY);
    if (!jsonValue) return PLANO_SEMANAL_INICIAL;
    return JSON.parse(jsonValue);
  } catch (error) {
    console.error('Erro ao ler o plano do AsyncStorage:', error);
    return PLANO_SEMANAL_INICIAL;
  }
};

export const salvarPlanoStorage = async (plano: PlanoSemanal): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(plano);
    await AsyncStorage.setItem(PLANO_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar o plano no AsyncStorage:', error);
  }
};