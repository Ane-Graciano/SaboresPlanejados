import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import RecipeCard from '../components/RecipeCard';
import {
  CATEGORIAS,
  FILTROS_RAPIDOS,
  RECEITAS_DESTAQUE,
  RECEITAS_SUGERIDAS,
} from '../data/mockReceitas';

export default function HomeScreen({ navigation, theme, toggleTheme }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Hoje');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const isDark = theme === 'dark';

  const toggleFav = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Função para navegar até a tela de Detalhes
  const handleAbrirDetalhes = (receita) => {
    navigation?.navigate('Detalhes', { receita });
  };

  const receitasFiltradas = RECEITAS_SUGERIDAS.filter((receita) =>
    receita.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1912' : '#FBF8F3' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: isDark ? '#6B8C6B' : '#6B8C6B' }]}>SABORES PLANEJADOS</Text>
            <Text style={[styles.title, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>
              Olá! O que vamos{'\n'}cozinhar hoje?
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={[styles.themeToggle, { backgroundColor: isDark ? '#172B20' : '#E8DFD3', borderColor: isDark ? '#2D4536' : '#D4C8BA' }]}
              onPress={toggleTheme}
            >
              <Feather name={isDark ? "sun" : "moon"} size={18} color={isDark ? "#FAF6F0" : "#2C2016"} />
            </TouchableOpacity>

            <View style={[styles.avatar, { backgroundColor: isDark ? '#172B20' : '#E8DFD3', borderColor: isDark ? '#2D4536' : '#D4C8BA' }]}>
              <Feather name="user" size={18} color={isDark ? "#A2B3A7" : "#9B8574"} />
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: isDark ? '#15251C' : '#FFFFFF', borderColor: isDark ? '#233A2C' : '#DDD4C8' }]}>
          <Feather name="search" size={18} color={isDark ? '#687B6E' : '#9B8574'} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FAF6F0' : '#2C2016' }]}
            placeholder="Buscar receitas..."
            placeholderTextColor={isDark ? '#687B6E' : '#B8A898'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={18} color={isDark ? '#687B6E' : '#9B8574'} />
            </TouchableOpacity>
          )}
        </View>

        {/* Em destaque */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Em destaque</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {RECEITAS_DESTAQUE.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.featuredCard}
              activeOpacity={0.9}
              onPress={() => handleAbrirDetalhes(item)}
            >
              <Image source={{ uri: item.imagem }} style={styles.featuredImage} />
              <View style={styles.featuredOverlay} />
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredTitle}>{item.titulo}</Text>
                <View style={styles.timeBadge}>
                  <Feather name="clock" size={12} color="rgba(250,246,240,0.85)" />
                  <Text style={styles.timeText}>{item.tempo}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Categorias */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Categorias</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {CATEGORIAS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.categoryItem} 
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(isSelected ? null : cat.id)}
              >
                <View style={[
                  styles.categoryCircle, 
                  { backgroundColor: isSelected ? '#2E4A2E' : (isDark ? '#1B2E23' : '#F0EAE0') }
                ]}>
                  <Text style={{ fontSize: 20 }}>{cat.emoji}</Text>
                </View>
                <Text style={[styles.categoryLabel, { color: isDark ? '#A2B3A7' : '#5A4E43' }]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Quick Filters */}
        <View style={styles.filterContainer}>
          {FILTROS_RAPIDOS.map((f) => {
            const isActive = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? '#2E4A2E' : 'transparent',
                    borderColor: isActive ? 'transparent' : (isDark ? '#2D4536' : '#DDD4C8'),
                  },
                ]}
              >
                <Text style={[styles.filterText, { color: isActive ? '#FAF6F0' : (isDark ? '#A2B3A7' : '#5A4E43'), fontWeight: isActive ? '700' : '500' }]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Receitas para você */}
        <View style={styles.sectionHeaderBetween}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Receitas para você</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('Buscar')}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {/* Grid de Receitas */}
        <View style={styles.gridContainer}>
          {receitasFiltradas.map((r) => (
            <RecipeCard
              key={r.id}
              receita={r}
              isFav={favorites.includes(r.id)}
              onToggleFav={toggleFav}
              onPress={() => handleAbrirDetalhes(r)}
              isDark={isDark}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 22, paddingTop: 18 },
  headerRight: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 10 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 23, fontWeight: '700', lineHeight: 28 },
  themeToggle: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 22, marginTop: 16, paddingHorizontal: 16, height: 48, borderRadius: 14, borderWidth: 1.5, gap: 10 },
  searchInput: { flex: 1, fontSize: 15, height: '100%' },
  
  sectionHeader: { paddingHorizontal: 22, marginTop: 20, marginBottom: 12 },
  sectionHeaderBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, marginTop: 22, marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  seeAllText: { fontSize: 12.5, fontWeight: '600', color: '#C46B3E' },
  
  horizontalScroll: { paddingLeft: 22 },
  featuredCard: { width: 180, height: 140, borderRadius: 16, marginRight: 12, overflow: 'hidden', position: 'relative' },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20, 12, 4, 0.45)' },
  featuredInfo: { position: 'absolute', bottom: 10, left: 10, right: 10 },
  featuredTitle: { color: '#FAF6F0', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { color: 'rgba(250,246,240,0.85)', fontSize: 11 },
  
  categoryItem: { alignItems: 'center', marginRight: 16 },
  categoryCircle: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  categoryLabel: { fontSize: 10.5, fontWeight: '500' },
  
  filterContainer: { flexDirection: 'row', gap: 8, paddingHorizontal: 22, marginTop: 14 },
  filterChip: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: 50, borderWidth: 1.5 },
  filterText: { fontSize: 13 },
  
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 22 },
});