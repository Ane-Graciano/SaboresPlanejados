import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getFavoritos, toggleFavoritoStorage } from '../utils/storage';
import { Receita } from '../model/receita';

interface FavoritosScreenProps {
  navigation: any;
  route?: any;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function FavoritosScreen({
  navigation,
  theme = 'light',
}: FavoritosScreenProps) {
  const [favoritos, setFavoritos] = useState<Receita[]>([]);
  const isDark = theme === 'dark';

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const carregar = async () => {
        try {
          const dados = await getFavoritos();

          if (active) {
            setFavoritos(dados);
          }
        } catch (error) {
          console.error('Erro ao carregar favoritos:', error);

          if (active) {
            setFavoritos([]);
          }
        }
      };

      carregar();

      return () => {
        active = false;
      };
    }, []),
  );

  const handleRemove = async (receita: Receita) => {
    try {
      const novaLista = await toggleFavoritoStorage(receita);
      setFavoritos(novaLista);
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  const renderItem = ({ item }: { item: Receita }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#16251C' : '#FFFFFF',
          borderColor: isDark ? '#2A3C30' : '#EFEBE4',
        },
      ]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('Detalhes', { receita: item })}
    >
      <Image
        source={
          typeof item.imagem === 'string'
            ? { uri: item.imagem }
            : item.imagem
        }
        style={styles.cardImage}
      />

      <View style={styles.cardInfo}>
        <Text
          style={[
            styles.cardTitle,
            { color: isDark ? '#E0E7E1' : '#2C2016' },
          ]}
          numberOfLines={1}
        >
          {item.titulo}
        </Text>

        <Text
          style={[
            styles.cardMeta,
            { color: isDark ? '#94A398' : '#7A685B' },
          ]}
        >
          {item.tempo ? `${item.tempo} • ` : ''}
          {item.dificuldade || ''}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => handleRemove(item)}
        activeOpacity={0.7}
      >
        <Ionicons name="heart" size={22} color="#E74C3C" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0D1912' : '#FAF8F5' },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View
        style={[
          styles.header,
          { borderBottomColor: isDark ? '#1A2B20' : '#EFEBE4' },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDark ? '#E0E7E1' : '#2C2016'}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? '#E0E7E1' : '#2C2016' },
          ]}
        >
          Minhas Receitas Favoritas
        </Text>
      </View>

      {favoritos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="heart-dislike-outline"
            size={60}
            color={isDark ? '#3A4D40' : '#C4B7A6'}
          />

          <Text
            style={[
              styles.emptyTitle,
              { color: isDark ? '#E0E7E1' : '#5C4E43' },
            ]}
          >
            Nenhum favorito ainda
          </Text>

          <Text
            style={[
              styles.emptySubtitle,
              { color: isDark ? '#94A398' : '#8A7B70' },
            ]}
          >
            Toque no coração de uma receita para guardá-la nesta lista.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#EAE6DF',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardMeta: {
    fontSize: 13,
    marginTop: 4,
  },
  heartButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});