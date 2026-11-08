import React, { createContext, useContext, useState, useEffect } from 'react';
import { ItemDespensa, MatchReceita } from '../types/pantry';
import { CategoriaIngrediente } from '../types/shopping';
import { getDespensaSalva, salvarDespensaStorage } from '../utils/pantryStorage';
import { Receita, Ingrediente } from '../model/receita';

interface PantryContextData {
  itens: ItemDespensa[];
  adicionarItem: (item: Omit<ItemDespensa, 'id'>) => void;
  adicionarMultiplosItens: (novosItens: Omit<ItemDespensa, 'id'>[]) => void;
  editarItem: (id: string, itemAtualizado: Partial<Omit<ItemDespensa, 'id'>>) => void;
  removerItem: (id: string) => void;
  limparTudo: () => void;
  possuiIngrediente: (nomeIngrediente: string) => boolean;
  calcularMatchReceita: (receita: Receita) => MatchReceita;
  consumirIngredientes: (ingredientes: Ingrediente[]) => void;
}

const PantryContext = createContext<PantryContextData>({} as PantryContextData);

function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizarUnidade(unidade: string): string {
  const valor = normalizarTexto(unidade).replace(/\./g, '');

  switch (valor) {
    case 'g':
    case 'gr':
    case 'grama':
    case 'gramas':
      return 'g';

    case 'kg':
    case 'quilo':
    case 'quilos':
    case 'quilograma':
    case 'quilogramas':
      return 'kg';

    case 'ml':
    case 'mililitro':
    case 'mililitros':
      return 'ml';

    case 'l':
    case 'litro':
    case 'litros':
      return 'l';

    case 'un':
    case 'und':
    case 'unid':
    case 'unidade':
    case 'unidades':
      return 'unidade';

    case 'xic':
    case 'xicara':
    case 'xicaras':
      return 'xicara';

    case 'cs':
    case 'c sopa':
    case 'colher sopa':
    case 'colher de sopa':
    case 'colheres de sopa':
      return 'colher de sopa';

    case 'cc':
    case 'c cha':
    case 'colher cha':
    case 'colher de cha':
    case 'colheres de cha':
      return 'colher de cha';

    default:
      return valor;
  }
}

// Converte números, decimais e frações em valores numéricos.
function converterQuantidade(valor: string | number | undefined): number | null {
  if (valor === undefined || valor === null) {
    return null;
  }

  if (typeof valor === 'number') {
    return Number.isFinite(valor) && valor >= 0 ? valor : null;
  }

  const texto = String(valor).trim().replace(',', '.');

  if (!texto || /a gosto|quanto baste/i.test(texto)) {
    return null;
  }

  // Exemplo: 1 1/2
  const fracaoMista = texto.match(/^(\d+)\s+(\d+)\/(\d+)$/);

  if (fracaoMista) {
    const inteiro = Number(fracaoMista[1]);
    const numerador = Number(fracaoMista[2]);
    const denominador = Number(fracaoMista[3]);

    if (denominador === 0) return null;

    return inteiro + numerador / denominador;
  }

  // Exemplo: 1/2
  const fracao = texto.match(/^(\d+)\/(\d+)$/);

  if (fracao) {
    const numerador = Number(fracao[1]);
    const denominador = Number(fracao[2]);

    if (denominador === 0) return null;

    return numerador / denominador;
  }

  const numero = Number(texto);

  return Number.isFinite(numero) && numero >= 0
    ? numero
    : null;
}

function formatarQuantidade(valor: number): string {
  return String(Math.round(valor * 1000) / 1000);
}

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
            categoria: itemExistente.categoria !== 'Outros'
              ? itemExistente.categoria
              : categoriaFinal,
          };
        } else {
          listaAtualizada[indexExistente] = {
            ...itemExistente,
            quantidade: `${itemExistente.quantidade} + ${novo.quantidade}`,
            categoria: itemExistente.categoria !== 'Outros'
              ? itemExistente.categoria
              : categoriaFinal,
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

  const editarItem = (
    id: string,
    itemAtualizado: Partial<Omit<ItemDespensa, 'id'>>
  ) => {
    const novos = itens.map((item) =>
      item.id === id ? { ...item, ...itemAtualizado } : item
    );

    atualizarEstado(novos);
  };

  const removerItem = (id: string) => {
    atualizarEstado(itens.filter((item) => item.id !== id));
  };

  const limparTudo = () => {
    atualizarEstado([]);
  };

  const possuiIngrediente = (nomeIngrediente: string): boolean => {
    const nomeNormalizado = normalizarTexto(nomeIngrediente);

    return itens.some((item) => {
      const itemNome = normalizarTexto(item.nome);
      const quantidade = converterQuantidade(item.quantidade);

      if (quantidade === 0) return false;

      return (
        itemNome.includes(nomeNormalizado) ||
        nomeNormalizado.includes(itemNome)
      );
    });
  };

  // Desconta da despensa os ingredientes utilizados na receita.
  const consumirIngredientes = (ingredientes: Ingrediente[]) => {
    if (!ingredientes || ingredientes.length === 0) return;

    const listaAtualizada = [...itens];
    let houveAlteracao = false;

    ingredientes.forEach((ingrediente) => {
      const nomeReceita = normalizarTexto(ingrediente.nome);
      const unidadeReceita = normalizarUnidade(ingrediente.unidade || '');
      const quantidadeReceita = converterQuantidade(ingrediente.qtd);

      // Não desconta ingredientes sem quantidade ou unidade identificável.
      if (
        !nomeReceita ||
        !unidadeReceita ||
        quantidadeReceita === null ||
        quantidadeReceita <= 0
      ) {
        return;
      }

      let restante = quantidadeReceita;

      // Permite descontar de mais de um registro do mesmo ingrediente.
      for (let i = 0; i < listaAtualizada.length && restante > 0; i++) {
        const item = listaAtualizada[i];

        const mesmoNome =
          normalizarTexto(item.nome) === nomeReceita;

        const mesmaUnidade =
          normalizarUnidade(item.unidade) === unidadeReceita;

        if (!mesmoNome || !mesmaUnidade) continue;

        const quantidadeDisponivel = converterQuantidade(item.quantidade);

        // Não altera quantidades que não podem ser interpretadas.
        if (quantidadeDisponivel === null || quantidadeDisponivel <= 0) {
          continue;
        }

        const quantidadeConsumida = Math.min(
          quantidadeDisponivel,
          restante
        );

        const novaQuantidade = Math.max(
          0,
          quantidadeDisponivel - quantidadeConsumida
        );

        restante = Math.max(0, restante - quantidadeConsumida);
        houveAlteracao = true;

        // Remove o item quando seu estoque chega a zero.
        if (novaQuantidade <= 0.000001) {
          listaAtualizada.splice(i, 1);
          i--;
        } else {
          listaAtualizada[i] = {
            ...item,
            quantidade: formatarQuantidade(novaQuantidade),
          };
        }
      }
    });

    if (houveAlteracao) {
      atualizarEstado(listaAtualizada);
    }
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
        consumirIngredientes,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
}

export const usePantry = () => useContext(PantryContext);