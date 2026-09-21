import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ProfileMenuList({ onNavigateFavoritos, isDark }) {
  const menuItems = [
    {
      id: 'favoritos',
      title: 'Favoritos',
      subtitle: 'Suas receitas salvas',
      icon: 'heart',
      iconColor: '#C46B3E',
      onPress: onNavigateFavoritos,
    },
    {
      id: 'planejamento',
      title: 'Planejamento semanal',
      subtitle: 'Organize sua semana',
      icon: 'calendar',
      iconColor: '#6B8C6B',
      onPress: () => {},
    },
    {
      id: 'compras',
      title: 'Lista de compras',
      subtitle: 'Itens que você precisa comprar',
      icon: 'shopping-bag',
      iconColor: '#A0684A',
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>MEU APLICATIVO</Text>

      <View style={styles.menuList}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              {
                backgroundColor: isDark ? '#15251C' : '#FFFFFF',
                borderColor: isDark ? '#233A2C' : '#E8DFD3',
              },
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrapper}>
              <Feather name={item.icon} size={18} color={item.iconColor} />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={[styles.menuTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>
                {item.title}
              </Text>
              <Text style={[styles.menuSubtitle, { color: isDark ? '#8A9E90' : '#8A7A6C' }]}>
                {item.subtitle}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={isDark ? '#8A9E90' : '#8A7A6C'} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A7A6C',
    letterSpacing: 1,
    marginBottom: 10,
  },
  menuList: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  menuIconWrapper: {
    marginRight: 12,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
});