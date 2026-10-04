import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import RecipeCard from '../components/RecipeCard';
import { CategoryList } from '../components/CategoryList';
import { QuickFilters } from '../components/QuickFilters';

import {
  CATEGORIAS,
  FILTROS_RAPIDOS,
  Receita,
} from '../model/receita';

import {
  buscarTodasReceitas,
  buscarReceitasEmDestaque,
  buscarReceitasSazonais,
  buscarReceitasPorTema,
} from '../services/receitaApiService';

import {
  getFavoritos,
  toggleFavoritoStorage,
} from '../utils/storage';

export default function HomeScreen({ navigation, theme, toggleTheme }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Hoje');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [receitas, setReceitas] = useState<any[]>([]);
  const [receitasDestaque, setReceitasDestaque] = useState<any[]>([]);
  const [receitasSazonais, setReceitasSazonais] = useState<any[]>([]);
  const [receitasTema, setReceitasTema] = useState<any[]>([]);

  const [estacaoAtual, setEstacaoAtual] = useState<string | null>(null);
  const [temaAtual, setTemaAtual] = useState<string | null>(null);

  const [carregandoReceitas, setCarregandoReceitas] = useState(true);
  const [carregandoDestaques, setCarregandoDestaques] = useState(true);
  const [carregandoSazonais, setCarregandoSazonais] = useState(true);
  const [carregandoTema, setCarregandoTema] = useState(true);

  const [erroReceitas, setErroReceitas] = useState(false);
  const [erroDestaques, setErroDestaques] = useState(false);
  const [erroSazonais, setErroSazonais] = useState(false);
  const [erroTema, setErroTema] = useState(false);
  const [favorites, setFavorites] = useState<Receita[]>([]);

  const isDark = theme === 'dark';

  useEffect(() => {
    const carregarFavoritos = async () => {
      try {
        const favoritosSalvos = await getFavoritos();
        setFavorites(favoritosSalvos);
      } catch (error) {
        console.log('Erro ao carregar favoritos:', error);
        setFavorites([]);
      }
    };

    carregarFavoritos();
  }, []);

  useEffect(() => {
    const carregarDadosHome = async () => {
      try {
        setCarregandoReceitas(true);
        setErroReceitas(false);
        const receitas = await buscarTodasReceitas();
        setReceitas(receitas);
      } catch (error) {
        console.log('Erro ao carregar receitas:', error);
        setErroReceitas(true);
      } finally {
        setCarregandoReceitas(false);
      }

      try {
        setCarregandoDestaques(true);
        setErroDestaques(false);
        const receitas = await buscarReceitasEmDestaque();
        setReceitasDestaque(receitas);
      } catch (error) {
        console.log('Erro ao carregar destaques:', error);
        setErroDestaques(true);
      } finally {
        setCarregandoDestaques(false);
      }

      try {
        setCarregandoSazonais(true);
        setErroSazonais(false);
        const resposta = await buscarReceitasSazonais();
        setEstacaoAtual(resposta.estacao);
        setReceitasSazonais(resposta.receitas);
      } catch (error) {
        console.log('Erro ao carregar receitas sazonais:', error);
        setErroSazonais(true);
      } finally {
        setCarregandoSazonais(false);
      }

      try {
        setCarregandoTema(true);
        setErroTema(false);
        const resposta = await buscarReceitasPorTema();
        setTemaAtual(resposta.tema);
        setReceitasTema(resposta.receitas);
      } catch (error) {
        console.log('Erro ao carregar receitas por tema:', error);
        setErroTema(true);
      } finally {
        setCarregandoTema(false);
      }
    };

    carregarDadosHome();
  }, []);


  const toggleFav = async (receita: Receita) => {
    try {
      const novaLista = await toggleFavoritoStorage(receita);
      setFavorites(novaLista);
    } catch (error) {
      console.log('Erro ao alterar favorito:', error);
    }
  };

  const handleAbrirDetalhes = (receita: any) => {
    navigation?.navigate('Detalhes', { receita });
  };

  const handleLimparFiltros = () => {
    setActiveFilter('Hoje');
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const receitasFiltradas = receitas.filter((receita: any) => {
    const matchesSearch = receita.titulo
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? receita.categoriaId === selectedCategory
      : true;

    let matchesQuickFilter = true;

    if (activeFilter === 'Rápido') {
      const tempoNum = parseInt(receita.tempo, 10) || 0;
      matchesQuickFilter = tempoNum > 0 && tempoNum <= 30;
    } else if (activeFilter === 'Saudável') {
      matchesQuickFilter =
        receita.isSaudavel === true ||
        receita.tags?.includes('Saudável');
    }

    return matchesSearch && matchesCategory && matchesQuickFilter;
  });

  const temFiltroAtivo =
    selectedCategory !== null ||
    activeFilter !== 'Hoje' ||
    searchQuery.length > 0;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#0D1912' : '#FBF8F3',
        },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: '#6B8C6B' }]}>
              SABORES PLANEJADOS
            </Text>

            <Text
              style={[
                styles.title,
                {
                  color: isDark ? '#FAF6F0' : '#2C2016',
                },
              ]}
            >
              Olá! O que vamos{'\n'}cozinhar hoje?
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[
                styles.themeToggle,
                {
                  backgroundColor: isDark ? '#172B20' : '#E8DFD3',
                  borderColor: isDark ? '#2D4536' : '#D4C8BA',
                },
              ]}
              onPress={toggleTheme}
            >
              <Feather
                name={isDark ? 'sun' : 'moon'}
                size={18}
                color={isDark ? '#FAF6F0' : '#2C2016'}
              />
            </TouchableOpacity>

            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: isDark ? '#172B20' : '#E8DFD3',
                  borderColor: isDark ? '#2D4536' : '#D4C8BA',
                },
              ]}
            >
              <Feather
                name="user"
                size={18}
                color={isDark ? '#A2B3A7' : '#9B8574'}
              />
            </View>
          </View>
        </View>

        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? '#15251C' : '#FFFFFF',
              borderColor: isDark ? '#233A2C' : '#DDD4C8',
            },
          ]}
        >
          <Feather
            name="search"
            size={18}
            color={isDark ? '#687B6E' : '#9B8574'}
          />

          <TextInput
            style={[
              styles.searchInput,
              {
                color: isDark ? '#FAF6F0' : '#2C2016',
              },
            ]}
            placeholder="Buscar receitas..."
            placeholderTextColor={isDark ? '#687B6E' : '#B8A898'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather
                name="x"
                size={18}
                color={isDark ? '#687B6E' : '#9B8574'}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDark ? '#FAF6F0' : '#2C2016',
              },
            ]}
          >
            Em destaque
          </Text>
        </View>

        {carregandoDestaques && (
          <View style={styles.featuredState}>
            <ActivityIndicator
              size="small"
              color={isDark ? '#82B382' : '#6B8C6B'}
            />
            <Text
              style={[
                styles.stateText,
                {
                  color: isDark ? '#A2B3A7' : '#8C7A6B',
                },
              ]}
            >
              Carregando receitas...
            </Text>
          </View>
        )}

        {!carregandoDestaques && erroDestaques && (
          <View style={styles.featuredState}>
            <Feather
              name="alert-circle"
              size={22}
              color="#C46B3E"
            />
            <Text
              style={[
                styles.stateText,
                {
                  color: isDark ? '#A2B3A7' : '#8C7A6B',
                },
              ]}
            >
              Não foi possível carregar as receitas em destaque.
            </Text>
          </View>
        )}

        {!carregandoDestaques &&
          !erroDestaques &&
          receitasDestaque.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {receitasDestaque.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.featuredCard}
                  activeOpacity={0.9}
                  onPress={() => handleAbrirDetalhes(item)}
                >
                  <Image
                    source={{ uri: item.imagem }}
                    style={styles.featuredImage}
                  />

                  <View style={styles.featuredOverlay} />

                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredTitle}>
                      {item.titulo}
                    </Text>

                    <View style={styles.timeBadge}>
                      <Feather
                        name="clock"
                        size={12}
                        color="rgba(250,246,240,0.85)"
                      />

                      <Text style={styles.timeText}>
                        {item.tempo}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

        {!carregandoDestaques &&
          !erroDestaques &&
          receitasDestaque.length === 0 && (
            <View style={styles.featuredState}>
              <Feather
                name="coffee"
                size={22}
                color={isDark ? '#82B382' : '#6B8C6B'}
              />

              <Text
                style={[
                  styles.stateText,
                  {
                    color: isDark ? '#A2B3A7' : '#8C7A6B',
                  },
                ]}
              >
                Nenhuma receita em destaque no momento.
              </Text>
            </View>
          )}

        {!carregandoSazonais &&
          !erroSazonais &&
          receitasSazonais.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: isDark ? '#FAF6F0' : '#2C2016',
                    },
                  ]}
                >
                  Receitas da {estacaoAtual}
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
              >
                {receitasSazonais.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.seasonalCard}
                    activeOpacity={0.9}
                    onPress={() => handleAbrirDetalhes(item)}
                  >
                    <Image
                      source={{ uri: item.imagem }}
                      style={styles.seasonalImage}
                    />

                    <View style={styles.seasonalInfo}>
                      <Text
                        style={[
                          styles.seasonalTitle,
                          {
                            color: isDark ? '#FAF6F0' : '#2C2016',
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {item.titulo}
                      </Text>

                      <View style={styles.seasonalTime}>
                        <Feather
                          name="clock"
                          size={12}
                          color={isDark ? '#A2B3A7' : '#8C7A6B'}
                        />

                        <Text
                          style={[
                            styles.seasonalTimeText,
                            {
                              color: isDark ? '#A2B3A7' : '#8C7A6B',
                            },
                          ]}
                        >
                          {item.tempo}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

        {!carregandoTema &&
          !erroTema &&
          receitasTema.length > 0 &&
          temaAtual && (
            <>
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: isDark ? '#FAF6F0' : '#2C2016',
                    },
                  ]}
                >
                  Especial de {temaAtual}
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
              >
                {receitasTema.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.seasonalCard}
                    activeOpacity={0.9}
                    onPress={() => handleAbrirDetalhes(item)}
                  >
                    <Image
                      source={{ uri: item.imagem }}
                      style={styles.seasonalImage}
                    />

                    <View style={styles.seasonalInfo}>
                      <Text
                        style={[
                          styles.seasonalTitle,
                          {
                            color: isDark ? '#FAF6F0' : '#2C2016',
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {item.titulo}
                      </Text>

                      <View style={styles.seasonalTime}>
                        <Feather
                          name="clock"
                          size={12}
                          color={isDark ? '#A2B3A7' : '#8C7A6B'}
                        />

                        <Text
                          style={[
                            styles.seasonalTimeText,
                            {
                              color: isDark ? '#A2B3A7' : '#8C7A6B',
                            },
                          ]}
                        >
                          {item.tempo}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

        <CategoryList
          categorias={CATEGORIAS}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isDark={isDark}
        />

        <QuickFilters
          filtros={FILTROS_RAPIDOS}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          hasActiveFilters={temFiltroAtivo}
          onClearFilters={handleLimparFiltros}
          isDark={isDark}
        />

        <View style={styles.sectionHeaderBetween}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDark ? '#FAF6F0' : '#2C2016',
              },
            ]}
          >
            Receitas para você
          </Text>

          <TouchableOpacity
            onPress={() => navigation?.navigate('Buscar')}
          >
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {carregandoReceitas && (
          <View style={styles.emptyContainer}>
            <ActivityIndicator
              size="small"
              color={isDark ? '#82B382' : '#6B8C6B'}
            />

            <Text
              style={[
                styles.emptyText,
                {
                  color: isDark ? '#A2B3A7' : '#8C7A6B',
                },
              ]}
            >
              Carregando receitas...
            </Text>
          </View>
        )}

        {!carregandoReceitas && erroReceitas && (
          <View style={styles.emptyContainer}>
            <Feather
              name="alert-circle"
              size={22}
              color="#C46B3E"
            />

            <Text
              style={[
                styles.emptyText,
                {
                  color: isDark ? '#A2B3A7' : '#8C7A6B',
                },
              ]}
            >
              Não foi possível carregar as receitas.
            </Text>
          </View>
        )}

        {!carregandoReceitas &&
          !erroReceitas &&
          receitasFiltradas.length > 0 && (
            <View style={styles.gridContainer}>
              {receitasFiltradas.map((r: Receita) => (
                <RecipeCard
                  key={r.id}
                  receita={r}
                  isFav={favorites.some((item) => String(item.id) === String(r.id))}
                  onToggleFav={() => toggleFav(r)}
                  onPress={() => handleAbrirDetalhes(r)}
                  isDark={isDark}
                />
              ))}
            </View>
          )}

        {!carregandoReceitas &&
          !erroReceitas &&
          receitasFiltradas.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text
                style={[
                  styles.emptyText,
                  {
                    color: isDark ? '#A2B3A7' : '#8C7A6B',
                  },
                ]}
              >
                Nenhuma receita encontrada para os filtros selecionados.
              </Text>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 28,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 22,
    marginTop: 16,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  sectionHeader: {
    paddingHorizontal: 22,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginTop: 22,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#C46B3E',
  },
  horizontalScroll: {
    paddingLeft: 22,
  },
  featuredCard: {
    width: 180,
    height: 140,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20, 12, 4, 0.45)',
  },
  featuredInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  featuredTitle: {
    color: '#FAF6F0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: 'rgba(250,246,240,0.85)',
    fontSize: 11,
  },
  seasonalCard: {
    width: 170,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  seasonalImage: {
    width: '100%',
    height: 115,
    borderRadius: 16,
  },
  seasonalInfo: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  seasonalTitle: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  seasonalTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  seasonalTimeText: {
    fontSize: 11,
  },
  featuredState: {
    minHeight: 140,
    marginHorizontal: 22,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    gap: 8,
  },
  stateText: {
    fontSize: 13,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 22,
  },
  emptyContainer: {
    width: '100%',
    paddingVertical: 30,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});