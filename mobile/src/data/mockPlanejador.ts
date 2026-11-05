import { PlanoSemanal } from '../types/planner';

const DIA_VAZIO = {
  cafeDaManha: null,
  almoco: null,
  jantar: null,
  extras: [],
};

export const PLANO_SEMANAL_INICIAL: PlanoSemanal = {
  0: { ...DIA_VAZIO },
  1: { ...DIA_VAZIO },
  2: { ...DIA_VAZIO },
  3: { ...DIA_VAZIO },
  4: { ...DIA_VAZIO },
  5: { ...DIA_VAZIO },
  6: { ...DIA_VAZIO },
};