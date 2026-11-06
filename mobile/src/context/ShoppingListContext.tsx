import React, { createContext, useContext, useState, useEffect } from 'react';
import { ItemListaCompras, CategoriaIngrediente } from '../types/shopping';
import { getListaComprasSalva, salvarListaComprasStorage } from '../utils/shoppingStorage';
import { Receita } from '../model/receita';
import { PlanoSemanal } from '../types/planner';
import { usePantry } from './PantryContext';

interface ShoppingListContextData {
  itens: ItemListaCompras[];
  adicionarItemManual: (item: Omit<ItemListaCompras, 'id' | 'comprado'>) => void;
  editarItemManual: (id: string, itemAtualizado: Partial<Omit<ItemListaCompras, 'id'>>) => void;
  removerItem: (id: string) => void;
  alternarComprado: (id: string) => void;
  limparComprados: () => void;
  removerSelecionadosApenas: () => void; // <-- Nova função para a lixeira
  limparTudo: () => void;
  alternarSelecionarTodos: (comprado?: boolean) => void;
  removerSelecionados: () => void;
  gerarDaReceita: (receita: Receita, porcoesAjustadas?: number) => void;
  gerarDoPlanejamentoSemanal: (plano: PlanoSemanal) => void;
}

const ShoppingListContext = createContext<ShoppingListContextData>({} as ShoppingListContextData);

const converterQuantidadeParaNumero = (valor: any): number | null => {
  if (valor === null || valor === undefined) return null;
  if (typeof valor === 'number') return valor;
  const limpo = String(valor).trim().replace(',', '.');
  if (limpo.includes('/')) {
    const [numerador, denominador] = limpo.split('/').map(Number);
    if (denominador && !isNaN(numerador) && !isNaN(denominador)) {
      return numerador / denominador;
    }
  }
  const num = parseFloat(limpo);
  return isNaN(num) ? null : num;
};

function categorizarIngredienteAutomaticamente(nome: string): CategoriaIngrediente {
  const nomeLower = nome.toLowerCase();

  if (
    nomeLower.includes('frango') ||
    nomeLower.includes('carne') ||
    nomeLower.includes('bife') ||
    nomeLower.includes('peito') ||
    nomeLower.includes('linguiça') ||
    nomeLower.includes('presunto') ||
    nomeLower.includes('bacon') ||
    nomeLower.includes('camarão') ||
    nomeLower.includes('peixe')
  ) {
    return 'Carnes';
  }

  if (
    nomeLower.includes('tomate') ||
    nomeLower.includes('cebola') ||
    nomeLower.includes('alho') ||
    nomeLower.includes('manjericão') ||
    nomeLower.includes('folhas') ||
    nomeLower.includes('abacate') ||
    nomeLower.includes('limão') ||
    nomeLower.includes('salada') ||
    nomeLower.includes('cenoura') ||
    nomeLower.includes('batata')
  ) {
    return 'Hortifruti';
  }

  if (
    nomeLower.includes('leite') ||
    nomeLower.includes('creme de leite') ||
    nomeLower.includes('queijo') ||
    nomeLower.includes('manteiga') ||
    nomeLower.includes('requeijão') ||
    nomeLower.includes('ovos') ||
    nomeLower.includes('ovo')
  ) {
    return 'Laticínios';
  }

  if (
    nomeLower.includes('azeite') ||
    nomeLower.includes('óleo') ||
    nomeLower.includes('açúcar') ||
    nomeLower.includes('sal') ||
    nomeLower.includes('pimenta') ||
    nomeLower.includes('farinha') ||
    nomeLower.includes('arroz') ||
    nomeLower.includes('feijão') ||
    nomeLower.includes('nhoque') ||
    nomeLower.includes('canela') ||
    nomeLower.includes('baunilha') ||
    nomeLower.includes('grão-de-bico')
  ) {
    return 'Mercearia';
  }

  if (
    nomeLower.includes('suco') ||
    nomeLower.includes('refrigerante') ||
    nomeLower.includes('cerveja') ||
    nomeLower.includes('vinho') ||
    nomeLower.includes('água')
  ) {
    return 'Bebidas';
  }

  return 'Outros';
}

function consolidarIngredientes(
  listaExistente: ItemListaCompras[],
  novosIngredientes: { nome: string; quantidade: string; unidade: string; categoria?: CategoriaIngrediente }[]
): ItemListaCompras[] {
  const listaAtualizada = [...listaExistente];

  novosIngredientes.forEach((novo) => {
    const nomeNormalizado = novo.nome.trim().toLowerCase();
    const unidadeNormalizada = (novo.unidade || 'unidade').trim().toLowerCase();

    const indexExistente = listaAtualizada.findIndex(
      (item) =>
        item.nome.trim().toLowerCase() === nomeNormalizado &&
        item.unidade.trim().toLowerCase() === unidadeNormalizada
    );

    const categoriaFinal =
      novo.categoria && novo.categoria !== 'Outros'
        ? novo.categoria
        : categorizarIngredienteAutomaticamente(novo.nome);

    if (indexExistente !== -1) {
      const itemExistente = listaAtualizada[indexExistente];
      const qtdAtual = parseFloat(itemExistente.quantidade.replace(',', '.')) || 0;
      const qtdNova = parseFloat(novo.quantidade.replace(',', '.')) || 0;

      if (!isNaN(qtdAtual) && !isNaN(qtdNova) && qtdAtual > 0 && qtdNova > 0) {
        listaAtualizada[indexExistente] = {
          ...itemExistente,
          quantidade: String(Math.round((qtdAtual + qtdNova) * 100) / 100),
          categoria: itemExistente.categoria !== 'Outros' ? itemExistente.categoria : categoriaFinal,
          comprado: false,
        };
      } else {
        listaAtualizada[indexExistente] = {
          ...itemExistente,
          quantidade: `${itemExistente.quantidade} + ${novo.quantidade}`,
          categoria: itemExistente.categoria !== 'Outros' ? itemExistente.categoria : categoriaFinal,
          comprado: false,
        };
      }
    } else {
      listaAtualizada.push({
        id: String(Date.now() + Math.random()),
        nome: novo.nome.trim(),
        quantidade: novo.quantidade || '1',
        unidade: novo.unidade || 'unidade',
        categoria: categoriaFinal,
        comprado: false,
      });
    }
  });

  return listaAtualizada;
}

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemListaCompras[]>([]);
  const { adicionarMultiplosItens } = usePantry();

  useEffect(() => {
    async function carregar() {
      const dados = await getListaComprasSalva();
      setItens(dados);
    }
    carregar();
  }, []);

  const atualizarEstado = (novosItens: ItemListaCompras[]) => {
    setItens(novosItens);
    setTimeout(() => {
      salvarListaComprasStorage(novosItens);
    }, 0);
  };

  const adicionarItemManual = (novo: Omit<ItemListaCompras, 'id' | 'comprado'>) => {
    const categoriaFinal =
      novo.categoria && novo.categoria !== 'Outros'
        ? novo.categoria
        : categorizarIngredienteAutomaticamente(novo.nome);

    const itemFormatado: ItemListaCompras = {
      ...novo,
      categoria: categoriaFinal,
      id: String(Date.now()),
      comprado: false,
    };
    atualizarEstado([...itens, itemFormatado]);
  };

  const editarItemManual = (id: string, itemAtualizado: Partial<Omit<ItemListaCompras, 'id'>>) => {
    const novos = itens.map((item) => (item.id === id ? { ...item, ...itemAtualizado } : item));
    atualizarEstado(novos);
  };

  const removerItem = (id: string) => {
    atualizarEstado(itens.filter((item) => item.id !== id));
  };

  const alternarComprado = (id: string) => {
    atualizarEstado(
      itens.map((item) => (item.id === id ? { ...item, comprado: !item.comprado } : item))
    );
  };

  // Envia os comprados para a despensa e os remove da lista
  const limparComprados = () => {
    const comprados = itens.filter((item) => item.comprado);
    if (comprados.length > 0) {
      adicionarMultiplosItens(
        comprados.map((item) => ({
          nome: item.nome,
          quantidade: item.quantidade,
          unidade: item.unidade,
          categoria: item.categoria,
        }))
      );
    }
    atualizarEstado(itens.filter((item) => !item.comprado));
  };

  // Apenas remove os marcados da lista (lixeira), sem enviar para a despensa
  const removerSelecionadosApenas = () => {
    atualizarEstado(itens.filter((item) => !item.comprado));
  };

  const limparTudo = () => {
    atualizarEstado([]);
  };

  const alternarSelecionarTodos = (comprado?: boolean) => {
    const todosJaComprados = itens.every((item) => item.comprado);
    const novoValor = comprado !== undefined ? comprado : !todosJaComprados;
    atualizarEstado(itens.map((item) => ({ ...item, comprado: novoValor })));
  };

  const removerSelecionados = () => {
    removerSelecionadosApenas();
  };

  const gerarDaReceita = (receita: Receita, porcoesAjustadas?: number) => {
    if (!receita.ingredientes) return;

    const porcaoBase = Number(receita.porcoes || 2);
    const porcaoAlvo = Number(porcoesAjustadas || porcaoBase);
    const fator = porcaoBase > 0 ? porcaoAlvo / porcaoBase : 1;

    const novos = receita.ingredientes.map((ing: any) => {
      const qtdOriginal = ing.qtd !== undefined ? ing.qtd : (ing.quantidade || 1);
      const numBase = converterQuantidadeParaNumero(qtdOriginal);

      let qtdStr = String(qtdOriginal);

      if (numBase !== null) {
        const qtdCalculada = numBase * fator;
        qtdStr = String(Math.round(qtdCalculada * 100) / 100);
      }

      const nomeItem = ing.nome || ing.item || 'Ingrediente';

      return {
        nome: nomeItem,
        quantidade: qtdStr,
        unidade: ing.unidade || 'unidade',
        categoria: ing.categoria || categorizarIngredienteAutomaticamente(nomeItem),
      };
    });

    const listaConsolidada = consolidarIngredientes(itens, novos);
    atualizarEstado(listaConsolidada);
  };

  const gerarDoPlanejamentoSemanal = (planoSemanal: any) => {
    if (!planoSemanal) return;

    let todosOsNovosIngredientes: any[] = [];
    
    // Descobre o índice do dia de hoje (0 = Segunda, ..., 6 = Domingo)
    const hojeIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

    const entradasPlano = Array.isArray(planoSemanal) 
      ? planoSemanal.map((dia, index) => ({ dia, index }))
      : Object.entries(planoSemanal).map(([key, dia]) => ({ dia, index: Number(key) }));

    entradasPlano.forEach(({ dia, index }) => {
      // Filtra apenas de HOJE em diante
      if (!dia || index < hojeIndex) return;

      const refeicoesDoDia = [
        dia.cafeDaManha,
        dia.almoco,
        dia.jantar,
        ...(dia.extras || []),
      ].filter(Boolean);

      refeicoesDoDia.forEach((refeicao: any) => {
        if (!refeicao || !refeicao.ingredientes) return;

        // 1. Pega a porção configurada no slot do planejamento (ex: 1 porção)
        const porcaoAlvo = Number(refeicao.porcoes || 1);

        // 2. Pega a porção original de fábrica da receita (ex: 3 porções)
        // Se a refeição tiver a receitaOriginal associada, pega dela.
        const porcaoBase = Number(
          refeicao.receitaOriginal?.porcoes || 
          refeicao.porcoesOriginal || 
          refeicao.porcoesBase || 
          3 // padrão de fábrica
        );

        // 3. Fator exato: porcaoAlvo (1) / porcaoBase (3) = 0.333...
        const fator = porcaoBase > 0 ? porcaoAlvo / porcaoBase : 1;

        refeicao.ingredientes.forEach((ing: any) => {
          // Se a lista de ingredientes dentro do slot já foi salva multiplicada no passado, 
          // garantimos pegar o ingrediente base original
          const ingBase = ing.ingredienteOriginal || ing;
          const qtdOriginal = ingBase.qtd !== undefined ? ingBase.qtd : (ingBase.quantidade || 1);
          const numBase = converterQuantidadeParaNumero(qtdOriginal);

          let qtdStr = String(qtdOriginal);

          if (numBase !== null) {
            // Aplica a proporção (ex: 600 * (1/3) = 200g)
            const qtdCalculada = numBase * fator;
            qtdStr = String(Math.round(qtdCalculada * 100) / 100);
          }

          const nomeItem = ingBase.nome || ingBase.item || 'Ingrediente';

          todosOsNovosIngredientes.push({
            nome: nomeItem,
            quantidade: qtdStr,
            unidade: ingBase.unidade || 'unidade',
            categoria: ingBase.categoria || categorizarIngredienteAutomaticamente(nomeItem),
          });
        });
      });
    });

    const listaConsolidada = consolidarIngredientes(itens, todosOsNovosIngredientes);
    atualizarEstado(listaConsolidada);
  };

  return (
    <ShoppingListContext.Provider
      value={{
        itens,
        adicionarItemManual,
        editarItemManual,
        removerItem,
        alternarComprado,
        limparComprados,
        removerSelecionadosApenas,
        limparTudo,
        alternarSelecionarTodos,
        removerSelecionados,
        gerarDaReceita,
        gerarDoPlanejamentoSemanal,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export const useShoppingList = () => useContext(ShoppingListContext);