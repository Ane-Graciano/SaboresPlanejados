import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HeroHeader from '../components/HeroHeader';
import SeletorPorcoes from '../components/SeletorPorcoes';
import CardIngredientes from '../components/CardIngredientes';
import ItemPasso from '../components/ItemPasso';
import Divisor from '../components/Divisor';
import { getFavoritos, toggleFavoritoStorage } from '../utils/storage';
import { buscarReceitaPorId } from '../services/receitaApiService';
import { Receita } from '../model/receita';

type DetalhesRouteParams = {
  receita?: Receita;
  receitaId?: string;
};

type DetalhesNavigation = {
  goBack?: () => void;
};

type DetalhesScreenProps = {
  navigation: DetalhesNavigation;
  route: {
    params?: DetalhesRouteParams;
  };
};

export default function DetalhesScreen({ navigation, route }: DetalhesScreenProps) {
  const receitaRecebida = route.params?.receita;
  const receitaId = route.params?.receitaId || receitaRecebida?.id;

  const [receita, setReceita] = useState<Receita | null>(receitaRecebida || null);
  const [isLoading, setIsLoading] = useState<boolean>(!receitaRecebida);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [isFavorito, setIsFavorito] = useState<boolean>(false);
  const [porcoes, setPorcoes] = useState<number>(receitaRecebida?.porcoes || 2);
  const [passosConcluidos, setPassosConcluidos] = useState<Set<number>>(new Set<number>());

  useEffect(() => {
    carregarReceita();
  }, [receitaId]);

  useEffect(() => {
    if (receita) {
      checkFavoritoStatus();
    }
  }, [receita]);

  const carregarReceita = async (): Promise<void> => {
    if (receitaRecebida) {
      setReceita(receitaRecebida);
      setPorcoes(receitaRecebida.porcoes || 2);
      setIsLoading(false);
      setError(null);
      setIsNotFound(false);
      return;
    }

    if (!receitaId) {
      setIsLoading(false);
      setIsNotFound(true);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsNotFound(false);

      const resultado = await buscarReceitaPorId(String(receitaId));

      if (!resultado) {
        setReceita(null);
        setIsNotFound(true);
        return;
      }

      setReceita(resultado);
      setPorcoes(resultado.porcoes || 2);
    } catch (err) {
      console.error('Erro ao carregar receita:', err);
      setReceita(null);
      setError('Não foi possível carregar a receita. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavoritoStatus = async (): Promise<void> => {
    if (!receita?.id && receita?.id !== '0') {
      return;
    }

    try {
      const favs = await getFavoritos();

      const existe = favs.some(
        (item: Receita) => String(item.id) === String(receita.id),
      );

      setIsFavorito(existe);
    } catch (err) {
      console.error('Erro ao verificar favorito:', err);
    }
  };

  const handleToggleFavorito = async (): Promise<void> => {
    if (!receita) {
      return;
    }

    try {
      const novaLista = await toggleFavoritoStorage(receita);

      const atualizado = novaLista.some(
        (item: Receita) => String(item.id) === String(receita.id),
      );

      setIsFavorito(atualizado);
    } catch (err) {
      console.error('Erro ao alterar favorito:', err);
    }
  };

  const togglePasso = (index: number): void => {
    setPassosConcluidos((prev: Set<number>) => {
      const next = new Set<number>(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#2E4A2E" />
          <Text style={styles.stateTitle}>Carregando receita...</Text>
          <Text style={styles.stateText}>
            Aguarde enquanto buscamos as informações da receita.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isNotFound) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.stateContainer}>
          <View style={styles.stateIcon}>
            <Ionicons name="search-outline" size={36} color="#9B8574" />
          </View>

          <Text style={styles.stateTitle}>Receita não encontrada</Text>

          <Text style={styles.stateText}>
            A receita que você tentou acessar não existe ou foi removida.
          </Text>

          <TouchableOpacity
            style={styles.secondaryStateButton}
            onPress={() => navigation.goBack?.()}
          >
            <Text style={styles.secondaryStateButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !receita) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.stateContainer}>
          <View style={[styles.stateIcon, { backgroundColor: '#F5E8E1' }]}>
            <Ionicons name="alert-circle-outline" size={36} color="#C46B3E" />
          </View>

          <Text style={styles.stateTitle}>Ocorreu um erro</Text>

          <Text style={styles.stateText}>
            {error || 'Não foi possível carregar esta receita.'}
          </Text>

          <TouchableOpacity style={styles.retryButton} onPress={carregarReceita}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryStateButton}
            onPress={() => navigation.goBack?.()}
          >
            <Text style={styles.secondaryStateButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <HeroHeader
          imagemUrl={receita.imagem}
          avaliacao={receita.avaliacao}
          avaliacoesCount={receita.avaliacoesCount}
          isFavorito={isFavorito}
          onBackPress={() => navigation.goBack?.()}
          onFavoritoToggle={handleToggleFavorito}
        />

        <View style={styles.contentSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{receita.titulo}</Text>

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

        {receita.ingredientes && receita.ingredientes.length > 0 && (
          <>
            <View style={styles.contentSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ingredientes</Text>

                <SeletorPorcoes
                  porcoes={porcoes}
                  onAumentar={() => setPorcoes((p: number) => p + 1)}
                  onDiminuir={() => setPorcoes((p: number) => Math.max(1, p - 1))}
                />
              </View>

              <CardIngredientes
                ingredientes={receita.ingredientes}
                porcoesBase={receita.porcoes || 1}
                porcoesAtuais={porcoes}
              />

              <Text style={styles.servingsNote}>
                Quantidades ajustadas para {porcoes} porção{porcoes !== 1 ? 'ões' : ''}
              </Text>
            </View>

            <Divisor />
          </>
        )}

        {receita.passos && receita.passos.length > 0 && (
          <>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Modo de preparo</Text>

              <View style={styles.stepsList}>
                {receita.passos.map((passo: string, i: number) => (
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

        {receita.imagens && receita.imagens.length > 0 && (
          <>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Galeria</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.gallery}
                contentContainerStyle={styles.galleryContent}
              >
                {receita.imagens.map((imagem: string, index: number) => (
                  <View
                    key={`${imagem}-${index}`}
                    style={styles.galleryItem}
                  >
                    <Image
                      source={{ uri: imagem }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>

            <Divisor />
          </>
        )}

        {receita.dicas && receita.dicas.length > 0 && (
          <>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Dicas</Text>

              <View style={styles.tipsBox}>
                {receita.dicas.map((dica: string, i: number) => (
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

      <View style={styles.fixedBottomContainer}>
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
          <Ionicons
            name="play-circle-outline"
            size={18}
            color="#2E4A2E"
          />

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
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  stateIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFEAE3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2C2016',
    textAlign: 'center',
    marginTop: 14,
  },
  stateText: {
    fontSize: 14,
    color: '#8A7B70',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
    maxWidth: 310,
  },
  retryButton: {
    backgroundColor: '#2E4A2E',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 22,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#FAF6F0',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryStateButton: {
    borderWidth: 1.5,
    borderColor: '#D2C8BD',
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 22,
    marginTop: 10,
  },
  secondaryStateButtonText: {
    color: '#5C4E43',
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginLeft: 10,
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
    justifyContent: 'space-between',
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
  gallery: {
    marginTop: 14,
  },
  galleryContent: {
    paddingRight: 22,
  },
  galleryItem: {
    width: 220,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#EFEAE3',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FAF6F0',
  },
});
