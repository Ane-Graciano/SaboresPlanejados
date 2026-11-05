export type TipoRefeicaoFixa = 'cafeDaManha' | 'almoco' | 'jantar';
export type TipoRefeicao = TipoRefeicaoFixa | 'extra';

export interface Refeicao {
  id: string;
  nome?: string;
  titulo?: string;
  tempo: string;
  imagem: string;
  porcoes: number;
  categoria?: string; 
}

export type PlanoDia = {
  cafeDaManha: Refeicao | null;
  almoco: Refeicao | null;
  jantar: Refeicao | null;
  extras: Refeicao[];
};

export type PlanoSemanal = {
  [dia: number]: PlanoDia;
};