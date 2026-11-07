
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTimer } from '../context/TimerContext';

interface ItemPassoProps {
  index: number;
  receitaId: string;
  textoPasso: string;
  isConcluido: boolean;
  onToggle: () => void;
  duracaoDetectada?: number | null;
  onIniciarTimer?: (duracao: number) => string | null;
}

export default function ItemPasso({
  index,
  receitaId,
  textoPasso,
  isConcluido,
  onToggle,
  duracaoDetectada,
  onIniciarTimer,
}: ItemPassoProps) {
  const {
    timers,
    alternarPausa,
    cancelarTimer,
    dispensarTimer,
    reiniciarTimer,
  } = useTimer();

  // Localiza o timer diretamente no contexto global
  const timer = timers.find(
    (item) =>
      item.receitaId === receitaId &&
      item.etapaIndex === index &&
      !item.dismissed
  );

  const formatarDuracao = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    if (horas > 0) {
      return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
    }

    return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
  };

  const iniciarTimer = () => {
    if (!duracaoDetectada || !onIniciarTimer || timer) return;

    onIniciarTimer(duracaoDetectada);
  };

  const cancelar = () => {
    if (!timer) return;

    cancelarTimer(timer.id);
  };

  const dispensar = () => {
    if (!timer) return;

    dispensarTimer(timer.id);
  };

  const reiniciar = () => {
    if (!timer) return;

    reiniciarTimer(timer.id);
  };

  const progresso = timer
    ? Math.max(
        0,
        Math.min(1, timer.remaining / timer.totalSeconds)
      )
    : 0;

  return (
    <View style={[styles.stepCard, isConcluido && styles.stepCardDone]}>
      <View style={styles.stepNumberCol}>
        <View style={[styles.stepBadge, isConcluido && styles.stepBadgeDone]}>
          {isConcluido ? (
            <Ionicons name="checkmark" size={14} color="#FAF6F0" />
          ) : (
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          )}
        </View>
      </View>

      <View style={styles.stepContent}>
        <Text style={[styles.stepText, isConcluido && styles.stepTextDone]}>
          {textoPasso}
        </Text>

        {/* Botão para iniciar o timer */}
        {!timer && duracaoDetectada && onIniciarTimer && (
          <TouchableOpacity
            style={styles.timerButton}
            onPress={iniciarTimer}
            activeOpacity={0.7}
          >
            <Ionicons name="timer-outline" size={18} color="#2E4A2E" />
            <Text style={styles.timerButtonText}>
              Iniciar timer de {formatarDuracao(duracaoDetectada)}
            </Text>
          </TouchableOpacity>
        )}

        {/* Timer em andamento ou pausado */}
        {timer && timer.status !== 'done' && (
          <View style={styles.timerCard}>
            <View style={styles.timerHeader}>
              <View style={styles.timerTitleRow}>
                <Ionicons name="timer-outline" size={19} color="#C46B3E" />
                <Text style={styles.timerTitle}>Timer desta etapa</Text>
              </View>

              <Text style={styles.timerStatus}>
                {timer.status === 'running' ? 'Em andamento' : 'Pausado'}
              </Text>
            </View>

            <Text style={styles.timerCountdown}>
              {formatarDuracao(timer.remaining)}
            </Text>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progresso * 100}%` },
                ]}
              />
            </View>

            <View style={styles.timerActions}>
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={() => alternarPausa(timer.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={timer.status === 'running' ? 'pause' : 'play'}
                  size={16}
                  color="#FFFFFF"
                />
                <Text style={styles.pauseButtonText}>
                  {timer.status === 'running' ? 'Pausar' : 'Continuar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelar}
                activeOpacity={0.7}
              >
                <Ionicons name="close-outline" size={17} color="#8A6B58" />
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Timer concluído */}
        {timer && timer.status === 'done' && (
          <View style={styles.timerDoneCard}>
            <View style={styles.timerTitleRow}>
              <Ionicons name="checkmark-circle" size={21} color="#6B8C6B" />
              <Text style={styles.timerDoneTitle}>Tempo concluído!</Text>
            </View>

            <Text style={styles.timerDoneDescription}>
              O tempo desta etapa terminou.
            </Text>

            <View style={styles.timerActions}>
              <TouchableOpacity
                style={styles.restartButton}
                onPress={reiniciar}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh-outline" size={16} color="#2E4A2E" />
                <Text style={styles.restartButtonText}>Reiniciar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={dispensar}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Dispensar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.checkToggle}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isConcluido ? 'checkbox' : 'square-outline'}
            size={18}
            color={isConcluido ? '#6B8C6B' : '#A39385'}
          />

          <Text
            style={[
              styles.checkToggleText,
              isConcluido && styles.checkToggleTextDone,
            ]}
          >
            {isConcluido ? 'Concluído' : 'Marcar como concluído'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EFEBE4',
    borderRadius: 16,
    padding: 14,
  },
  stepCardDone: {
    backgroundColor: '#F5F9F5',
    borderColor: '#D2E3D2',
  },
  stepNumberCol: {
    alignItems: 'center',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0EAE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeDone: {
    backgroundColor: '#2E4A2E',
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5C4E43',
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: '#2C2016',
    lineHeight: 20,
  },
  stepTextDone: {
    color: '#8A7B70',
    textDecorationLine: 'line-through',
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    backgroundColor: '#EBF2EB',
    borderWidth: 1,
    borderColor: '#D2E3D2',
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
    marginTop: 12,
  },
  timerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E4A2E',
  },
  timerCard: {
    backgroundColor: '#F5EDE2',
    borderWidth: 1,
    borderColor: '#E8DCCB',
    borderRadius: 14,
    padding: 13,
    marginTop: 12,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  timerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  timerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5C4E43',
  },
  timerStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B8C6B',
  },
  timerCountdown: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2E4A2E',
    marginTop: 9,
    marginBottom: 10,
    fontVariant: ['tabular-nums'],
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#E5D9C9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6B8C6B',
    borderRadius: 5,
  },
  timerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 12,
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2E4A2E',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  pauseButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#EFEAE3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A6B58',
  },
  timerDoneCard: {
    backgroundColor: '#EBF2EB',
    borderWidth: 1,
    borderColor: '#D2E3D2',
    borderRadius: 14,
    padding: 13,
    marginTop: 12,
  },
  timerDoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E4A2E',
  },
  timerDoneDescription: {
    fontSize: 12,
    color: '#5C4E43',
    marginTop: 6,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCE9DC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  restartButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E4A2E',
  },
  checkToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  checkToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A7B70',
  },
  checkToggleTextDone: {
    color: '#6B8C6B',
  },
});
