import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function RecipeCard({ receita, isFav, onToggleFav, onPress, isDark }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.recipeCard,
        {
          backgroundColor: isDark ? '#15251C' : '#FFFFFF',
          borderColor: isDark ? '#233A2C' : '#E8DFD3',
        },
      ]}
    >
      <View style={styles.recipeImageWrapper}>
        <Image source={{ uri: receita.imagem }} style={styles.recipeImage} />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={(e) => {
            e.stopPropagation(); // Evita acionar o clique do card ao apertar no coração
            onToggleFav(receita.id);
          }}
        >
          <Feather
            name="heart"
            size={14}
            color={isFav ? '#C46B3E' : '#9B8574'}
            style={{ fill: isFav ? '#C46B3E' : 'none' }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.recipeInfo}>
        <Text style={[styles.recipeTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>
          {receita.titulo}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recipeCard: { width: '48%', borderRadius: 16, borderWidth: 1.5, overflow: 'hidden' },
  recipeImageWrapper: { height: 110, position: 'relative' },
  recipeImage: { width: '100%', height: '100%' },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(250,246,240,0.9)',
    justifyContent: 'center', // Corrigido de "justify" para "justifyContent"
    alignItems: 'center',
  },
  recipeInfo: { padding: 10 },
  recipeTitle: { fontSize: 12.5, fontWeight: '600', lineHeight: 16 },
});