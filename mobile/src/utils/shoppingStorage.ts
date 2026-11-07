
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ItemListaCompras,
  Estabelecimento,
} from '../types/shopping';

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

// Carrega os dados e migra automaticamente o formato antigo.
export const carregarDadosListaCompras =
  async (): Promise<DadosListaCompras> => {
    try {
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

      // Itens antigos recebem o estabelecimento padrão.
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
  } catch (error) {
    console.error('Erro ao salvar listas de compras:', error);
  }
};

// Mantidas para compatibilidade com chamadas antigas, se existirem.
export const getListaComprasSalva = async (): Promise<ItemListaCompras[]> => {
  const dados = await carregarDadosListaCompras();
  return dados.itens;
};

export const salvarListaComprasStorage = async (
  itens: ItemListaCompras[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(itens));
  } catch (error) {
    console.error('Erro ao salvar a lista de compras:', error);
  }
};
