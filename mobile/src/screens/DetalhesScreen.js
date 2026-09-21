import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { RECEITAS_DESTAQUE } from '../data/mockReceitas';
import HeroHeader from '../components/HeroHeader';
import SeletorPorcoes from '../components/SeletorPorcoes';
import CardIngredientes from '../components/CardIngredientes';
import ItemPasso from '../components/ItemPasso';
import Divisor from '../components/Divisor';

import { getFavoritos, toggleFavoritoStorage } from '../utils/storage';

export default function DetalhesScreen({ navigation, route }) {
  const receita = route?.params?.receita || RECEITAS_DESTAQUE[0];

  const [isFavorito, setIsFavorito] = useState(false);
  const [porcoes, setPorcoes] = useState(receita.porcoes || 2);
  const [passosConcluidos, setPassosConcluidos] = useState(new Set());

  // Checa no AsyncStorage se a receita atual já está salva
  useEffect(() => {
    checkFavoritoStatus();
  }, [receita]);

  const checkFavoritoStatus = async () => {
    if (!receita?.id && receita?.id !== 0) return;
    const favs = await getFavoritos();
    const existe = favs.some((item) => String(item.id) === String(receita.id));
    setIsFavorito(existe);
  };

  // Favorita ou desfavorita no AsyncStorage
  const handleToggleFavorito = async () => {
    if (!receita) return;
    
    const novaLista = await toggleFavoritoStorage(receita);
    const atualizado = novaLista.some(
      (item) => String(item.id) === String(receita.id)
    );
    setIsFavorito(atualizado);
  };

  const togglePasso = (index) => {
    setPassosConcluidos((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Banner com Imagem e Ações */}
        <HeroHeader
          imagemUrl={receita.imagem}
          avaliacao={receita.avaliacao}
          avaliacoesCount={receita.avaliacoesCount}
          isFavorito={isFavorito}
          onBackPress={() => navigation?.goBack?.()}
          onFavoritoToggle={handleToggleFavorito}
        />

        {/* Informações da Receita */}
        <View style={styles.contentSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{receita.titulo || receita.nome}</Text>
            {receita.dificuldade && (
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>{receita.dificuldade}</Text>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Ionicons name="time-outline" size={16} color="#7A685B" />
              <Text style={styles.metaText}>{receita.tempo}</Text>
            </View>
            {receita.porcoes && (
              <View style={styles.metaPill}>
                <Ionicons name="people-outline" size={16} color="#7A685B" />
                <Text style={styles.metaText}>{receita.porcoes} porções</Text>
              </View>
            )}
          </View>

          {receita.descricao && (
            <Text style={styles.description}>{receita.descricao}</Text>
          )}
        </View>

        <Divisor />

        {/* Ingredientes */}
        {receita.ingredientes && receita.ingredientes.length > 0 && (
          <>
            <View style={styles.contentSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ingredientes</Text>
                <SeletorPorcoes
                  porcoes={porcoes}
                  onAumentar={() => setPorcoes((p) => p + 1)}
                  onDiminuir={() => setPorcoes((p) => Math.max(1, p - 1))}
                />
              </View>

              <CardIngredientes
                ingredientes={receita.ingredientes}
                porcoesBase={receita.porcoes || 1}
                porcoesAtuais={porcoes}
              />
              <Text style={styles.servingsNote}>
                Quantidades ajustadas para {porcoes} porção
                {porcoes !== 1 ? 'ões' : ''}
              </Text>
            </View>
            <Divisor />
          </>
        )}

        {/* Modo de Preparo */}
        {receita.passos && receita.passos.length > 0 && (
          <>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Modo de preparo</Text>
              <View style={styles.stepsList}>
                {receita.passos.map((passo, i) => (
                  <ItemPasso
                    key={i}
                    index={i}
                    textoPasso={passo}
                    isConcluido={passosConcluidos.has(i)}
                    onToggle={() => togglePasso(i)}
                  />
                ))}
              </View>
            </View>
            <Divisor />
          </>
        )}

        {/* Dicas */}
        {receita.dicas && receita.dicas.length > 0 && (
          <>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Dicas</Text>
              <View style={styles.tipsBox}>
                {receita.dicas.map((dica, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Ionicons
                      name="information-circle-outline"
                      size={18}
                      color="#6B8C6B"
                    />
                    <Text style={styles.tipText}>{dica}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Divisor />
          </>
        )}

        {/* História */}
        {receita.historia && (
          <View style={styles.contentSection}>
            <View style={styles.historyHeader}>
              <Ionicons name="book-outline" size={18} color="#9B8574" />
              <Text style={styles.historyTitle}>História da receita</Text>
            </View>
            <Text style={styles.historyText}>{receita.historia}</Text>
          </View>
        )}
      </ScrollView>

      {/* Barra Inferior Fixa */}
      <View style={styles.fixedBottomContainer}>
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
          <Ionicons name="play-circle-outline" size={18} color="#2E4A2E" />
          <Text style={styles.secondaryButtonText}>
            Vídeo e informações nutricionais
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
          <Ionicons name="play" size={16} color="#FAF6F0" />
          <Text style={styles.primaryButtonText}>Começar preparo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollView: {
    flex: 1,
  },
  contentSection: {
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2016',
    flex: 1,
    lineHeight: 30,
  },
  difficultyBadge: {
    backgroundColor: '#EAE6DF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B8C6B',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EFEBE4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C2016',
  },
  description: {
    fontSize: 14.5,
    color: '#5C4E43',
    lineHeight: 22,
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2016',
  },
  servingsNote: {
    fontSize: 12,
    color: '#9B8574',
    marginTop: 8,
    textAlign: 'center',
  },
  stepsList: {
    gap: 12,
    marginTop: 14,
  },
  tipsBox: {
    backgroundColor: '#EBF2EB',
    borderWidth: 1.5,
    borderColor: '#D2E3D2',
    borderRadius: 18,
    padding: 16,
    gap: 12,
    marginTop: 12,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  tipText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#2E4A2E',
    flex: 1,
    lineHeight: 19,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#5C4E43',
  },
  historyText: {
    fontSize: 13.5,
    color: '#8A7B70',
    lineHeight: 22,
  },
  fixedBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8E2D9',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D2E3D2',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E4A2E',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2E4A2E',
    borderRadius: 18,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#2E4A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FAF6F0',
  },
});