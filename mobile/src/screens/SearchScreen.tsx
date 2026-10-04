import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { AdvancedFilterModal } from '../components/AdvancedFilterModal';
import { buscarTodasReceitas, buscarReceitas, FiltrosReceita } from '../services/receitaApiService';
import { Receita } from '../model/receita';
import { getFavoritos, toggleFavoritoStorage } from '../utils/storage';
const FILTROS_RAPIDOS = ['Hoje', 'Rápido', 'Saudável'];
const CATEGORIAS_FIGMA = [{ id: '1', label: 'Por ingrediente', icon: '🥕', bg: '#FFF5EE' }, { id: '2', label: 'Por tipo de prato', icon: '🍽️', bg: '#F2F6F3' }, { id: '3', label: 'Por culinária', icon: '🌐', bg: '#F0F7FF' }, { id: '4', label: 'Por chef', icon: '👨‍🍳', bg: '#FFF8E7' }];
const FILTROS_INICIAIS = { maxTime: 60, ingredient: 'Todos', chef: 'Todos', tipoPrato: 'Todos', culinaria: 'Todos' };
export default function SearchScreen({ navigation, theme }: any) {
  const isDark = theme === 'dark';
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Hoje');
  const [recipes, setRecipes] = useState<Receita[]>([]);
  const [favorites, setFavorites] = useState<Receita[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [appliedAdvancedFilters, setAppliedAdvancedFilters] = useState(FILTROS_INICIAIS);
  useEffect(() => {
    carregarFavoritos();
    carregarReceitasIniciais();
  }, []);
  const carregarFavoritos = async () => {
    try {
      const favoritosSalvos = await getFavoritos();
      setFavorites(favoritosSalvos);
    } catch (error) {
      console.log('Erro ao carregar favoritos:', error);
      setFavorites([]);
    }
  };
  const carregarReceitasIniciais = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const resultado = await buscarTodasReceitas();
      setRecipes(resultado);
    } catch (err) {
      console.error('Erro ao carregar receitas:', err);
      setRecipes([]);
      setError('Não foi possível carregar as receitas.');
    } finally {
      setIsLoading(false);
    }
  };
  const executarBusca = async (filtros: FiltrosReceita) => {
    try {
      setIsLoading(true);
      setError(null);
      const resultado = await buscarReceitas(filtros);
      setRecipes(resultado);
    } catch (err) {
      console.error('Erro ao buscar receitas:', err);
      setRecipes([]);
      setError('Não foi possível realizar a busca.');
    } finally {
      setIsLoading(false);
    }
  };
  const toggleFavorite = async (receita: Receita) => {
    try {
      const novaLista = await toggleFavoritoStorage(receita);
      setFavorites(novaLista);
    } catch (error) {
      console.log('Erro ao alterar favorito:', error);
    }
  };
  const montarFiltros = (novaQuery = query, novosFiltros = appliedAdvancedFilters): FiltrosReceita => {
    return {
      busca: novaQuery.trim().length > 0 ? novaQuery.trim() : undefined,
      ingrediente: novosFiltros.ingredient !== 'Todos' ? novosFiltros.ingredient : undefined,
      chef: novosFiltros.chef !== 'Todos' ? novosFiltros.chef : undefined,
      tipoPrato: novosFiltros.tipoPrato !== 'Todos' ? novosFiltros.tipoPrato : undefined,
      culinaria: novosFiltros.culinaria !== 'Todos' ? novosFiltros.culinaria : undefined,
      tempoMax: novosFiltros.maxTime < 60 ? novosFiltros.maxTime : undefined,
    };
  };
  const handleQueryChange = (text: string) => {
    setQuery(text);
    setShowAutocomplete(text.trim().length > 0);
    executarBusca(montarFiltros(text));
  };
  const suggestions = recipes.filter((recipe) => {
    const q = query.trim().toLowerCase();
    if (!q) return false;
    return recipe.titulo.toLowerCase().includes(q) || recipe.chef.toLowerCase().includes(q) || recipe.tipoPrato.toLowerCase().includes(q) || recipe.culinaria.toLowerCase().includes(q) || recipe.ingredientes?.some((ing) => ing.nome.toLowerCase().includes(q));
  }).slice(0, 5);
  const handleQuickFilter = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'Rápido') {
      executarBusca({ ...montarFiltros(), tempoMax: 30 });
      return;
    }
    executarBusca(montarFiltros());
  };
  const filteredRecipes = activeFilter === 'Saudável' ? recipes.filter((recipe) => recipe.isSaudavel) : recipes;
  const handleApplyFilters = (filters: typeof FILTROS_INICIAIS) => {
    setAppliedAdvancedFilters(filters);
    setModalVisible(false);
    executarBusca(montarFiltros(query, filters));
  };
  const handleClearFilters = () => {
    setAppliedAdvancedFilters(FILTROS_INICIAIS);
    setModalVisible(false);
    executarBusca(montarFiltros(query, FILTROS_INICIAIS));
  };
  const handleClearAll = () => {
    setQuery('');
    setActiveFilter('Hoje');
    setAppliedAdvancedFilters(FILTROS_INICIAIS);
    setShowAutocomplete(false);
    carregarReceitasIniciais();
  };
  const hasAdvancedFilters = appliedAdvancedFilters.maxTime < 60 || appliedAdvancedFilters.ingredient !== 'Todos' || appliedAdvancedFilters.chef !== 'Todos' || appliedAdvancedFilters.tipoPrato !== 'Todos' || appliedAdvancedFilters.culinaria !== 'Todos';
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1912' : '#FBF8F3' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.dateText, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>13 de setembro, 2026</Text>
          <Text style={[styles.title, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Buscar Receitas</Text>
        </View>
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: isDark ? '#15251C' : '#FFFFFF', borderColor: isDark ? '#233A2C' : '#DDD4C8' }]}>
            <Feather name="search" size={18} color={isDark ? '#687B6E' : '#9B8574'} />
            <TextInput style={[styles.searchInput, { color: isDark ? '#FAF6F0' : '#2C2016' }]} placeholder="Buscar receitas..." placeholderTextColor={isDark ? '#687B6E' : '#B8A898'} value={query} onChangeText={handleQueryChange} onFocus={() => { if (query.length > 0) setShowAutocomplete(true); }} />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => handleQueryChange('')}>
                <Feather name="x" size={18} color={isDark ? '#687B6E' : '#9B8574'} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.filterBtn, { backgroundColor: hasAdvancedFilters ? '#2E4A2E' : isDark ? '#1F3427' : '#F0EAE0' }]} onPress={() => setModalVisible(true)}>
              <Feather name="sliders" size={14} color={hasAdvancedFilters ? '#FAF6F0' : isDark ? '#A2B3A7' : '#5A4E43'} />
              <Text style={[styles.filterBtnText, { color: hasAdvancedFilters ? '#FAF6F0' : isDark ? '#A2B3A7' : '#5A4E43' }]}>Filtros</Text>
            </TouchableOpacity>
          </View>
          {showAutocomplete && suggestions.length > 0 && (
            <View style={[styles.autocompleteDropdown, { backgroundColor: isDark ? '#15251C' : '#FFFFFF', borderColor: isDark ? '#233A2C' : '#DDD4C8' }]}>
              {suggestions.map((item) => (
                <TouchableOpacity key={item.id} style={styles.autocompleteItem} onPress={() => { setQuery(item.titulo); setShowAutocomplete(false); executarBusca({ ...montarFiltros(), busca: item.titulo }); }}>
                  <Feather name="search" size={14} color={isDark ? '#687B6E' : '#9B8574'} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.autocompleteText, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>{item.titulo}</Text>
                    <Text style={{ fontSize: 11, color: isDark ? '#A2B3A7' : '#8C7A6B', marginTop: 2 }}>{item.chef}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {FILTROS_RAPIDOS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity key={filter} onPress={() => handleQuickFilter(filter)} style={[styles.filterChip, { backgroundColor: isActive ? '#2E4A2E' : 'transparent', borderColor: isActive ? 'transparent' : isDark ? '#2D4536' : '#DDD4C8' }]}>
                <Text style={{ color: isActive ? '#FAF6F0' : isDark ? '#A2B3A7' : '#6A5B4F', fontWeight: isActive ? '700' : '500' }}>{filter}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.findSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Encontre sua receita</Text>
          <View style={styles.gridContainer}>
            {CATEGORIAS_FIGMA.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.gridCard, { backgroundColor: isDark ? '#15251C' : item.bg, borderColor: isDark ? '#233A2C' : 'transparent' }]} onPress={() => setModalVisible(true)}>
                <Text style={styles.gridIcon}>{item.icon}</Text>
                <Text style={[styles.gridLabel, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.resultsHeader}>
          <View>
            <Text style={[styles.resultsTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Receitas encontradas</Text>
            <Text style={[styles.resultsCount, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>{filteredRecipes.length} receitas para você</Text>
          </View>
          {(query.length > 0 || hasAdvancedFilters || activeFilter !== 'Hoje') && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.seeAllText}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>
        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#2E4A2E" />
            <Text style={[styles.stateText, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>Buscando receitas...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerState}>
            <View style={[styles.errorIconContainer, { backgroundColor: isDark ? '#38241B' : '#FFF0E8' }]}>
              <Feather name="alert-circle" size={36} color="#C46B3E" />
            </View>
            <Text style={[styles.emptyTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Ocorreu um erro</Text>
            <Text style={[styles.stateText, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={carregarReceitasIniciais}>
              <Feather name="refresh-cw" size={14} color="#FAF6F0" />
              <Text style={styles.retryBtnText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : filteredRecipes.length === 0 ? (
          <View style={styles.centerState}>
            <Feather name="search" size={40} color={isDark ? '#2D4536' : '#D1C7BD'} />
            <Text style={[styles.emptyTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Nenhuma receita encontrada</Text>
            <Text style={[styles.stateText, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>Tente alterar sua busca ou remover alguns filtros.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={handleClearAll}>
              <Text style={styles.retryBtnText}>Limpar busca</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recipeList}>
            {filteredRecipes.map((recipe) => {
              const isFav = favorites.some((favorite) => favorite.id === recipe.id);
              return (
                <TouchableOpacity key={recipe.id} style={[styles.card, { backgroundColor: isDark ? '#15251C' : '#FFFFFF', borderColor: isDark ? '#233A2C' : '#EDE8E1' }]} onPress={() => navigation.navigate('Detalhes', { receita: recipe })}>
                  <View style={styles.cardImageContainer}>
                    <Image source={{ uri: recipe.imagem }} style={styles.cardImage} />
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); toggleFavorite(recipe); }} style={styles.favoriteBtn}>
                      <Feather name="heart" size={16} color={isFav ? '#C46B3E' : '#9B8574'} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>{recipe.titulo}</Text>
                    <Text style={{ fontSize: 12, color: isDark ? '#A2B3A7' : '#8C7A6B', marginBottom: 10 }}>{recipe.chef} • {recipe.culinaria}</Text>
                    <View style={styles.cardFooter}>
                      <View style={styles.infoGroup}>
                        <Feather name="clock" size={13} color={isDark ? '#A2B3A7' : '#8C7A6B'} />
                        <Text style={[styles.infoText, { color: isDark ? '#A2B3A7' : '#6A5B4F' }]}>{recipe.tempo}</Text>
                      </View>
                      <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('Detalhes', { receita: recipe })}>
                        <Text style={styles.viewBtnText}>Ver receita</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <AdvancedFilterModal visible={modalVisible} onClose={() => setModalVisible(false)} onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} isDark={isDark} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { marginTop: 12, marginBottom: 16 },
  dateText: { fontSize: 13, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '700', marginTop: 2 },
  searchSection: { position: 'relative', zIndex: 10, marginBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderWidth: 1.5, gap: 10 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  filterBtnText: { fontSize: 12, fontWeight: '600' },
  autocompleteDropdown: { position: 'absolute', top: 52, left: 0, right: 0, borderRadius: 14, borderWidth: 1, elevation: 4 },
  autocompleteItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  autocompleteText: { fontSize: 14, fontWeight: '500' },
  filterScroll: { flexDirection: 'row', marginBottom: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, marginRight: 8 },
  findSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCard: { width: '48%', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, gap: 10, borderWidth: 1 },
  gridIcon: { fontSize: 18 },
  gridLabel: { fontSize: 13, fontWeight: '600', flexShrink: 1 },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  resultsTitle: { fontSize: 18, fontWeight: '700' },
  resultsCount: { fontSize: 13, marginTop: 2 },
  seeAllText: { fontSize: 12, color: '#C46B3E', fontWeight: '700' },
  centerState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  errorIconContainer: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stateText: { fontSize: 13, textAlign: 'center', marginTop: 8, maxWidth: 280 },
  emptyTitle: { fontSize: 15, fontWeight: '600', marginTop: 10, textAlign: 'center' },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#2E4A2E', paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, marginTop: 14 },
  retryBtnText: { color: '#FAF6F0', fontSize: 12, fontWeight: '700' },
  recipeList: { gap: 16 },
  card: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  cardImageContainer: { height: 160, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  favoriteBtn: { position: 'absolute', top: 10, right: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(250,246,240,0.92)', alignItems: 'center', justifyContent: 'center' },
  cardContent: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoGroup: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontSize: 12, fontWeight: '500' },
  viewBtn: { backgroundColor: '#2E4A2E', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  viewBtnText: { color: '#FAF6F0', fontSize: 12, fontWeight: '700' },
});