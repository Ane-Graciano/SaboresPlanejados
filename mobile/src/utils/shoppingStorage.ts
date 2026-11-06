import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemListaCompras } from '../types/shopping';

const SHOPPING_LIST_KEY = '@sabores_lista_compras';

export const getListaComprasSalva = async (): Promise<ItemListaCompras[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SHOPPING_LIST_KEY);
    if (!jsonValue) return [];
    return JSON.parse(jsonValue);
  } catch (error) {
    console.error('Erro ao ler a lista de compras do AsyncStorage:', error);
    return [];
  }
};

export const salvarListaComprasStorage = async (
  itens: ItemListaCompras[]
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(itens);
    await AsyncStorage.getItem(SHOPPING_LIST_KEY);
    await AsyncStorage.setItem(SHOPPING_LIST_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar a lista de compras no AsyncStorage:', error);
  }
};