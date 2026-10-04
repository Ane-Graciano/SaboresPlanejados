import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ProfileStatsRow({ favoritosCount, planejadasCount, salvasCount, onNavigateFavoritos, isDark }) {
  return (
    <View style={styles.statsContainer}>
      {/* Botão Dinâmico de Favoritos */}
      <TouchableOpacity
        style={[
          styles.statCard,
          {
            backgroundColor: isDark ? '#15251C' : '#FFFFFF',
            borderColor: isDark ? '#233A2C' : '#E8DFD3',
          },
        ]}
        onPress={onNavigateFavoritos}
        activeOpacity={0.7}
      >
        <Feather name="heart" size={18} color="#C46B3E" />
        <Text style={[styles.statNumber, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>
          {favoritosCount}
        </Text>
        <Text style={[styles.statLabel, { color: isDark ? '#8A9E90' : '#8A7A6C' }]}>
          Favoritos
        </Text>
      </TouchableOpacity>

      {/* Planejadas */}
      <TouchableOpacity
        style={[
          styles.statCard,
          {
            backgroundColor: isDark ? '#15251C' : '#FFFFFF',
            borderColor: isDark ? '#233A2C' : '#E8DFD3',
          },
        ]}
        activeOpacity={0.7}
      >
        <Feather name="calendar" size={18} color="#6B8C6B" />
        <Text style={[styles.statNumber, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>
          {planejadasCount}
        </Text>
        <Text style={[styles.statLabel, { color: isDark ? '#8A9E90' : '#8A7A6C' }]}>
          Planejadas
        </Text>
      </TouchableOpacity>

      {/* Salvas */}
      <TouchableOpacity
        style={[
          styles.statCard,
          {
            backgroundColor: isDark ? '#15251C' : '#FFFFFF',
            borderColor: isDark ? '#233A2C' : '#E8DFD3',
          },
        ]}
        activeOpacity={0.7}
      >
        <Feather name="bookmark" size={18} color="#5B7FA6" />
        <Text style={[styles.statNumber, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>
          {salvasCount}
        </Text>
        <Text style={[styles.statLabel, { color: isDark ? '#8A9E90' : '#8A7A6C' }]}>
          Salvas
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justify: 'space-between',
    marginVertical: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
});