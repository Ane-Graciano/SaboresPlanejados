import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FavoritosHeader({ totalReceitas, isDark }) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>SABORES PLANEJADOS</Text>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>
            Meus favoritos
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#A2B3A7' : '#8A7A6C' }]}>
            Suas receitas salvas para preparar{'\n'}quando quiser.
          </Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalReceitas} receitas</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 22,
    paddingTop: 14,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B8C6B',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  badge: {
    backgroundColor: '#2E4A2E',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 4,
  },
  badgeText: {
    color: '#FAF6F0',
    fontSize: 12,
    fontWeight: '700',
  },
});