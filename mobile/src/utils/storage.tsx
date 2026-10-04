import AsyncStorage from '@react-native-async-storage/async-storage';
import { Receita } from '../model/receita';

const FAVORITOS_KEY = '@favoritos_receitas';

export const getFavoritos = async (): Promise<Receita[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITOS_KEY);

    if (!jsonValue) {
      return [];
    }

    const favoritos: Receita[] = JSON.parse(jsonValue);

    return Array.isArray(favoritos) ? favoritos : [];
  } catch (error) {
    console.error(
      'Erro ao ler favoritos do AsyncStorage:',
      error,
    );

    return [];
  }
};

export const toggleFavoritoStorage = async (
  receita: Receita,
): Promise<Receita[]> => {
  if (!receita || receita.id === undefined || receita.id === null) {
    console.warn(
      'Receita inválida ou sem ID fornecida para o storage.',
    );

    return getFavoritos();
  }

  try {
    const favoritosAtuais = await getFavoritos();

    const jaExiste = favoritosAtuais.some(
      (item) =>
        String(item.id) === String(receita.id),
    );

    const novosFavoritos = jaExiste
      ? favoritosAtuais.filter(
          (item) =>
            String(item.id) !== String(receita.id),
        )
      : [...favoritosAtuais, receita];

    await AsyncStorage.setItem(
      FAVORITOS_KEY,
      JSON.stringify(novosFavoritos),
    );

    return novosFavoritos;
  } catch (error) {
    console.error(
      'Erro ao alternar favorito no AsyncStorage:',
      error,
    );

    return getFavoritos();
  }
};