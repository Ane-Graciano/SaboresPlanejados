import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function FavoritosEmptyState({ onExplore, isDark }) {
  return (
    <View style={styles.container}>
      <Feather name="heart" size={48} color={isDark ? '#3E5C43' : '#C46B3E'} />
      <Text style={[styles.title, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>
        Nenhuma receita favoritada
      </Text>
      <Text style={[styles.subtitle, { color: isDark ? '#8A9E90' : '#8A7A6C' }]}>
        Guarde suas receitas preferidas para acessar rapidamente quando quiser.
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDark ? '#3E5C43' : '#C46B3E' }]}
        onPress={onExplore}
      >
        <Text style={styles.buttonText}>Explorar Receitas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justify: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});