import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTimer } from '../context/TimerContext';

function fmt(s: number) {
  const m = Math.floor(Math.max(0, s) / 60).toString().padStart(2, '0');
  const sec = (Math.max(0, s) % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

interface ActiveTimersBarProps {
  onPress: () => void;
}

export function ActiveTimersBar({ onPress }: ActiveTimersBarProps) {
  const { timers } = useTimer();
  const ativos = timers.filter((t) => !t.dismissed);

  if (ativos.length === 0) return null;

  const maisProximo = [...ativos].sort((a, b) => a.remaining - b.remaining)[0];

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.iconeArea}>
        <Feather name="clock" size={18} color="#FAF6F0" />
      </View>

      <View style={styles.infoArea}>
        <Text style={styles.titulo} numberOfLines={1}>
          {maisProximo.name}
        </Text>
        <Text style={styles.subtitulo}>
          {maisProximo.status === 'done' ? 'Encerrado!' : `${fmt(maisProximo.remaining)} restante`}
        </Text>
      </View>

      {ativos.length > 1 && (
        <View style={styles.badgeCount}>
          <Text style={styles.badgeText}>+{ativos.length - 1}</Text>
        </View>
      )}

      <Feather name="chevron-right" size={18} color="#FAF6F0" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2E4A2E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  iconeArea: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoArea: { flex: 1 },
  titulo: { color: '#FAF6F0', fontSize: 14, fontWeight: 'bold' },
  subtitulo: { color: '#C4B4A4', fontSize: 12 },
  badgeCount: {
    backgroundColor: '#C46B3E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: { color: '#FAF6F0', fontSize: 11, fontWeight: 'bold' },
});