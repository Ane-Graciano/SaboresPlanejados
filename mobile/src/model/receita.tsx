export interface Ingrediente {
  qtd?: number | string;
  unidade?: string;
  nome: string;
}

export interface Receita {
  id: string;
  titulo: string;
  tempo: string;
  categoriaId: string;
  isSaudavel: boolean;
  imagem: string;
  imagens?: string[];
  avaliacao?: number;
  avaliacoesCount?: number;
  dificuldade?: string;
  porcoes?: number;
  descricao: string;
  ingredientes: Ingrediente[];
  passos?: string[];
  dicas?: string[];
  historia?: string;
  chef: string;
  tipoPrato: string;
  culinaria: string;
  temas?: string[];
  estacoes?: Estacao[];
  epocas?: Epoca[];
}


export type Estacao =
  | 'verao'
  | 'outono'
  | 'inverno'
  | 'primavera';

export type Epoca =
  | 'natal'
  | 'pascoa'
  | 'ano_novo'
  | 'festa_junina';

export interface Categoria {
  id: string;
  emoji: string;
  label: string;
}

export const CATEGORIAS: Categoria[] = [
  { id: '1', emoji: '🍝', label: 'Massas' },
  { id: '2', emoji: '🥩', label: 'Carnes' },
  { id: '3', emoji: '🥗', label: 'Saladas' },
  { id: '4', emoji: '🍮', label: 'Sobremesas' },
  { id: '5', emoji: '🥤', label: 'Bebidas' },
  { id: '6', emoji: '☕', label: 'Café da manhã' },
];

export const FILTROS_RAPIDOS: string[] = [
  'Hoje',
  'Rápido',
  'Saudável',
];
