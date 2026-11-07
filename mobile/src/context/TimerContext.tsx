
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { useAudioPlayer } from 'expo-audio';
import { TimerEntry, TimerStatus } from '../types/timer';

interface TimerContextData {
  timers: TimerEntry[];
  criarTimer: (
    nome: string,
    totalSegundos: number,
    receitaId?: string,
    etapaIndex?: number
  ) => string | null;
  alternarPausa: (id: string) => void;
  cancelarTimer: (id: string) => void;
  dispensarTimer: (id: string) => void;
  reiniciarTimer: (id: string) => void;
  timersAtivosCount: number;
  timersConcluidosCount: number;
}

const TimerContext = createContext<TimerContextData>(
  {} as TimerContextData
);

export function TimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [timers, setTimers] = useState<TimerEntry[]>([]);

  const player = useAudioPlayer(
    'https://sfxmint.com/dl/ui-chime-70.mp3'
  );
  
  const existeAlarmeAtivo = timers.some(
    (timer) =>
      timer.status === 'done' && !timer.dismissed
  );

  // Controla a reprodução do alarme
  useEffect(() => {
    try {
      if (existeAlarmeAtivo) {
        player.volume = 1;
        player.loop = true;
        player.seekTo(0);
        player.play();
      } else {
        player.pause();
        player.loop = false;
        player.seekTo(0);
      }
    } catch (error) {
      console.log('Erro ao controlar alarme:', error);
    }

    return () => {
      if (!existeAlarmeAtivo) {
        player.pause();
        player.loop = false;
      }
    };
  }, [existeAlarmeAtivo, player]);

  // Tick global a cada 1 segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.status !== 'running') {
            return timer;
          }

          const proximo = timer.remaining - 1;

          if (proximo <= 0) {
            return {
              ...timer,
              remaining: 0,
              status: 'done' as TimerStatus,
            };
          }

          return {
            ...timer,
            remaining: proximo,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Criar timer, opcionalmente vinculado a uma etapa da receita
  const criarTimer = useCallback(
    (
      nome: string,
      totalSegundos: number,
      receitaId?: string,
      etapaIndex?: number
    ): string | null => {
      if (totalSegundos <= 0) return null;

      const id = String(Date.now() + Math.random());

      const novo: TimerEntry = {
        id,
        name: nome.trim() || 'Timer',
        totalSeconds: totalSegundos,
        remaining: totalSegundos,
        status: 'running',
        dismissed: false,
        receitaId,
        etapaIndex,
      };

      setTimers((prev) => [...prev, novo]);

      return id;
    },
    []
  );

  // Pausar ou continuar timer
  const alternarPausa = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.id !== id) return timer;

        if (timer.status === 'running') {
          return { ...timer, status: 'paused' };
        }

        if (timer.status === 'paused') {
          return { ...timer, status: 'running' };
        }

        return timer;
      })
    );
  }, []);

  // Cancelar timer
  const cancelarTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.filter((timer) => timer.id !== id)
    );
  }, []);

  // Dispensar timer concluído
  const dispensarTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? { ...timer, dismissed: true }
          : timer
      )
    );
  }, []);

  // Reiniciar timer
  const reiniciarTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? {
            ...timer,
            remaining: timer.totalSeconds,
            status: 'running',
            dismissed: false,
          }
          : timer
      )
    );
  }, []);

  // Contadores
  const visiveis = timers.filter(
    (timer) => !timer.dismissed
  );

  const timersAtivosCount = visiveis.length;

  const timersConcluidosCount = visiveis.filter(
    (timer) => timer.status === 'done'
  ).length;

  return (
    <TimerContext.Provider
      value={{
        timers,
        criarTimer,
        alternarPausa,
        cancelarTimer,
        dispensarTimer,
        reiniciarTimer,
        timersAtivosCount,
        timersConcluidosCount,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export const useTimer = () => useContext(TimerContext);
