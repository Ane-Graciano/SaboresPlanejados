import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CATEGORY_COLORS } from '../data/favoritosMock';

interface Favorito {
  id: string;
  titulo: string;
  categoria?: string;
  tempo: string;
  avaliacao?: number;
  imagem: string;
}

interface FavoritoCardProps {
  item: Favorito;
  onPress: () => void;
  onToggleFav: (item: Favorito) => void;
  isDark: boolean;
}

export default function FavoritoCard({
  item,
  onPress,
  onToggleFav,
  isDark,
}: FavoritoCardProps) {
  const catColor = CATEGORY_COLORS[item.categoria as keyof typeof CATEGORY_COLORS] || '#6B8C6B';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#15251C' : '#FFFFFF',
          borderColor: isDark ? '#233A2C' : '#E8DFD3',
        },
      ]}
      activeOpacity={0.88}
      onPress={onPress}
    >
      <View style={styles.cardImageWrapper}>
        <Image source={{ uri: item.imagem }} style={styles.cardImage} />
        <View style={[styles.categoryDot, { backgroundColor: catColor }]} />
      </View>
      <View style={styles.cardContent}>
        <View>
          <Text style={[styles.cardCategory, { color: catColor }]}>
            {item.categoria || 'RECEITA'}
          </Text>
          <Text
            style={[
              styles.cardTitle,
              { color: isDark ? '#FAF6F0' : '#2C2016' },
            ]}
            numberOfLines={2}
          >
            {item.titulo}
          </Text>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.metaGroup}>
            <View style={styles.metaItem}>
              <Feather
                name="clock"
                size={12}
                color={isDark ? '#8A9E90' : '#8A7A6C'}
              />
              <Text
                style={[
                  styles.metaText,
                  { color: isDark ? '#8A9E90' : '#8A7A6C' },
                ]}
              >
                {item.tempo}
              </Text>
            </View>
            {item.avaliacao !== undefined && (
              <View style={styles.metaItem}>
                <Feather name="star" size={12} color="#C46B3E" />
                <Text
                  style={[
                    styles.metaTextBold,
                    { color: isDark ? '#D0C4B6' : '#5A4E43' },
                  ]}
                >
                  {item.avaliacao}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={(e) => {
              e.stopPropagation();
              onToggleFav(item);
            }}
          >
            <Feather name="heart" size={15} color="#C46B3E" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    height: 115,
  },
  cardImageWrapper: {
    width: 108,
    height: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  categoryDot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardCategory: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaTextBold: {
    fontSize: 12,
    fontWeight: '700',
  },
  heartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDF0EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});