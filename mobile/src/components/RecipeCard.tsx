import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Receita } from '../model/receita';

type RecipeCardProps = {
  receita: Receita;
  isFav: boolean;
  onToggleFav: (receita: Receita) => void;
  onPress: () => void;
  isDark: boolean;
};

export default function RecipeCard({
  receita,
  isFav,
  onToggleFav,
  onPress,
  isDark,
}: RecipeCardProps) {
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
            e.stopPropagation();
            onToggleFav(receita);
          }}
        >
          <Feather
            name="heart"
            size={14}
            color={isFav ? '#C46B3E' : '#9B8574'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.recipeInfo}>
        <Text
          style={[
            styles.recipeTitle,
            { color: isDark ? '#FAF6F0' : '#2C2016' },
          ]}
        >
          {receita.titulo}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recipeCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  recipeImageWrapper: {
    height: 110,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(250,246,240,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeInfo: {
    padding: 10,
  },
  recipeTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 16,
  },
});