import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemDespensa } from '../types/pantry';

const PANTRY_STORAGE_KEY = '@SaboresPlanejados:despensa';

export async function getDespensaSalva(): Promise<ItemDespensa[]> {
  try {
    const json = await AsyncStorage.getItem(PANTRY_STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Erro ao carregar dados da despensa:', error);
    return [];
  }
}

export async function salvarDespensaStorage(itens: ItemDespensa[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PANTRY_STORAGE_KEY, JSON.stringify(itens));
  } catch (error) {
    console.error('Erro ao salvar dados da despensa:', error);
  }
}