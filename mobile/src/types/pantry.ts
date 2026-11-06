import { CategoriaIngrediente } from './shopping';

export interface ItemDespensa {
  id: string;
  nome: string;
  quantidade: string;
  unidade: string;
  categoria: CategoriaIngrediente;
}

export interface MatchReceita {
  receitaId: string;
  itensPossuidos: number;
  totalItens: number;
  percentualMatch: number;
  podeCozinharIntegralmente: boolean;
  faltandoCount: number;
}