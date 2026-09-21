import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HeroHeader({
  imagemUrl,
  avaliacao,
  avaliacoesCount,
  isFavorito,
  onBackPress,
  onFavoritoToggle,
}) {
  return (
    <View style={styles.heroContainer}>
      <Image source={{ uri: imagemUrl }} style={styles.heroImage} />
      <View style={styles.heroOverlay} />

      <View style={styles.topActions}>
        <TouchableOpacity style={styles.circleButton} onPress={onBackPress}>
          <Ionicons name="chevron-back" size={22} color="#2C2016" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.circleButton} onPress={onFavoritoToggle}>
          <Ionicons
            name={isFavorito ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorito ? '#C46B3E' : '#2C2016'}
          />
        </TouchableOpacity>
      </View>

      {avaliacao && (
        <View style={styles.ratingBadge}>
          <View style={styles.starsRow}>
            {[...Array(5)].map((_, i) => (
              <Ionicons key={i} name="star" size={13} color="#C46B3E" />
            ))}
          </View>
          <Text style={styles.ratingText}>
            {avaliacao} · {avaliacoesCount} avaliações
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    position: 'relative',
    height: 280,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 12, 4, 0.25)',
  },
  topActions: {
    position: 'absolute',
    top: 20,
    left: 18,
    right: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(250, 246, 240, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 16,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 12, 4, 0.65)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FAF6F0',
  },
});