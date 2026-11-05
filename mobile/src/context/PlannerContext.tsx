import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlanoSemanal, Refeicao, TipoRefeicao } from '../types/planner';
import { PLANO_SEMANAL_INICIAL } from '../data/mockPlanejador';
import { getPlanoSalvo, salvarPlanoStorage } from '../utils/storage';

interface PlannerContextData {
  plano: PlanoSemanal;
  diaSelecionado: number;
  totalDias: number;
  setDiaSelecionado: (dia: number) => void;
  setTotalDias: (dias: number) => void;
  removerRefeicao: (indiceDia: number, chaveOuIndice: string | number) => void;
  adicionarRefeicao: (indiceDia: number, chaveRefeicao: TipoRefeicao, refeicao: Refeicao) => void;
  atualizarPorcoes: (indiceDia: number, chaveOuIndice: string | number, porcoes: number) => void;
  iniciarAdicaoRefeicao: (dia: number, tipo: TipoRefeicao) => void;
  adicionarRefeicaoNoPlano: (receita: Refeicao) => void;
  desfazer: () => void;
  refazer: () => void;
  podeDesfazer: boolean;
  podeRefazer: boolean;
  descricaoUltimaAcao: string | null;
}

const PlannerContext = createContext<PlannerContextData>({} as PlannerContextData);

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const [diaSelecionado, setDiaSelecionado] = useState(0);
  const [totalDias, setTotalDias] = useState(7);

  const [passado, setPassado] = useState<PlanoSemanal[]>([]);
  const [presente, setPresente] = useState<PlanoSemanal>(PLANO_SEMANAL_INICIAL);
  const [futuro, setFuturo] = useState<PlanoSemanal[]>([]);
  const [descricaoUltimaAcao, setDescricaoUltimaAcao] = useState<string | null>(null);

  const [_, setDiaParaAdicionar] = useState<number>(0);
  const [slotParaAdicionar, setSlotParaAdicionar] = useState<TipoRefeicao>('cafeDaManha');

  // 1. Carrega o plano salvo no AsyncStorage ao iniciar o aplicativo
  useEffect(() => {
    async function carregarPlano() {
      const planoSalvo = await getPlanoSalvo();
      setPresente(planoSalvo);
    }
    carregarPlano();
  }, []);

  const iniciarAdicaoRefeicao = (dia: number, tipo: TipoRefeicao) => {
    setDiaParaAdicionar(dia);
    setSlotParaAdicionar(tipo);
  };

  // 2. Salva automaticamente no AsyncStorage a cada nova alteração
  const salvarNovoEstado = (novoPlano: PlanoSemanal, descricao: string) => {
    setPassado((prev) => [...prev, presente]);
    setPresente(novoPlano);
    setFuturo([]);
    setDescricaoUltimaAcao(descricao);
    
    salvarPlanoStorage(novoPlano);
  };

  const removerRefeicao = (dia: number, chaveOuIndice: string | number) => {
    const diaAtual = presente[dia];
    if (!diaAtual) return;

    let novoDia;
    if (typeof chaveOuIndice === 'number') {
      novoDia = {
        ...diaAtual,
        extras: diaAtual.extras.filter((_, i) => i !== chaveOuIndice),
      };
    } else {
      if (chaveOuIndice === 'extra') return;
      novoDia = {
        ...diaAtual,
        [chaveOuIndice]: null,
      };
    }

    const novoPlano = {
      ...presente,
      [dia]: novoDia,
    };
    salvarNovoEstado(novoPlano, 'Refeição removida');
  };

  const atualizarPorcoes = (indiceDia: number, chaveOuIndice: string | number, porcoes: number) => {
    const diaAtual = presente[indiceDia];
    if (!diaAtual) return;

    let novoDia;
    if (typeof chaveOuIndice === 'number') {
      const novasExtras = [...diaAtual.extras];
      if (novasExtras[chaveOuIndice]) {
        novasExtras[chaveOuIndice] = { ...novasExtras[chaveOuIndice], porcoes };
      }
      novoDia = { ...diaAtual, extras: novasExtras };
    } else {
      const refeicao = diaAtual[chaveOuIndice as 'cafeDaManha' | 'almoco' | 'jantar'];
      if (!refeicao) return;
      const refeicaoAtualizada = { ...refeicao, porcoes };
      novoDia = { ...diaAtual, [chaveOuIndice]: refeicaoAtualizada };
    }

    const novoPlano = {
      ...presente,
      [indiceDia]: novoDia,
    };
    salvarNovoEstado(novoPlano, 'Porções atualizadas');
  };

  const adicionarRefeicao = (indiceDia: number, chaveRefeicao: TipoRefeicao, refeicao: Refeicao) => {
    const diaAtual = presente[indiceDia] || { cafeDaManha: null, almoco: null, jantar: null, extras: [] };
    let novoDia;

    const receitaFormatada = {
      ...refeicao,
      nome: refeicao.nome || refeicao.titulo || 'Receita sem nome',
      titulo: refeicao.titulo || refeicao.nome || 'Receita sem nome',
    };

    if (chaveRefeicao === 'extra') {
      novoDia = {
        ...diaAtual,
        extras: [...diaAtual.extras, receitaFormatada],
      };
    } else {
      novoDia = {
        ...diaAtual,
        [chaveRefeicao]: receitaFormatada,
      };
    }

    const novoPlano = {
      ...presente,
      [indiceDia]: novoDia,
    };
    salvarNovoEstado(novoPlano, 'Refeição adicionada');
  };

  const adicionarRefeicaoNoPlano = (novaReceita: Refeicao) => {
    const diaAtual = presente[diaSelecionado] || { cafeDaManha: null, almoco: null, jantar: null, extras: [] };
    let novoDia;

    const receitaFormatada = {
      ...novaReceita,
      nome: novaReceita.nome || novaReceita.titulo || 'Receita sem nome',
      titulo: novaReceita.titulo || novaReceita.nome || 'Receita sem nome',
    };

    if (slotParaAdicionar && slotParaAdicionar !== 'extra') {
      novoDia = {
        ...diaAtual,
        [slotParaAdicionar]: receitaFormatada,
      };
    } else {
      novoDia = {
        ...diaAtual,
        extras: [...diaAtual.extras, receitaFormatada],
      };
    }

    const novoPlano = {
      ...presente,
      [diaSelecionado]: novoDia,
    };
    salvarNovoEstado(novoPlano, 'Refeição adicionada ao plano');
  };

  const desfazer = () => {
    if (passado.length === 0) return;
    const anterior = passado[passado.length - 1];
    const novoPassado = passado.slice(0, passado.length - 1);

    setFuturo((prev) => [presente, ...prev]);
    setPresente(anterior);
    setPassado(novoPassado);
    setDescricaoUltimaAcao('Ação desfeita');
    salvarPlanoStorage(anterior);
  };

  const refazer = () => {
    if (futuro.length === 0) return;
    const proximo = futuro[0];
    const novoFuturo = futuro.slice(1);

    setPassado((prev) => [...prev, presente]);
    setPresente(proximo);
    setFuturo(novoFuturo);
    setDescricaoUltimaAcao('Ação refeita');
    salvarPlanoStorage(proximo);
  };

  return (
    <PlannerContext.Provider
      value={{
        plano: presente,
        diaSelecionado,
        totalDias,
        setDiaSelecionado,
        setTotalDias,
        removerRefeicao,
        adicionarRefeicao,
        atualizarPorcoes,
        iniciarAdicaoRefeicao,
        adicionarRefeicaoNoPlano,
        desfazer,
        refazer,
        podeDesfazer: passado.length > 0,
        podeRefazer: futuro.length > 0,
        descricaoUltimaAcao,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export const usePlanner = () => useContext(PlannerContext);