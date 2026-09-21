import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getFavoritos, toggleFavoritoStorage } from '../utils/storage';

export default function FavoritosScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);

  // Atualiza os dados sempre que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const carregar = async () => {
        const dados = await getFavoritos();
        if (active) {
          setFavoritos(dados);
        }
      };

      carregar();

      return () => {
        active = false;
      };
    }, [])
  );

  const handleRemove = async (receita) => {
    const novaLista = await toggleFavoritoStorage(receita);
    setFavoritos(novaLista);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
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
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.titulo || item.nome}
        </Text>
        <Text style={styles.cardMeta}>
          {item.tempo ? `${item.tempo} • ` : ''}
          {item.dificuldade || ''}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => handleRemove(item)}
      >
        <Ionicons name="heart" size={22} color="#E74C3C" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Receitas Favoritas</Text>
      </View>

      {favoritos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={60} color="#C4B7A6" />
          <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
          <Text style={styles.emptySubtitle}>
            Toque no coração de uma receita para guardá-la nesta lista.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEBE4',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C2016',
  },
  listContent: {
    padding: 20,
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEBE4',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    color: '#2C2016',
  },
  cardMeta: {
    fontSize: 13,
    color: '#7A685B',
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
    color: '#5C4E43',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8A7B70',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});