import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITOS_KEY = '@favoritos_receitas';

/**
 * Retorna a lista completa de receitas salvas nos favoritos.
 */
export const getFavoritos = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITOS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao ler favoritos do AsyncStorage:', e);
    return [];
  }
};

/**
 * Adiciona a receita se ela não existir, ou remove se já estiver na lista.
 * Retorna a nova lista atualizada de favoritos.
 */
export const toggleFavoritoStorage = async (receita) => {
  try {
    if (!receita || (receita.id === undefined && receita.id === null)) {
      console.warn('Receita inválida ou sem ID fornecida para o storage.');
      return [];
    }

    const favoritosAtuais = await getFavoritos();
    const jaExiste = favoritosAtuais.some(
      (item) => String(item.id) === String(receita.id)
    );

    let novosFavoritos;
    if (jaExiste) {
      novosFavoritos = favoritosAtuais.filter(
        (item) => String(item.id) !== String(receita.id)
      );
    } else {
      novosFavoritos = [...favoritosAtuais, receita];
    }

    await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(novosFavoritos));
    return novosFavoritos;
  } catch (e) {
    console.error('Erro ao alternar favorito no AsyncStorage:', e);
    return [];
  }
};