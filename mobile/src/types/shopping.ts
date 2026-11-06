export type CategoriaIngrediente =
  | 'Hortifruti'
  | 'Carnes'
  | 'Laticínios'
  | 'Mercearia'
  | 'Bebidas'
  | 'Outros';

export interface ItemListaCompras {
  id: string;
  nome: string;
  quantidade: string;
  unidade: string;
  categoria: CategoriaIngrediente;
  comprado: boolean;
}