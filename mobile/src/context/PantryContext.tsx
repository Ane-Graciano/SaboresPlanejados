import React, { createContext, useContext, useState, useEffect } from 'react';
import { ItemDespensa, MatchReceita } from '../types/pantry';
import { CategoriaIngrediente } from '../types/shopping';
import { getDespensaSalva, salvarDespensaStorage } from '../utils/pantryStorage';
import { Receita } from '../model/receita';

interface PantryContextData {
  itens: ItemDespensa[];
  adicionarItem: (item: Omit<ItemDespensa, 'id'>) => void;
  adicionarMultiplosItens: (novosItens: Omit<ItemDespensa, 'id'>[]) => void;
  editarItem: (id: string, itemAtualizado: Partial<Omit<ItemDespensa, 'id'>>) => void;
  removerItem: (id: string) => void;
  limparTudo: () => void;
  possuiIngrediente: (nomeIngrediente: string) => boolean;
  calcularMatchReceita: (receita: Receita) => MatchReceita;
}

const PantryContext = createContext<PantryContextData>({} as PantryContextData);

export function categorizarIngredienteAutomaticamente(nome: string): CategoriaIngrediente {
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

export function PantryProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemDespensa[]>([]);

  useEffect(() => {
    async function carregar() {
      const dados = await getDespensaSalva();
      setItens(dados);
    }
    carregar();
  }, []);

  const atualizarEstado = (novosItens: ItemDespensa[]) => {
    setItens(novosItens);
    setTimeout(() => {
      salvarDespensaStorage(novosItens);
    }, 0);
  };

  const adicionarItem = (novo: Omit<ItemDespensa, 'id'>) => {
    const categoriaFinal =
      novo.categoria && novo.categoria !== 'Outros'
        ? novo.categoria
        : categorizarIngredienteAutomaticamente(novo.nome);

    const itemFormatado: ItemDespensa = {
      ...novo,
      categoria: categoriaFinal,
      id: String(Date.now() + Math.random()),
    };
    atualizarEstado([...itens, itemFormatado]);
  };

  const adicionarMultiplosItens = (novosItens: Omit<ItemDespensa, 'id'>[]) => {
    let listaAtualizada = [...itens];

    novosItens.forEach((novo) => {
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
        const qtdAtual = parseFloat(String(itemExistente.quantidade).replace(',', '.')) || 0;
        const qtdNova = parseFloat(String(novo.quantidade).replace(',', '.')) || 0;

        if (!isNaN(qtdAtual) && !isNaN(qtdNova) && qtdAtual > 0 && qtdNova > 0) {
          listaAtualizada[indexExistente] = {
            ...itemExistente,
            quantidade: String(Math.round((qtdAtual + qtdNova) * 100) / 100),
            categoria: itemExistente.categoria !== 'Outros' ? itemExistente.categoria : categoriaFinal,
          };
        } else {
          listaAtualizada[indexExistente] = {
            ...itemExistente,
            quantidade: `${itemExistente.quantidade} + ${novo.quantidade}`,
            categoria: itemExistente.categoria !== 'Outros' ? itemExistente.categoria : categoriaFinal,
          };
        }
      } else {
        listaAtualizada.push({
          id: String(Date.now() + Math.random()),
          nome: novo.nome.trim(),
          quantidade: novo.quantidade || '1',
          unidade: novo.unidade || 'unidade',
          categoria: categoriaFinal,
        });
      }
    });

    atualizarEstado(listaAtualizada);
  };

  const editarItem = (id: string, itemAtualizado: Partial<Omit<ItemDespensa, 'id'>>) => {
    const novos = itens.map((item) => (item.id === id ? { ...item, ...itemAtualizado } : item));
    atualizarEstado(novos);
  };

  const removerItem = (id: string) => {
    atualizarEstado(itens.filter((item) => item.id !== id));
  };

  const limparTudo = () => {
    atualizarEstado([]);
  };

  const possuiIngrediente = (nomeIngrediente: string): boolean => {
    const nomeNormalizado = nomeIngrediente.trim().toLowerCase();
    return itens.some((item) => {
      const itemNome = item.nome.trim().toLowerCase();
      return itemNome.includes(nomeNormalizado) || nomeNormalizado.includes(itemNome);
    });
  };

  const calcularMatchReceita = (receita: Receita): MatchReceita => {
    if (!receita.ingredientes || receita.ingredientes.length === 0) {
      return {
        receitaId: receita.id,
        itensPossuidos: 0,
        totalItens: 0,
        percentualMatch: 0,
        podeCozinharIntegralmente: false,
        faltandoCount: 0,
      };
    }

    let possuidos = 0;
    const total = receita.ingredientes.length;

    receita.ingredientes.forEach((ing: any) => {
      const nomeIng = ing.nome || ing.item || '';
      if (possuiIngrediente(nomeIng)) {
        possuidos += 1;
      }
    });

    const percentual = Math.round((possuidos / total) * 100);

    return {
      receitaId: receita.id,
      itensPossuidos: possuidos,
      totalItens: total,
      percentualMatch: percentual,
      podeCozinharIntegralmente: possuidos === total,
      faltandoCount: total - possuidos,
    };
  };

  return (
    <PantryContext.Provider
      value={{
        itens,
        adicionarItem,
        adicionarMultiplosItens,
        editarItem,
        removerItem,
        limparTudo,
        possuiIngrediente,
        calcularMatchReceita,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
}

export const usePantry = () => useContext(PantryContext);