import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Refeicao, TipoRefeicao } from '../types/planner';

interface CardSlotRefeicaoProps {
  tipoRefeicao: TipoRefeicao;
  rotulo: string;
  emoji: string;
  refeicao: Refeicao | null;
  onRemover: () => void;
  onAtualizarPorcoes: (novasPorcoes: number) => void;
  onAdicionarPressionado: () => void;
  onPressDetalhes?: () => void;
  isDark: boolean;
}

export function CardSlotRefeicao({
  rotulo,
  emoji,
  refeicao,
  onRemover,
  onAtualizarPorcoes,
  onAdicionarPressionado,
  onPressDetalhes,
  isDark,
}: CardSlotRefeicaoProps) {
  const cardBg = isDark ? '#1F3326' : '#FFFFFF';
  const cardBorder = isDark ? '#2B4735' : '#DDD4C8';
  const textPri = isDark ? '#FAF6F0' : '#2C2016';
  const textMuted = isDark ? '#A09386' : '#8C7A6B';
  const cardAlt = isDark ? '#263E2F' : '#F7F3EE';

  return (
    <View style={styles.container}>
      <View style={styles.cabecalhoSlot}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.rotuloSlot, { color: textMuted }]}>{rotulo}</Text>
      </View>

      {refeicao ? (
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={onPressDetalhes}
          style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}
        >
          <Image source={{ uri: refeicao.imagem }} style={styles.imagem} />
          <View style={styles.informacoes}>
            <Text style={[styles.nomeRefeicao, { color: textPri }]} numberOfLines={2}>
              {refeicao.titulo || refeicao.nome}
            </Text>
            
            <View style={styles.linhaDetalhes}>
              <View style={styles.grupoTempo}>
                <Feather name="clock" size={12} color={textMuted} />
                <Text style={[styles.textoTempo, { color: textMuted }]}>{refeicao.tempo}</Text>
              </View>
              
              <View style={[styles.badgePorcoes, { backgroundColor: cardAlt }]}>
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    onAtualizarPorcoes(Math.max(1, refeicao.porcoes - 1));
                  }}
                >
                  <Feather name="minus" size={12} color={textPri} />
                </TouchableOpacity>
                
                <Text style={[styles.textoPorcoes, { color: textPri }]}>{refeicao.porcoes} porções</Text>
                
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    onAtualizarPorcoes(refeicao.porcoes + 1);
                  }}
                >
                  <Feather name="plus" size={12} color={textPri} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.acoesCard}>
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  onRemover();
                }} 
                style={styles.botaoRemover}
              >
                <Feather name="trash-2" size={12} color="#C46B3E" />
                <Text style={styles.textoRemover}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={onAdicionarPressionado} 
          style={[styles.slotVazio, { borderColor: cardBorder }]}
        >
          <View style={[styles.fundoMais, { backgroundColor: cardAlt }]}>
            <Feather name="plus" size={14} color="#2E4A2E" />
          </View>
          <Text style={[styles.textoVazio, { color: textMuted }]}>Adicionar {rotulo.toLowerCase()}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  cabecalhoSlot: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  emoji: { fontSize: 14 },
  rotuloSlot: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.05 },
  card: { borderRadius: 18, borderWidth: 1.5, flexDirection: 'row', overflow: 'hidden' },
  imagem: { width: 90, height: 100 },
  informacoes: { flex: 1, padding: 10, justifyContent: 'space-between' },
  nomeRefeicao: { fontSize: 14, fontWeight: '600' },
  linhaDetalhes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  grupoTempo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  textoTempo: { fontSize: 11 },
  badgePorcoes: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  textoPorcoes: { fontSize: 11, fontWeight: 'bold' },
  acoesCard: { flexDirection: 'row', justifyContent: 'flex-end' },
  botaoRemover: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FDF0EB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  textoRemover: { fontSize: 11, fontWeight: '600', color: '#C46B3E' },
  slotVazio: { width: '100%', borderStyle: 'dashed', borderWidth: 1.5, borderRadius: 18, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  fundoMais: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  textoVazio: { fontSize: 13, fontWeight: '600' },
});