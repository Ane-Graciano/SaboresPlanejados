export interface Receita {
  id: string;
  titulo: string;
  tempo: string;
  dataAdicao: string;

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

export interface Ingrediente {
  qtd?: number | string;
  unidade?: string;
  nome: string;
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