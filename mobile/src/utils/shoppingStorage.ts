import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ItemListaCompras,
  Estabelecimento,
} from '../types/shopping';
import { auth } from '../services/firebaseConfig';
import { getShoppingListFromCloud, saveShoppingListToCloud } from '../services/firestoreSync';

const SHOPPING_LIST_KEY = '@sabores_lista_compras';
const SHOPPING_STORES_KEY = '@sabores_estabelecimentos';
const SELECTED_STORE_KEY = '@sabores_estabelecimento_selecionado';

export const ESTABELECIMENTO_PADRAO: Estabelecimento = {
  id: 'meu-mercado',
  nome: 'Meu mercado',
};

export interface DadosListaCompras {
  itens: ItemListaCompras[];
  estabelecimentos: Estabelecimento[];
  estabelecimentoSelecionadoId: string;
}

export const carregarDadosListaCompras =
  async (): Promise<DadosListaCompras> => {
    try {
      const user = auth.currentUser;
      if (user) {
        const cloudItems = await getShoppingListFromCloud(user.uid);
        if (cloudItems) {
          await AsyncStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(cloudItems));
        }
      }

      const [itensSalvos, lojasSalvas, lojaSelecionadaSalva] =
        await Promise.all([
          AsyncStorage.getItem(SHOPPING_LIST_KEY),
          AsyncStorage.getItem(SHOPPING_STORES_KEY),
          AsyncStorage.getItem(SELECTED_STORE_KEY),
        ]);

      const lojas: Estabelecimento[] = lojasSalvas
        ? JSON.parse(lojasSalvas)
        : [ESTABELECIMENTO_PADRAO];

      if (!lojas.some((loja) => loja.id === ESTABELECIMENTO_PADRAO.id)) {
        lojas.unshift(ESTABELECIMENTO_PADRAO);
      }

      const lojaSelecionadaId =
        lojaSelecionadaSalva &&
        lojas.some((loja) => loja.id === lojaSelecionadaSalva)
          ? lojaSelecionadaSalva
          : ESTABELECIMENTO_PADRAO.id;

      const itensAntigos: any[] = itensSalvos
        ? JSON.parse(itensSalvos)
        : [];

      const itens: ItemListaCompras[] = itensAntigos.map((item) => ({
        ...item,
        lojaId: item.lojaId || ESTABELECIMENTO_PADRAO.id,
      }));

      return {
        itens,
        estabelecimentos: lojas,
        estabelecimentoSelecionadoId: lojaSelecionadaId,
      };
    } catch (error) {
      console.error('Erro ao carregar listas de compras:', error);

      return {
        itens: [],
        estabelecimentos: [ESTABELECIMENTO_PADRAO],
        estabelecimentoSelecionadoId: ESTABELECIMENTO_PADRAO.id,
      };
    }
  };

export const salvarDadosListaCompras = async (
  dados: DadosListaCompras
): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(dados.itens)),
      AsyncStorage.setItem(
        SHOPPING_STORES_KEY,
        JSON.stringify(dados.estabelecimentos)
      ),
      AsyncStorage.setItem(
        SELECTED_STORE_KEY,
        dados.estabelecimentoSelecionadoId
      ),
    ]);

    const user = auth.currentUser;
    if (user) {
      saveShoppingListToCloud(user.uid, dados.itens);
    }
  } catch (error) {
    console.error('Erro ao salvar listas de compras:', error);
  }
};

export const getListaComprasSalva = async (): Promise<ItemListaCompras[]> => {
  const dados = await carregarDadosListaCompras();
  return dados.itens;
};

export const salvarListaComprasStorage = async (
  itens: ItemListaCompras[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(itens));
    const user = auth.currentUser;
    if (user) {
      saveShoppingListToCloud(user.uid, itens);
    }
  } catch (error) {
    console.error('Erro ao salvar a lista de compras:', error);
  }
};