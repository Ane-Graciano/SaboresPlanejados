import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTimer } from '../context/TimerContext';
import { ProgressRing } from '../components/ProgressRing';
import { ModalNovoTimer } from '../components/ModalNovoTimer';

function fmt(s: number) {
  const m = Math.floor(Math.max(0, s) / 60).toString().padStart(2, '0');
  const sec = (Math.max(0, s) % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function TimerScreen({ navigation }: any) {
  const [isDark] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    timers,
    criarTimer,
    alternarPausa,
    cancelarTimer,
    dispensarTimer,
    reiniciarTimer,
    timersAtivosCount,
    timersConcluidosCount,
  } = useTimer();

  const themeBg = isDark ? '#15251C' : '#FFFFFF';
  const themeText = isDark ? '#FAF6F0' : '#2C2016';
  const themeMuted = isDark ? '#A09386' : '#8C7A6B';
  const themeBorder = isDark ? '#233A2C' : '#DDD4C8';
  const cardBg = isDark ? '#1F3326' : '#F7F3EE';

  const visiveis = timers.filter((t) => !t.dismissed);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeBg }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={[styles.btnIcon, { borderColor: themeBorder, backgroundColor: cardBg }]} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={themeText} />
        </TouchableOpacity>

        <View style={styles.tituloArea}>
          <Text style={[styles.tituloHeader, { color: themeText }]}>Timers</Text>
          {timersAtivosCount > 0 && (
            <Text style={[styles.subtituloHeader, { color: themeMuted }]}>
              {timersAtivosCount} {timersAtivosCount === 1 ? 'timer ativo' : 'timers ativos'}
              {timersConcluidosCount > 0 ? ` · ${timersConcluidosCount} concluído(s)` : ''}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.btnPlus} onPress={() => setShowForm(true)}>
          <Feather name="plus" size={20} color="#FAF6F0" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Empty state */}
        {visiveis.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: cardBg }]}>
              <Feather name="clock" size={44} color="#C4B4A4" />
            </View>
            <Text style={[styles.emptyTitle, { color: themeText }]}>Nenhum timer ativo</Text>
            <Text style={[styles.emptyText, { color: themeMuted }]}>
              Crie um timer para acompanhar cada etapa do seu preparo. Você pode ter vários rodando ao mesmo tempo.
            </Text>
            <TouchableOpacity style={styles.btnNovoEmpty} onPress={() => setShowForm(true)}>
              <Feather name="plus" size={18} color="#FAF6F0" />
              <Text style={styles.txtNovoEmpty}>Novo timer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dynamic Timers List */}
        <View style={styles.listaCards}>
          {visiveis.map((timer) => {
            const progress = timer.totalSeconds > 0 ? timer.remaining / timer.totalSeconds : 0;
            const isDone = timer.status === 'done';
            const isPaused = timer.status === 'paused';
            const trackColor = isDone ? '#F5DDD5' : themeBorder;

            return (
              <View
                key={timer.id}
                style={[
                  styles.cardTimer,
                  {
                    backgroundColor: isDone ? '#FDF3ED' : cardBg,
                    borderColor: isDone ? '#F0C4AC' : themeBorder,
                  },
                ]}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.headerInfo}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: isDone ? '#C46B3E' : isPaused ? '#C4B4A4' : '#6B8C6B' },
                      ]}
                    />
                    <View>
                      <Text style={[styles.timerNome, { color: isDone ? '#A04E28' : themeText }]}>
                        {timer.name}
                      </Text>
                      <Text style={[styles.timerStatusText, { color: isDone ? '#C46B3E' : isPaused ? themeMuted : '#6B8C6B' }]}>
                        {isDone ? 'Tempo encerrado!' : isPaused ? 'Pausado' : 'Em andamento'}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.btnFechar} onPress={() => cancelarTimer(timer.id)}>
                    <Feather name="x" size={16} color={isDone ? '#C46B3E' : themeMuted} />
                  </TouchableOpacity>
                </View>

                {/* Ring + Info */}
                <View style={styles.cardCorpo}>
                  <View style={styles.ringContainer}>
                    <ProgressRing radius={52} stroke={6} progress={progress} status={timer.status} trackColor={trackColor} />
                    <View style={styles.ringOverlay}>
                      <Text style={[styles.tempoRestante, { color: isDone ? '#C46B3E' : isPaused ? themeMuted : themeText }]}>
                        {isDone ? '✓' : fmt(timer.remaining)}
                      </Text>
                      {!isDone && <Text style={[styles.tempoTotal, { color: themeMuted }]}>{fmt(timer.totalSeconds)}</Text>}
                    </View>
                  </View>

                  <View style={styles.controlesDireita}>
                    {/* Barra Linear Pequena */}
                    <View style={[styles.barraTrilho, { backgroundColor: isDone ? 'rgba(196,107,62,0.15)' : themeBorder }]}>
                      <View
                        style={[
                          styles.barraProgresso,
                          {
                            width: `${(1 - progress) * 100}%`,
                            backgroundColor: isDone ? '#C46B3E' : isPaused ? '#C4B4A4' : '#6B8C6B',
                          },
                        ]}
                      />
                    </View>

                    <Text style={[styles.legendaTempo, { color: themeMuted }]}>
                      {isDone ? `${fmt(timer.totalSeconds)} concluído` : `Restam ${fmt(timer.remaining)} de ${fmt(timer.totalSeconds)}`}
                    </Text>

                    {/* Botões de Ação */}
                    {isDone ? (
                      <View style={styles.linhaAcoes}>
                        <TouchableOpacity style={styles.btnReiniciar} onPress={() => reiniciarTimer(timer.id)}>
                          <Feather name="rotate-ccw" size={14} color="#FAF6F0" />
                          <Text style={styles.txtAcaoBranco}>Reiniciar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnDispensar} onPress={() => dispensarTimer(timer.id)}>
                          <Feather name="bell-off" size={14} color="#C46B3E" />
                          <Text style={styles.txtDispensar}>Dispensar</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.btnPausar, { backgroundColor: isPaused ? '#2E4A2E' : 'rgba(0,0,0,0.05)' }]}
                        onPress={() => alternarPausa(timer.id)}
                      >
                        <Feather name={isPaused ? 'play' : 'pause'} size={14} color={isPaused ? '#FAF6F0' : '#2E4A2E'} />
                        <Text style={[styles.txtPausar, { color: isPaused ? '#FAF6F0' : '#2E4A2E' }]}>
                          {isPaused ? 'Continuar' : 'Pausar'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {visiveis.length > 0 && (
          <TouchableOpacity style={[styles.btnDashedNovo, { borderColor: themeBorder }]} onPress={() => setShowForm(true)}>
            <Feather name="plus" size={18} color={themeMuted} />
            <Text style={[styles.txtDashedNovo, { color: themeMuted }]}>Novo timer</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ModalNovoTimer visible={showForm} onClose={() => setShowForm(false)} onCriar={criarTimer} isDark={isDark} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  btnIcon: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  tituloArea: { alignItems: 'center' },
  tituloHeader: { fontSize: 19, fontWeight: 'bold' },
  subtituloHeader: { fontSize: 11.5, fontWeight: '600', marginTop: 1 },
  btnPlus: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#2E4A2E', alignItems: 'center', justifyContent: 'center' },
  scrollBody: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', minHeight: 340, gap: 14 },
  emptyIconCircle: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: 'bold' },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 22, maxWidth: 260 },
  btnNovoEmpty: { backgroundColor: '#2E4A2E', borderRadius: 25, paddingHorizontal: 24, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  txtNovoEmpty: { color: '#FAF6F0', fontSize: 14.5, fontWeight: 'bold' },
  listaCards: { gap: 14, marginTop: 10 },
  cardTimer: { borderRadius: 22, borderWidth: 1.5, padding: 18 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  timerNome: { fontSize: 16.5, fontWeight: 'bold' },
  timerStatusText: { fontSize: 11.5, fontWeight: '500', marginTop: 2 },
  btnFechar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cardCorpo: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ringContainer: { position: 'relative', width: 104, height: 104 },
  ringOverlay: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' },
  tempoRestante: { fontSize: 20, fontWeight: '800' },
  tempoTotal: { fontSize: 10, fontWeight: '500', marginTop: 2 },
  controlesDireita: { flex: 1 },
  barraTrilho: { height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 10 },
  barraProgresso: { height: '100%', borderRadius: 2 },
  legendaTempo: { fontSize: 12, marginBottom: 12 },
  linhaAcoes: { flexDirection: 'row', gap: 6 },
  btnReiniciar: { flex: 1, backgroundColor: '#2E4A2E', borderRadius: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  txtAcaoBranco: { color: '#FAF6F0', fontSize: 12, fontWeight: 'bold' },
  btnDispensar: { flex: 1, backgroundColor: '#FDF0EB', borderWidth: 1.5, borderColor: '#F0C4AC', borderRadius: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  txtDispensar: { color: '#C46B3E', fontSize: 12, fontWeight: 'bold' },
  btnPausar: { borderRadius: 10, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  txtPausar: { fontSize: 13, fontWeight: 'bold' },
  btnDashedNovo: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 18, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 },
  txtDashedNovo: { fontSize: 14.5, fontWeight: 'bold' },
});