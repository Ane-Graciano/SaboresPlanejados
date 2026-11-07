
import React, { createContext, useContext, useState, useEffect } from 'react';

import {
  ItemListaCompras,
  CategoriaIngrediente,
  Estabelecimento,
} from '../types/shopping';

import {
  carregarDadosListaCompras,
  salvarDadosListaCompras,
  ESTABELECIMENTO_PADRAO,
} from '../utils/shoppingStorage';

import { Receita } from '../model/receita';
import { PlanoSemanal } from '../types/planner';
import { usePantry } from './PantryContext';

type DadosNovoItem = Omit<
  ItemListaCompras,
  'id' | 'comprado' | 'lojaId'
>;

interface ShoppingListContextData {
  itens: ItemListaCompras[];
  estabelecimentos: Estabelecimento[];
  estabelecimentoSelecionadoId: string;

  selecionarEstabelecimento: (id: string) => void;
  adicionarEstabelecimento: (nome: string) => Estabelecimento | null;
  excluirEstabelecimento: (
    id: string,
    transferirItens: boolean
  ) => boolean;

  adicionarItemManual: (item: DadosNovoItem) => void;
  editarItemManual: (
    id: string,
    itemAtualizado: Partial<Omit<ItemListaCompras, 'id' | 'lojaId'>>
  ) => void;

  removerItem: (id: string) => void;
  alternarComprado: (id: string) => void;
  limparComprados: () => void;
  removerSelecionadosApenas: () => void;
  limparTudo: () => void;
  alternarSelecionarTodos: (comprado?: boolean) => void;
  removerSelecionados: () => void;

  gerarDaReceita(
    receita: Receita,
    porcoesAjustadas?: number,
    lojaId?: string
  ): void;

  gerarDoPlanejamentoSemanal(
    plano: PlanoSemanal,
    lojaId?: string
  ): void;
}

const ShoppingListContext = createContext<ShoppingListContextData>(
  {} as ShoppingListContextData
);

const converterQuantidadeParaNumero = (valor: any): number | null => {
  if (valor === null || valor === undefined) return null;

  if (typeof valor === 'number') return valor;

  const limpo = String(valor).trim().replace(',', '.');

  if (limpo.includes('/')) {
    const [numerador, denominador] = limpo.split('/').map(Number);

    if (
      denominador &&
      !isNaN(numerador) &&
      !isNaN(denominador)
    ) {
      return numerador / denominador;
    }
  }

  const num = parseFloat(limpo);

  return isNaN(num) ? null : num;
};

function categorizarIngredienteAutomaticamente(
  nome: string
): CategoriaIngrediente {
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
  novosIngredientes: {
    nome: string;
    quantidade: string;
    unidade: string;
    categoria?: CategoriaIngrediente;
    imagemUri?: string;
  }[],
  lojaId: string
): ItemListaCompras[] {
  // Separa os itens da loja selecionada dos itens das demais lojas.
  const itensDeOutrasLojas = listaExistente.filter(
    (item) => item.lojaId !== lojaId
  );

  const listaAtualizada = listaExistente.filter(
    (item) => item.lojaId === lojaId
  );

  novosIngredientes.forEach((novo) => {
    const nomeNormalizado = novo.nome.trim().toLowerCase();
    const unidadeNormalizada = (novo.unidade || 'unidade')
      .trim()
      .toLowerCase();

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

      const qtdAtual =
        parseFloat(itemExistente.quantidade.replace(',', '.')) || 0;

      const qtdNova =
        parseFloat(novo.quantidade.replace(',', '.')) || 0;

      if (
        !isNaN(qtdAtual) &&
        !isNaN(qtdNova) &&
        qtdAtual > 0 &&
        qtdNova > 0
      ) {
        listaAtualizada[indexExistente] = {
          ...itemExistente,
          quantidade: String(
            Math.round((qtdAtual + qtdNova) * 100) / 100
          ),
          categoria:
            itemExistente.categoria !== 'Outros'
              ? itemExistente.categoria
              : categoriaFinal,
          comprado: false,
        };
      } else {
        listaAtualizada[indexExistente] = {
          ...itemExistente,
          quantidade: `${itemExistente.quantidade} + ${novo.quantidade}`,
          categoria:
            itemExistente.categoria !== 'Outros'
              ? itemExistente.categoria
              : categoriaFinal,
          comprado: false,
        };
      }
    } else {
      listaAtualizada.push({
        id: `${Date.now()}-${Math.random()}`,
        nome: novo.nome.trim(),
        quantidade: novo.quantidade || '1',
        unidade: novo.unidade || 'unidade',
        categoria: categoriaFinal,
        comprado: false,
        lojaId,
        imagemUri: novo.imagemUri,
      });
    }
  });

  // Reúne novamente todas as listas sem misturar os estabelecimentos.
  return [...itensDeOutrasLojas, ...listaAtualizada];
}

export function ShoppingListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [todosItens, setTodosItens] = useState<ItemListaCompras[]>([]);

  const [estabelecimentos, setEstabelecimentos] = useState<
    Estabelecimento[]
  >([ESTABELECIMENTO_PADRAO]);

  const [estabelecimentoSelecionadoId, setEstabelecimentoSelecionadoId] =
    useState<string>(ESTABELECIMENTO_PADRAO.id);

  const [carregado, setCarregado] = useState(false);

  const { adicionarMultiplosItens } = usePantry();

  // Carrega as listas e os estabelecimentos salvos.
  useEffect(() => {
    async function carregar() {
      const dados = await carregarDadosListaCompras();

      setTodosItens(dados.itens);
      setEstabelecimentos(dados.estabelecimentos);
      setEstabelecimentoSelecionadoId(
        dados.estabelecimentoSelecionadoId
      );

      setCarregado(true);
    }

    carregar();
  }, []);

  // Salva os dados sempre que houver alterações.
  useEffect(() => {
    if (!carregado) return;

    salvarDadosListaCompras({
      itens: todosItens,
      estabelecimentos,
      estabelecimentoSelecionadoId,
    });
  }, [
    todosItens,
    estabelecimentos,
    estabelecimentoSelecionadoId,
    carregado,
  ]);

  // A tela recebe somente os itens da loja selecionada.
  const itens = todosItens.filter(
    (item) => item.lojaId === estabelecimentoSelecionadoId
  );

  // Alterna entre estabelecimentos sem misturar as listas.
  const selecionarEstabelecimento = (id: string) => {
    const existe = estabelecimentos.some((loja) => loja.id === id);

    if (existe) {
      setEstabelecimentoSelecionadoId(id);
    }
  };

  const adicionarEstabelecimento = (
    nome: string
  ): Estabelecimento | null => {
    const nomeFormatado = nome.trim();

    if (!nomeFormatado) return null;

    const nomeJaExiste = estabelecimentos.some(
      (loja) =>
        loja.nome.trim().toLowerCase() ===
        nomeFormatado.toLowerCase()
    );

    if (nomeJaExiste) return null;

    const novoEstabelecimento: Estabelecimento = {
      id: `loja-${Date.now()}-${Math.random()}`,
      nome: nomeFormatado,
    };

    setEstabelecimentos((anteriores) => [
      ...anteriores,
      novoEstabelecimento,
    ]);

    setEstabelecimentoSelecionadoId(novoEstabelecimento.id);

    return novoEstabelecimento;
  };

  // Exclui um estabelecimento, podendo transferir seus itens
  // para o estabelecimento padrão.
  const excluirEstabelecimento = (
    id: string,
    transferirItens: boolean
  ): boolean => {
    // Impede a exclusão do estabelecimento padrão.
    if (id === ESTABELECIMENTO_PADRAO.id) {
      return false;
    }

    const estabelecimentoExiste = estabelecimentos.some(
      (loja) => loja.id === id
    );

    if (!estabelecimentoExiste) {
      return false;
    }

    setTodosItens((anteriores) =>
      transferirItens
        ? anteriores.map((item) =>
          item.lojaId === id
            ? { ...item, lojaId: ESTABELECIMENTO_PADRAO.id }
            : item
        )
        : anteriores.filter((item) => item.lojaId !== id)
    );

    setEstabelecimentos((anteriores) =>
      anteriores.filter((loja) => loja.id !== id)
    );

    // Se a lista excluída estava selecionada, volta para Meu mercado.
    if (estabelecimentoSelecionadoId === id) {
      setEstabelecimentoSelecionadoId(ESTABELECIMENTO_PADRAO.id);
    }

    return true;
  };

  const adicionarItemManual = (novo: DadosNovoItem) => {
    const categoriaFinal =
      novo.categoria && novo.categoria !== 'Outros'
        ? novo.categoria
        : categorizarIngredienteAutomaticamente(novo.nome);

    const itemFormatado: ItemListaCompras = {
      ...novo,
      categoria: categoriaFinal,
      id: `${Date.now()}-${Math.random()}`,
      comprado: false,
      lojaId: estabelecimentoSelecionadoId,
    };

    setTodosItens((anteriores) => [...anteriores, itemFormatado]);
  };

  // Edita um item sem alterar o estabelecimento ao qual pertence.
  const editarItemManual = (
    id: string,
    itemAtualizado: Partial<Omit<ItemListaCompras, 'id' | 'lojaId'>>
  ) => {
    setTodosItens((anteriores) =>
      anteriores.map((item) =>
        item.id === id &&
          item.lojaId === estabelecimentoSelecionadoId
          ? { ...item, ...itemAtualizado }
          : item
      )
    );
  };

  const removerItem = (id: string) => {
    setTodosItens((anteriores) =>
      anteriores.filter(
        (item) =>
          !(
            item.id === id &&
            item.lojaId === estabelecimentoSelecionadoId
          )
      )
    );
  };

  const alternarComprado = (id: string) => {
    setTodosItens((anteriores) =>
      anteriores.map((item) =>
        item.id === id &&
          item.lojaId === estabelecimentoSelecionadoId
          ? { ...item, comprado: !item.comprado }
          : item
      )
    );
  };

  // Envia os itens comprados para a despensa e os remove desta lista.
  const limparComprados = () => {
    const comprados = itens.filter((item) => item.comprado);

    if (comprados.length === 0) return;

    adicionarMultiplosItens(
      comprados.map((item) => ({
        nome: item.nome,
        quantidade: item.quantidade,
        unidade: item.unidade,
        categoria: item.categoria,
      }))
    );

    const idsComprados = new Set(comprados.map((item) => item.id));

    setTodosItens((anteriores) =>
      anteriores.filter((item) => !idsComprados.has(item.id))
    );
  };

  // Remove somente os itens marcados da lista selecionada.
  const removerSelecionadosApenas = () => {
    const idsComprados = new Set(
      itens.filter((item) => item.comprado).map((item) => item.id)
    );

    setTodosItens((anteriores) =>
      anteriores.filter((item) => !idsComprados.has(item.id))
    );
  };

  // Limpa somente a lista do estabelecimento selecionado.
  const limparTudo = () => {
    setTodosItens((anteriores) =>
      anteriores.filter(
        (item) => item.lojaId !== estabelecimentoSelecionadoId
      )
    );
  };

  // Marca ou desmarca todos os itens da lista selecionada.
  const alternarSelecionarTodos = (comprado?: boolean) => {
    const todosJaComprados =
      itens.length > 0 && itens.every((item) => item.comprado);

    const novoValor =
      comprado !== undefined ? comprado : !todosJaComprados;

    setTodosItens((anteriores) =>
      anteriores.map((item) =>
        item.lojaId === estabelecimentoSelecionadoId
          ? { ...item, comprado: novoValor }
          : item
      )
    );
  };

  const removerSelecionados = () => {
    removerSelecionadosApenas();
  };

  // Gera a lista a partir de uma receita.
  const gerarDaReceita = (
    receita: Receita,
    porcoesAjustadas?: number
  ) => {
    if (!receita.ingredientes) return;

    const porcaoBase = Number(receita.porcoes || 2);
    const porcaoAlvo = Number(porcoesAjustadas || porcaoBase);

    const fator = porcaoBase > 0 ? porcaoAlvo / porcaoBase : 1;

    const novos = receita.ingredientes.map((ing: any) => {
      const qtdOriginal =
        ing.qtd !== undefined ? ing.qtd : ing.quantidade || 1;

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
        categoria:
          ing.categoria ||
          categorizarIngredienteAutomaticamente(nomeItem),
      };
    });

    setTodosItens((anteriores) =>
      consolidarIngredientes(
        anteriores,
        novos,
        estabelecimentoSelecionadoId
      )
    );
  };

  // Gera a lista com os ingredientes do planejamento semanal.
  const gerarDoPlanejamentoSemanal = (planoSemanal: PlanoSemanal) => {
    if (!planoSemanal) return;

    const todosOsNovosIngredientes: any[] = [];

    // Descobre o índice do dia de hoje (0 = Segunda, ..., 6 = Domingo).
    const hojeIndex =
      new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

    const entradasPlano: { dia: any; index: number }[] =
      Array.isArray(planoSemanal)
        ? (planoSemanal as any[]).map((dia, index) => ({
          dia,
          index,
        }))
        : Object.entries(
          planoSemanal as unknown as Record<string, any>
        ).map(([key, dia]) => ({
          dia,
          index: Number(key),
        }));

    entradasPlano.forEach(({ dia, index }) => {
      // Considera somente os dias de hoje em diante.
      if (!dia || index < hojeIndex) return;

      const refeicoesDoDia = [
        dia.cafeDaManha,
        dia.almoco,
        dia.jantar,
        ...(dia.extras || []),
      ].filter(Boolean);

      refeicoesDoDia.forEach((refeicao: any) => {
        if (!refeicao || !refeicao.ingredientes) return;
        console.log('DIAGNÓSTICO GERAÇÃO SEMANAL:', {
          nome: refeicao.nome || refeicao.titulo,
          porcoes: refeicao.porcoes,
          porcoesOriginal: refeicao.porcoesOriginal,
          porcoesBase: refeicao.porcoesBase,
          receitaOriginal: refeicao.receitaOriginal,
          ingredientes: refeicao.ingredientes,
        });

        const porcaoAlvo = Number(refeicao.porcoes || 1);

        const porcaoBase = Number(
          refeicao.receitaOriginal?.porcoes ||
          refeicao.porcoesOriginal ||
          refeicao.porcoesBase ||
          3
        );

        const fator =
          porcaoBase > 0 ? porcaoAlvo / porcaoBase : 1;

        refeicao.ingredientes.forEach((ing: any) => {
          const ingBase = ing.ingredienteOriginal || ing;

          const qtdOriginal =
            ingBase.qtd !== undefined
              ? ingBase.qtd
              : ingBase.quantidade || 1;

          const numBase =
            converterQuantidadeParaNumero(qtdOriginal);

          let qtdStr = String(qtdOriginal);

          if (numBase !== null) {
            const qtdCalculada = numBase * fator;

            qtdStr = String(
              Math.round(qtdCalculada * 100) / 100
            );
          }

          const nomeItem =
            ingBase.nome || ingBase.item || 'Ingrediente';

          todosOsNovosIngredientes.push({
            nome: nomeItem,
            quantidade: qtdStr,
            unidade: ingBase.unidade || 'unidade',
            categoria:
              ingBase.categoria ||
              categorizarIngredienteAutomaticamente(nomeItem),
          });
        });
      });
    });

    setTodosItens((anteriores) =>
      consolidarIngredientes(
        anteriores,
        todosOsNovosIngredientes,
        estabelecimentoSelecionadoId
      )
    );
  };

  return (
    <ShoppingListContext.Provider
      value={{
        itens,
        estabelecimentos,
        estabelecimentoSelecionadoId,
        selecionarEstabelecimento,
        adicionarEstabelecimento,
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
        excluirEstabelecimento,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export const useShoppingList = () => useContext(ShoppingListContext);
